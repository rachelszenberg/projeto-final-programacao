import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ErrorBar } from 'recharts';
import { selectAllAvaliacoes } from '../features/CarregaAvaliacoesSlice';
import { selectAllQuestionarios } from "../features/QuestionarioSlice";
import { selectAllUsuarios } from '../features/UsariosSlice';
import { selectAllPerguntasPerfil } from '../features/PerfilSlice';
import { Header } from '../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { RightTitleComponent } from '../components/RightTitleComponent';
import { selectAllPerguntas } from '../features/PerguntasSlice';
import { Histograma } from './Histograma';
import { RxChevronDown, RxChevronUp, RxInfoCircled } from 'react-icons/rx';
import { mean } from 'mathjs';

export const Notas = () => {
    const params = useParams();
    const navigate = useNavigate();
    const avaliacao = useSelector(selectAllAvaliacoes);
    const questionarios = useSelector(selectAllQuestionarios);
    const usuarios = useSelector(selectAllUsuarios);
    const perguntas = useSelector(selectAllPerguntas);
    const questionario = questionarios.todosQuestionarios.find(q => q.id === params.idQuestionario);
    const questionarioNome = questionario.nome;
    const medias = [];
    const [showHistograma, setShowHistograma] = useState(false);
    const perguntasPerfil = useSelector(selectAllPerguntasPerfil);

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

    const agruparNotasPorResposta = (idPergunta, respostasPorPergunta) => {
        const agrupadoLista = Object.entries(
            respostasPorPergunta[idPergunta].reduce((acc, item) => {
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
            idPergunta: idPergunta,
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

    const handleToggleHistograma = () => {
        setTimeout(() => {
            setShowHistograma(prev => !prev);
        }, 0);
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

    const calcularMediasEDesvios = () => {
        const resultado = [];

        medias.forEach((perguntaObj, index) => {
            const agrupadoPorPdf = {};

            perguntaObj.value.forEach(resposta => {
                const { idPdf, mediaNotas } = resposta;
                const nota = parseFloat(mediaNotas);

                if (!agrupadoPorPdf[idPdf]) {
                    agrupadoPorPdf[idPdf] = [];
                }

                agrupadoPorPdf[idPdf].push(nota);
            });

            const item = {
                idPergunta: perguntaObj.idPergunta,
                nome: `Pergunta ${index + 1}`
            };

            questionario.listPdf.forEach((pdf, idx) => {
                const notas = agrupadoPorPdf[pdf.id] || [];

                if (notas.length > 0) {
                    const media = notas.reduce((soma, n) => soma + n, 0) / notas.length;
                    const variancia = notas.reduce((soma, n) => soma + Math.pow(n - media, 2), 0) / notas.length;
                    const dp = Math.sqrt(variancia);

                    item[`pdf${idx + 1}`] = parseFloat(media.toFixed(2));
                    item[`pdf${idx + 1}_dp`] = parseFloat(dp.toFixed(2));
                }
            });

            resultado.push(item);
        });

        return resultado;
    };



    const CustomLegend = ({ pdf }) => {
        if (pdf === 1) {
            return (
                <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
                    <div>
                        <span style={{ display: 'inline-block', width: 20, height: 10, backgroundColor: '#A7C7E7' }}></span> pdf1
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ display: 'inline-block', width: 20, height: 3, backgroundColor: '#5A7AAB' }}></span> Média pdf1
                    </div>
                </div>)
        }
        else {
            return (
                <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
                    <div>
                        <span style={{ display: 'inline-block', width: 20, height: 10, backgroundColor: '#FBC49C' }}></span> pdf2
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ display: 'inline-block', width: 20, height: 3, backgroundColor: '#C8874F' }}></span>Média pdf2
                    </div>
                </div >
            )
        }
    };

    const calcularMedias = () => {
        let somaPdf1 = 0;
        let somaPdf2 = 0;
        let total = mediasFinal.length;

        mediasFinal.forEach((item) => {
            somaPdf1 += parseFloat(item.pdf1);
            somaPdf2 += parseFloat(item.pdf2);
        });

        return {
            mediaPdf1: (somaPdf1 / total).toFixed(2),
            mediaPdf2: (somaPdf2 / total).toFixed(2)
        };
    }

    const mediasFinal = calcularMediasEDesvios();

    return (
        <div>
            <Header headerText={questionarioNome} onVoltar={() => navigate('/analise')} headerButtons grafico />
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
                        </div>
                    </div>
                    <button className="underline-button limpar-filtro" onClick={() => setFiltros({ faixaEtaria: [], escolaridade: [], familiaridade: [] })}>limpar filtros</button>
                </div>

                {medias.length ?
                    <div className='div-geral-grafico-nota'>
                        <RightTitleComponent className="div-top"
                            titleText={"Gráfico das médias das notas de cada pergunta para cada pdf"}
                            nomeQuestionario={"As notas foram dadas de a 1 a 7"}
                            info={"https://pt.khanacademy.org/math/pt-3-ano/probabilidade-e-estratistica-3ano/x6bdf3ae2a7b609b9:graficos-de-barras/a/read-bar-graphs"}
                        />
                        <div className='div-grafico-geral'>
                            <div className='div-grafico-e-histograma' style={{ overflowY: "auto", minHeight: 0, maxHeight: "calc(90vh - 220px)" }}>
                                <div className='div-grafico'>
                                    <ResponsiveContainer width="70%" height="100%">
                                        <BarChart
                                            width={500}
                                            height={300}
                                            data={mediasFinal}
                                            margin={{
                                                top: 5,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <ReferenceLine y={5} strokeWidth={5} label={{ value: "max", position: "right" }} />
                                            <XAxis dataKey="nome" />
                                            <YAxis domain={[1, 8]} ticks={[1, 2, 3, 4, 5, 6, 7, 8]} />
                                            <Tooltip />
                                            <Legend content={() => <CustomLegend pdf={1} />} />
                                            <Bar dataKey="pdf1" fill="#A7C7E7">
                                                <ErrorBar
                                                    dataKey="pdf1_dp"
                                                    width={8}
                                                    strokeWidth={1}
                                                    direction="y"
                                                />
                                            </Bar>
                                            <ReferenceLine y={calcularMedias().mediaPdf1} strokeWidth={3} stroke="#5A7AAB" label={{ value: "media: " + calcularMedias().mediaPdf1, position: 'left', fill: '#5A7AAB' }} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                    <ResponsiveContainer width="70%" height="100%">
                                        <BarChart
                                            width={500}
                                            height={300}
                                            data={mediasFinal}
                                            margin={{
                                                top: 5,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <ReferenceLine y={5} strokeWidth={5} label={{ value: "max", position: "right" }} />
                                            <XAxis dataKey="nome" />
                                            <YAxis domain={[1, 8]} ticks={[1, 2, 3, 4, 5, 6, 7, 8]} />
                                            <Tooltip />
                                            <Legend content={<CustomLegend />} />
                                            <Bar dataKey="pdf2" fill="#FBC49C" >
                                                <ErrorBar
                                                    dataKey="pdf2_dp"
                                                    width={8}
                                                    strokeWidth={1}
                                                    direction="y"
                                                />
                                            </Bar>
                                            <ReferenceLine y={calcularMedias().mediaPdf2} strokeWidth={3} stroke="#C8874F" label={{ value: "media: " + calcularMedias().mediaPdf2, position: 'left', fill: '#C8874F' }} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <button className="underline-button show-histograma" onClick={handleToggleHistograma}>{showHistograma ? (
                                    <>
                                        Ver menos <RxChevronUp />
                                    </>
                                ) : (
                                    <>
                                        Ver mais detalhes <RxChevronDown />
                                    </>
                                )}</button>
                                {showHistograma &&
                                    <div className="histograma-div">
                                        <hr />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <p className="title-avaliacao">Distribuição das notas</p>
                                            <a href={"https://www.alura.com.br/artigos/o-que-e-um-histograma?srsltid=AfmBOorwgRYmizpe3y37wIKwMueflzQiICRpm3bvDbbjxMoOqI1ebQ21"} target="_blank" rel="noreferrer noopener"><RxInfoCircled style={{ fontSize: '18px' }}/></a>
                                        </div>
                                        <Histograma medias={medias} />
                                    </div>}
                            </div>
                            <div className="div-grafico-legenda">
                                <h2>Legenda</h2>
                                <h4>Perguntas</h4>
                                {medias.map((m, index) => (
                                    <p key={m.idPergunta}>{index + 1}. {perguntas.find(p => p.id === m.idPergunta).questao.pergunta}</p>
                                ))}
                                <h4>Pdfs</h4>
                                {questionario.listPdf.map((pdf, index) => (
                                    <div key={pdf.url || index}>
                                        <span>{index + 1}. </span>
                                        <a href={pdf.url} target="_blank" rel="noreferrer noopener">Clique aqui para abrir o pdf {index + 1}</a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    : <div className='div-notas-no-answer'>
                        <p className="no-answers">Não temos respostas para esse caso</p>
                    </div>}
            </div>
        </div>
    );
}
