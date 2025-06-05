import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { selectAllAvaliacoes } from '../features/CarregaAvaliacoesSlice';
import { selectAllQuestionarios } from "../features/QuestionarioSlice";
import { selectAllUsuarios } from '../features/UsariosSlice';
import { selectAllPerguntasPerfil } from '../features/PerfilSlice';
import { Header } from '../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { RightTitleComponent } from '../components/RightTitleComponent';
import { selectAllPerguntas } from '../features/PerguntasSlice';

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
    const perguntasPerfil = useSelector(selectAllPerguntasPerfil);

    const [filtros, setFiltros] = useState({
        faixaEtaria: [],
        escolaridade: [],
        familiaridade: []
    });

    const filtrarLista = (lista, filtros) => {
        return lista
            .filter(item => (
                (filtros.faixaEtaria.length === 0 || filtros.faixaEtaria.includes(item["-O9RZpD7DTQTQ-dwKCJw"])) &&
                (filtros.escolaridade.length === 0 || filtros.escolaridade.includes(item["-O9RZykzuzqNYlAg_xd1"])) &&
                (filtros.familiaridade.length === 0 || filtros.familiaridade.includes(item["-O9R_5KiJFTMaGU7stem"]))
            ))
            .map(item => item.id);
    };

    const removerUsuarios = (lista, idsUsuarios) => {
        const listaCopia = JSON.parse(JSON.stringify(lista));

        for (let chave in listaCopia) {
            listaCopia[chave] = listaCopia[chave].filter(item => idsUsuarios.includes(item.idUsuario));
            if (listaCopia[chave].length === 0) {
                delete listaCopia[chave];
            }
        }
        return listaCopia;
    };

    const agruparPorPdf = (id, index, agruparPorPergunta) => {
        const agrupado = agruparPorPergunta[id].reduce((acc, item) => {
            if (!acc[item.idPdf]) {
                acc[item.idPdf] = [];
            }
            const { idPdf, ...itemSemIdPdf } = item;
            acc[item.idPdf].push(itemSemIdPdf);
            return acc;
        }, {});
        return { idPergunta: id, nome: "Pergunta " + index, value: agrupado }
    };

    const atualizarFiltros = (tipo, valor) => {
        setFiltros(prevFiltros => ({
            ...prevFiltros,
            [tipo]: prevFiltros[tipo].includes(valor)
                ? prevFiltros[tipo].filter(item => item !== valor)
                : [...prevFiltros[tipo], valor]
        }));
    };

    const listaFiltrada = filtrarLista(usuarios, filtros);
    const avaliacaoFiltrada = removerUsuarios(avaliacao, listaFiltrada);
    const av = avaliacaoFiltrada[questionario.id] || null;

    if (av) {
        const agruparPorPergunta = av.reduce((acc, item) => {
            if (!acc[item.idPergunta]) {
                acc[item.idPergunta] = [];
            }
            const { idPergunta, ...itemSemIdPergunta } = item;
            acc[item.idPergunta].push(itemSemIdPergunta);
            return acc;
        }, {});

        questionario.perguntas.forEach((p, index) => {
            medias.push(agruparPorPdf(p, index + 1, agruparPorPergunta));
        });

        medias.forEach((t) => {
            for (const id in t.value) {
                const respostas = t.value[id];
                const totalNotas = respostas.reduce((soma, resposta) => soma + resposta.nota, 0);
                const media = totalNotas / respostas.length;
                const index = questionario.listPdf.findIndex(item => item.id === id);
                t["pdf" + (index + 1)] = media.toFixed(2);
            }
        });
    }

    return (
        <div>
            <Header headerText={questionarioNome} onVoltar={() => navigate(-1)} headerButtons grafico />
            <div className="div-notas">

                <div className='div-filtros'>
                    <p className='filtros-geral-title'>Filtros</p>
                    <button className="underline-button limpar-filtro" onClick={() => setFiltros({ faixaEtaria: [], escolaridade: [], familiaridade: [] })}>limpar filtros</button>
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

                {medias.length ?
                    <div className='div-geral-grafico'>
                        <RightTitleComponent className="div-top"
                            titleText={"Gráfico das médias das notas de cada pergunta para cada pdf"}
                            nomeQuestionario={"As notas foram dadas de a 1 a 5"}
                        />
                        <div className='div-grafico'>
                            <ResponsiveContainer width="70%" height="100%">
                                <BarChart
                                    width={500}
                                    height={300}
                                    data={medias}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="nome" />
                                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="pdf1" fill="#A7C7E7" />
                                    <Bar dataKey="pdf2" fill="#FBC49C" />
                                </BarChart>
                            </ResponsiveContainer>
                            <div className="div-grafico-legenda">
                                <h2>Legenda</h2>
                                <h4>Perguntas</h4>
                                {medias.map((m, index) => (
                                    <p>{index + 1}. {perguntas.find(p => p.id === m.idPergunta).questao.pergunta}</p>
                                ))}
                                <h4>Pdfs</h4>
                                {questionario.listPdf.map((pdf, index) => (
                                    <div>
                                        <span>{index + 1}. </span>
                                        <a href={pdf.url} target="_blank" rel="noreferrer noopener">Cliquei aqui para abrir o pdf {index + 1}</a>
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
