import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Bar, XAxis, YAxis, ResponsiveContainer, BarChart, Tooltip, CartesianGrid, LabelList } from 'recharts';
import { selectAllQuestionarios } from "../features/QuestionarioSlice";
import { Header } from '../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { selectAllRespostas } from '../features/CarregaRespostasSlice';
import { RightTitleComponent } from '../components/RightTitleComponent';
import { selectAllPerguntasPerfil } from '../features/PerfilSlice';
import { selectAllUsuarios } from '../features/UsariosSlice';

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
    const colors = ['#82ca9d', '#8884d8', '#AA12B1'];    

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

    console.log(confiancaFiltrada);
    

    const result = confiancaPorPdf.map(item => {
        const confiancas = item.confiancaPorQuestionario.reduce((acc, valor) => {
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
        const confiancas = r.confiancas;
        valoresEsperados.forEach((valor) => {
            if (!confiancas.some(c => c.valor === valor)) {
                confiancas.push({ valor, quantidade: 0 });
            }
        });

        r.confiancas.sort((a, b) => {
            const valueA = valoresEsperados.indexOf(a.valor);
            const valueB = valoresEsperados.indexOf(b.valor);
            return valueA - valueB;
        });
    });

    const total = (data) => {
        return data.reduce((sum, item) => sum + item.quantidade, 0);
    };

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
                            titleText={"Gráfico da confiança dos usuários para responder o questionário a partir de cada PDF"}
                        />
                        <div className='div-grafico-confianca-container'>
                            <div className='div-graficos-confianca'>
                                {result.map((r, index) => (
                                    r && r.confiancas && r.confiancas.length > 0 ? (
                                        <div key={r.idPdf} style={{ width: '100%', height: `${100 / result.length}%` }}>
                                            <p>pdf {index + 1}</p>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart width={150} height={40} data={r.confiancas}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="valor" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Bar dataKey="quantidade" fill={colors[index]}>
                                                        <LabelList dataKey="quantidade" position="center" fill="#000000" formatter={(value) => (value ? `${value} (${((value / total(r.confiancas)) * 100).toFixed(1)}%)` : null)} />
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>)
                                        : (
                                            <div key={r.idPdf} style={{ width: '100%', height: `${100 / result.length}%` }}>
                                                <p>pdf {index + 1} - Sem dados para exibir</p>
                                            </div>
                                        )))}
                            </div>
                            <div className="div-grafico-legenda">
                                <h2>Legenda</h2>
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
