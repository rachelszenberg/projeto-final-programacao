import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend, Line, LineChart } from 'recharts';
import { selectAllQuestionarios } from "../features/QuestionarioSlice";
import { Header } from '../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { selectAllRespostas } from '../features/CarregaRespostasSlice';
import { RightTitleComponent } from '../components/RightTitleComponent';
import { selectAllPerguntasPerfil } from '../features/PerfilSlice';
import { selectAllUsuarios } from '../features/UsariosSlice';
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";
import { selectAllPerguntas } from '../features/PerguntasSlice';

export const Confianca = () => {
    const params = useParams();
    const navigate = useNavigate();
    const questionarios = useSelector(selectAllQuestionarios);
    const questionario = questionarios.todosQuestionarios.find(q => q.id === params.idQuestionario);
    const questionarioNome = questionario.nome;
    const usuarios = useSelector(selectAllUsuarios);
    const allRrespostas = useSelector(selectAllRespostas);
    const respostasQuestionario = allRrespostas.find(r => r.id === questionario.id);
    const perguntasPerfil = useSelector(selectAllPerguntasPerfil);
    const [questao, setQuestao] = useState(0);
    const perguntas = useSelector(selectAllPerguntas);

    const [filtros, setFiltros] = useState({
        faixaEtaria: [],
        escolaridade: [],
        familiaridade: []
    });

    const atualizarFiltros = (tipo, valor) => {
        setFiltros(prevFiltros => ({
            ...prevFiltros,
            [tipo]: prevFiltros[tipo].includes(valor)
                ? prevFiltros[tipo].filter(item => item !== valor)
                : [...prevFiltros[tipo], valor]
        }));
    };

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
        return lista.filter(resposta =>
            idsUsuarios.includes(resposta.idUsuario)
        );
    };

    const agruparPorPdf = (lista) => {
        const agrupado = {};

        lista.forEach(item => {
            const { idPdf, confiancaPorQuestionario } = item;

            if (!agrupado[idPdf]) {
                agrupado[idPdf] = {
                    idPdf,
                    confiancaPorQuestionario: []
                };
            }

            agrupado[idPdf].confiancaPorQuestionario.push(confiancaPorQuestionario);
        });

        return Object.values(agrupado);
    };

    const listaFiltrada = filtrarLista(usuarios, filtros);
    const confiancaFiltrada = removerUsuarios(respostasQuestionario.respostasPorQuestionario, listaFiltrada);
    const confiancaPorPdf = agruparPorPdf(confiancaFiltrada);

    const result = confiancaPorPdf.map(item => {
        const transposto = item.confiancaPorQuestionario[0].map((_, i) =>
            item.confiancaPorQuestionario.map(row => row[i])
        );

        const confiancas = transposto[questao].reduce((acc, valor) => {
            const existing = acc.find(c => c.valor === valor);

            if (existing) {
                existing.quantidade += 1;
            } else {
                acc.push({ valor, quantidade: 1 });
            }

            return acc;
        }, []);

        return {
            idPdf: item.idPdf,
            confiancas: confiancas
        };
    });

    const valoresEsperados = ["1 - Nada confiante", "2", "3", "4", "5 - Muito confiante"];

    result.forEach((r) => {
        let confiancas = r.confiancas;

        confiancas = valoresEsperados.map(valor => {
            const confianca = confiancas.find(c => c.valor === valor);
            if (confianca) {
                return confianca;
            } else {
                return { valor, quantidade: 0 };
            }
        });

        r.confiancas = confiancas;
    });


    // const total = (data) => {
    //     return data.reduce((sum, item) => sum + item.quantidade, 0);
    // };

    questionario.listPdf.forEach((pdf) => {
        if (!result.some((r) => r.idPdf === pdf.id)) {
            result.push({
                idPdf: pdf.id,
                confiancas: []
            });
        }
    });

    result.sort((a, b) => {
        const indexA = questionario.listPdf.findIndex(pdf => pdf.id === a.idPdf);
        const indexB = questionario.listPdf.findIndex(pdf => pdf.id === b.idPdf);
        return indexA - indexB;
    });

    const onPreviousClick = () => {
        setQuestao(questao - 1);
    }

    const onNextClick = () => {
        setQuestao(questao + 1);
    }

    const onQuestaoClick = (q) => {
        setQuestao(q);
    }

    const resultadoGrafico = valoresEsperados.map(valor => {
        const obj = { valor };

        result.forEach(pdf => {
            const confianca = pdf.confiancas.find(c => c.valor === valor);
            obj[`pdf${result.indexOf(pdf) + 1}`] = confianca ? confianca.quantidade : 0;
        });

        return obj;
    });

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
                {confiancaPorPdf.length ?
                    <div className='div-geral-grafico'>
                        <RightTitleComponent className="div-top"
                            titleText={"Gráfico da confiança dos usuários para responder cada questionário a partir de cada PDF"}
                        />
                        <div className='div-grafico-confianca-container'>
                            <div className='div-graficos-confianca'>
                                <div className="div-title-graficos">
                                    <RxChevronLeft className={questao === 0 ? "no-button" : "icon"} onClick={onPreviousClick} />
                                    <p className="title-avaliacao">Questão {questao + 1}</p>
                                    <RxChevronRight className={questao === (questionario.perguntas.length - 1) ? "no-button" : "icon"} onClick={onNextClick} />
                                </div>

                                {resultadoGrafico.length ? (
                                    <div style={{ width: '100%', height: '90%' }}>
                                        {/* <ResponsiveContainer width="100%" height="100%">
                                            <BarChart width={150} height={40} data={resultadoGrafico}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="valor" />
                                                <YAxis domain={[1, 10]} ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="pdf1" fill="#A7C7E7" />
                                                <Bar dataKey="pdf2" fill="#FBC49C" />
                                            </BarChart>
                                        </ResponsiveContainer> */}
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart width={500}
                                                height={300}
                                                data={resultadoGrafico}
                                                margin={{
                                                    top: 5,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="valor" />
                                                <YAxis domain={[1, 20]} ticks={[2, 4, 6, 8, 10, 12, 14, 16, 18, 20]} />
                                                <Tooltip />
                                                <Legend />
                                                <Line dataKey="pdf1" stroke="#A7C7E7" strokeWidth={3} />
                                                <Line dataKey="pdf2" stroke="#FBC49C" strokeWidth={3} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>)
                                    : (
                                        <div style={{ width: '100%', height: `${100 / result.length}%` }}>
                                            <p>Sem dados para exibir</p>
                                        </div>
                                    )}
                            </div>
                            <div className="div-grafico-legenda">
                                <h2>Legenda</h2>
                                <h4>Perguntas</h4>
                                {questionario.perguntas.map((q, index) => (
                                    <p className="grafico-pergunta" onClick={() => onQuestaoClick(index)}>{index + 1}. {perguntas.find(p => p.id === q).questao.pergunta}</p>
                                ))}
                                <h4>Pdfs</h4>
                                {questionario.listPdf.map((pdf, index) => (
                                    <div key={index}>
                                        <span>{index + 1}. </span>
                                        <a href={pdf.url} target="_blank" rel="noreferrer noopener">Cliquei aqui para abrir o pdf {index + 1}</a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    :
                    <div className='div-notas-no-answer'>
                        <p className="no-answers">Não temos respostas para esse caso</p>
                    </div>
                }
            </div>
        </div>
    );
};
