import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAllAvaliacoes } from '../features/CarregaAvaliacoesSlice';
import { selectAllQuestionarios } from "../features/QuestionarioSlice";
import { selectAllUsuarios } from '../features/UsariosSlice';
import { selectAllPerguntasPerfil } from '../features/PerfilSlice';
import { Header } from '../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { RightTitleComponent } from '../components/RightTitleComponent';
import { selectAllPerguntas } from '../features/PerguntasSlice';
import { selectAllRespostas } from '../features/CarregaRespostasSlice';
import { mean } from 'mathjs';
import ReactSlider from 'react-slider';
import { CartesianGrid, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';
import { RxMagnifyingGlass } from 'react-icons/rx';

const aplicarJitter = (valor) => valor + (Math.random() - 0.5) * 0.3;

const cores = [
    { fill: "rgba(136, 132, 216, 0.3)", stroke: "#8884d8" },
    { fill: "rgba(102, 204, 153, 0.3)", stroke: "#66cc99" },
    { fill: "rgba(255, 153, 102, 0.3)", stroke: "#ff9966" },
    { fill: "rgba(233, 102, 186, 0.3)", stroke: "#e966ba" },
    { fill: "rgba(255, 204, 102, 0.3)", stroke: "#ffcc66" },
    { fill: "rgba(102, 204, 255, 0.3)", stroke: "#66ccff" },
    { fill: "rgba(255, 102, 102, 0.3)", stroke: "#ff6666" },
    { fill: "rgba(102, 153, 255, 0.3)", stroke: "#6699ff" },
    { fill: "rgba(153, 255, 102, 0.3)", stroke: "#99ff66" },
];
const colorsPdf = ['#A7C7E790', '#FBC49C90'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
        const data = payload[0].payload;
        return (
            <div
                style={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    padding: "8px",
                    borderRadius: "8px"
                }}
            >
                <p><strong>Confiança:</strong> {data.confiancaQuestao}</p>
                <p><strong>Nota:</strong> {data.mediaNota}</p>
            </div>
        );
    }
    return null;
};

export const ConfiancaNotaGraficoGeral = () => {
    const params = useParams();
    const navigate = useNavigate();
    const avaliacao = useSelector(selectAllAvaliacoes);
    const questionarios = useSelector(selectAllQuestionarios);
    const usuarios = useSelector(selectAllUsuarios);
    const respostas = useSelector(selectAllRespostas);
    const perguntas = useSelector(selectAllPerguntas);
    const questionario = questionarios.todosQuestionarios.find(q => q.id === params.idQuestionario);
    const questionarioNome = questionario.nome;
    const medias = [];
    const perguntasPerfil = useSelector(selectAllPerguntasPerfil);
    const temp = respostas.find(r => r.id === params.idQuestionario);
    const respostasDoQuestionario = temp?.respostasPorQuestionario || [];
    const [rangeNota, setRangeNota] = useState([1, 7]);
    const [rangeConfianca, setRangeConfianca] = useState([1, 7]);
    const [pdfFilter, setPdfFilter] = useState('Todos os pdfs');
    const min = 1;
    const max_nota = 7;
    const max_confianca = 7;
    const [abertas, setAbertas] = useState(
        questionario.perguntas.map(() => true)
    );

    const togglePergunta = (index) => {
        setAbertas(prev => {
            const novas = [...prev];
            novas[index] = !novas[index];
            return novas;
        });
    };

    const [filtros, setFiltros] = useState({
        faixaEtaria: [],
        escolaridade: [],
        familiaridade: []
    });

    const filtrarUsuariosPorPerfil = (usuarios, filtros) => {
        return usuarios
            .filter(usuario => (
                (filtros.faixaEtaria.length === 0 || filtros.faixaEtaria.includes(usuario["-O9RZpD7DTQTQ-dwKCJw"])) &&
                (filtros.escolaridade.length === 0 || filtros.escolaridade.includes(usuario["-O9RZykzuzqNYlAg_xd1"])) &&
                (filtros.familiaridade.length === 0 || filtros.familiaridade.includes(usuario["-O9R_5KiJFTMaGU7stem"]))
            ))
            .map(usuario => usuario.id);
    };

    const filtrarAvaliacoesPorUsuarios = (avaliacoes, idsUsuariosPermitidos) => {
        const copia = JSON.parse(JSON.stringify(avaliacoes));

        for (let chave in copia) {
            copia[chave] = copia[chave].filter(item => idsUsuariosPermitidos.includes(item.idUsuario));
            if (copia[chave].length === 0) {
                delete copia[chave];
            }
        }
        return copia;
    };

    const agruparNotasPorResposta = (id, respostasPorPergunta) => {
        const agrupadoLista = Object.entries(
            respostasPorPergunta[id].reduce((acc, item) => {
                const { idResposta, ...resto } = item;
                if (!acc[idResposta]) {
                    acc[idResposta] = [];
                }
                acc[idResposta].push(resto);
                return acc;
            }, {})
        ).map(([idResposta, lista]) => {
            return {
                idResposta,
                idPdf: lista[0].idPdf,
                idUsuario: lista[0].idUsuario,
                mediaNotas: mean(lista.map(({ nota }) => nota)).toFixed(1)
            };
        });

        return {
            idPergunta: id,
            value: agrupadoLista
        };
    };

    const atualizarFiltros = (tipo, valor) => {
        setFiltros(prevFiltros => ({
            ...prevFiltros,
            [tipo]: prevFiltros[tipo].includes(valor)
                ? prevFiltros[tipo].filter(item => item !== valor)
                : [...prevFiltros[tipo], valor]
        }));
    };

    const idsUsuariosFiltrados = filtrarUsuariosPorPerfil(usuarios, filtros);
    const avaliacoesFiltradas = filtrarAvaliacoesPorUsuarios(avaliacao, idsUsuariosFiltrados);
    const avaliacoesDoQuestionario = avaliacoesFiltradas[questionario.id] || null;

    if (avaliacoesDoQuestionario) {
        const respostasAgrupadasPorPergunta = avaliacoesDoQuestionario.reduce((acc, item) => {
            if (!acc[item.idPergunta]) {
                acc[item.idPergunta] = [];
            }
            const { idPergunta, ...itemSemIdPergunta } = item;
            acc[item.idPergunta].push(itemSemIdPergunta);
            return acc;
        }, {});

        questionario.perguntas.forEach((pergunta, index) => {
            medias.push(agruparNotasPorResposta(pergunta, respostasAgrupadasPorPergunta));
        });
    }

    const respostasPorTodasQuestoes = questionario.perguntas.map((_, index) => {
        const respostasFiltradas = respostasDoQuestionario.filter(({ confiancaPorQuestionario }) => {
            const valor = confiancaPorQuestionario?.[index];
            if (!valor) return rangeConfianca[0] === 0;
            const numero = parseInt(valor.toString().split(" ")[0]);
            return numero >= rangeConfianca[0] && numero <= rangeConfianca[1];
        });

        const respostasComNota = respostasFiltradas.map(resp => {
            const correspondente = medias[index]?.value.find(n => n.idResposta === resp.idResposta);
            if (!correspondente) return null;

            const valor = resp.confiancaPorQuestionario?.[index];
            const confiancaQuestao = parseInt(valor?.toString().split(" ")[0]);

            return {
                idPdf: correspondente.idPdf,
                mediaNotas: parseFloat(correspondente.mediaNotas),
                confiancaQuestao: confiancaQuestao || null
            };
        }).filter(Boolean);

        const respostasFiltradasPorNota = respostasComNota.filter(resp => {
            const nota = resp.mediaNotas;
            return nota >= rangeNota[0] && nota <= rangeNota[1];
        });

        const respostasFiltradasPorPdf = (pdfFilter !== 'Todos os pdfs')
            ? respostasFiltradasPorNota.filter(resp => resp.idPdf === questionario.listPdf[pdfFilter.slice(-1) - 1].id)
            : respostasFiltradasPorNota;

        return {
            questao: "Pergunta " + (index + 1),
            value: respostasFiltradasPorPdf
        };
    });

    const transformarListaPorPdf = () => {
        const resultado = {};

        respostasPorTodasQuestoes.forEach(({ questao, value }) => {
            const chavePergunta = questao.toLowerCase().replace(/\s/g, '');

            value.forEach(({ idPdf, mediaNotas, confiancaQuestao }) => {
                const indexPdf = questionario.listPdf.findIndex(pdf => pdf.id === idPdf);

                if (!resultado[idPdf]) {
                    resultado[idPdf] = { idPdf, indexPdf };
                }

                if (!resultado[idPdf][chavePergunta]) {
                    resultado[idPdf][chavePergunta] = [];
                }

                resultado[idPdf][chavePergunta].push({
                    confiancaQuestao,
                    mediaNota: mediaNotas
                });
            });
        });

        return questionario.listPdf
            .map(pdf => resultado[pdf.id])
            .filter(Boolean);
    };

    const finalTodasPerguntas = transformarListaPorPdf();
    return (
        <div>
            <Header headerText={questionarioNome} onVoltar={() => navigate(-1)} headerButtons grafico />
            <div className="div-notas">
                <div className='div-filtros'>
                    <div>
                        <p className='filtros-geral-title'>Filtros</p>
                        <div>
                            {perguntasPerfil.map((p) => (
                                <div key={p.id}>
                                    <p className='filtro-title'>{p.titulo}</p>
                                    {p.opcoes &&
                                        p.opcoes.map((item, index) => (
                                            <label key={index}>
                                                <p className='filtro-opcao'>
                                                    <input
                                                        type="checkbox"
                                                        checked={filtros[p.filtro].includes(item)}
                                                        onChange={() => atualizarFiltros(p.filtro, item)}
                                                    />
                                                    {item}</p>
                                            </label>
                                        ))
                                    }
                                </div>
                            ))}
                            <div className='filtros-pdf'>
                                <p className='filtro-title'>Por pdf</p>
                                <select value={pdfFilter} onChange={(e) => setPdfFilter(e.target.value)}>
                                    <option>Todos os pdfs</option>
                                    <option>Pdf 1</option>
                                    <option>Pdf 2</option>
                                </select>
                            </div>
                            <div className='filtro-nota-div'>
                                <p className='filtro-title'>Por nota média</p>
                                <div className='filtro-slider'>
                                    <ReactSlider
                                        className="horizontal-slider"
                                        thumbClassName="thumb"
                                        trackClassName="track"
                                        value={rangeNota}
                                        onChange={(value) => setRangeNota(value)}
                                        min={min}
                                        max={max_nota}
                                        pearling
                                        minDistance={0}
                                        renderThumb={(props, state) => {
                                            const { key, ...rest } = props;
                                            return <div key={key} {...rest}>{state.valueNow}</div>;
                                        }}
                                    />

                                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px' }}>
                                        <span>{min}</span>
                                        <span>{max_nota}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='filtro-nota-div'>
                                <p className='filtro-title'>Por confiança</p>
                                <div className='filtro-slider'>
                                    <ReactSlider
                                        className="horizontal-slider"
                                        thumbClassName="thumb"
                                        trackClassName="track"
                                        value={rangeConfianca}
                                        onChange={(value) => setRangeConfianca(value)}
                                        min={min}
                                        max={max_confianca}
                                        pearling
                                        minDistance={0}
                                        renderThumb={(props, state) => {
                                            const { key, ...rest } = props;
                                            return <div key={key} {...rest}>{state.valueNow}</div>;
                                        }}

                                    />

                                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px' }}>
                                        <span>{min}</span>
                                        <span>{max_confianca}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="underline-button limpar-filtro" onClick={() => {
                        setFiltros({ faixaEtaria: [], escolaridade: [], familiaridade: [] });
                        setRangeNota([1, 7]);
                        setRangeConfianca([0, 7]);
                        setPdfFilter('Todos os pdfs');
                    }}>limpar filtros</button>
                </div>

                <div className='div-geral-grafico'>
                    <RightTitleComponent className="div-top"
                        titleText={"Relação da confiança pela nota"}
                        info={"https://blog.proffernandamaciel.com.br/interpretar-grafico-de-dispersao/"}
                    />
                    <div className='div-grafico-confianca-container'>
                        <div className='div-graficos-confianca'>
                            {finalTodasPerguntas.length ? <div className='histograma-div' style={{ overflowY: "auto", flex: 1, minHeight: 0, maxHeight: "calc(90vh - 220px)" }}>
                                <div className='div-resposta-avaliada-container'>
                                    {questionario.perguntas.map((pergunta, indexPergunta) => {
                                        const cor = cores[indexPergunta % cores.length];
                                        const chavePergunta = `pergunta${indexPergunta + 1}`;

                                        const dados = finalTodasPerguntas.map(pdf => ({
                                            idPdf: pdf.idPdf,
                                            indexPdf: pdf.indexPdf,
                                            respostas: pdf[chavePergunta] || []
                                        }));

                                        return (
                                            <div key={indexPergunta} className="div-pergunta">
                                                <div onClick={() => togglePergunta(indexPergunta)} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    cursor: 'pointer',
                                                    userSelect: 'none'
                                                }}>
                                                    <p style={{ margin: 0, maxWidth: "90%" }}>
                                                        <span style={{
                                                            display: 'inline-block',
                                                            transform: abertas[indexPergunta] ? 'rotate(90deg)' : 'rotate(0deg)',
                                                            transition: 'transform 0.2s',
                                                            marginRight: '8px'
                                                        }}>
                                                            ►
                                                        </span>
                                                        <strong>{`Pergunta ${indexPergunta + 1}.`}</strong>{' '}
                                                        {perguntas.find(p => p.id === questionario.perguntas[indexPergunta]).questao.pergunta}
                                                    </p>

                                                    {abertas[indexPergunta] && (
                                                        <RxMagnifyingGlass
                                                            title="Clique aqui para ver mais detalhes"
                                                            style={{ fontSize: '20px', cursor: 'pointer' }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                window.open(`#/analise/confiancaXnota/${params.idQuestionario}/pergunta-${indexPergunta + 1}`, '_blank');
                                                            }}
                                                        />
                                                    )}
                                                </div>


                                                {abertas[indexPergunta] && (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '12px' }}>
                                                        {dados.map(pdf => (
                                                            <div key={pdf.idPdf} style={{
                                                                border: `2px solid ${colorsPdf[pdf.indexPdf]}`,
                                                                borderRadius: '8px',
                                                                padding: '8px',
                                                                flex: '1 1 45%',
                                                                minWidth: '300px'
                                                            }}>
                                                                <ResponsiveContainer width="100%" height={300}>
                                                                    <ScatterChart margin={{ top: 12, right: 12, bottom: 12, left: 12 }}>
                                                                        <CartesianGrid />
                                                                        <ReferenceLine segment={[{ x: 1, y: 1 }, { x: 7, y: 7 }]} stroke="black" strokeDasharray="5 5" />
                                                                        <XAxis type="number" dataKey="confiancaJitter" domain={[1, 7]} ticks={[1, 2, 3, 4, 5, 6, 7]} name="Confiança" />
                                                                        <YAxis type="number" dataKey="notaJitter" domain={[1, 7]} ticks={[1, 2, 3, 4, 5, 6, 7]} name="Nota" />
                                                                        <Tooltip content={<CustomTooltip />} />
                                                                        <Scatter
                                                                            data={pdf.respostas.map(r => ({
                                                                                ...r,
                                                                                confiancaJitter: aplicarJitter(r.confiancaQuestao),
                                                                                notaJitter: aplicarJitter(r.mediaNota),
                                                                            }))}
                                                                            fill={cor.fill}
                                                                            stroke={cor.stroke}
                                                                            strokeWidth={2}
                                                                        />
                                                                    </ScatterChart>
                                                                </ResponsiveContainer>
                                                                <p style={{
                                                                    fontWeight: 'bold',
                                                                    textAlign: 'center',
                                                                    marginTop: '8px'
                                                                }}>{`pdf ${pdf.indexPdf + 1}`}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                            </div> : <div className='div-notas-no-answer-confianca'>
                                <p className="no-answers">Não temos respostas para esse caso</p>
                            </div>}

                        </div>
                        <div className="div-grafico-legenda">
                            <h2>Legenda</h2>
                            <h4>Perguntas</h4>
                            {questionario.perguntas.map((m, index) => (
                                <p key={m}>{index + 1}. {perguntas.find(p => p.id === m).questao.pergunta}</p>
                            ))}
                            <h4>Pdfs</h4>
                            {questionario.listPdf.map((pdf, index) => (
                                <div key={pdf.id || index}>
                                    <span>{index + 1}. </span>
                                    <a href={pdf.url} target="_blank" rel="noreferrer noopener">Cliquei aqui para abrir o pdf {index + 1}</a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
