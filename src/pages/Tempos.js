import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAllQuestionarios } from "../features/QuestionarioSlice";
import { Header } from '../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { selectAllRespostas } from '../features/CarregaRespostasSlice';
import { RightTitleComponent } from '../components/RightTitleComponent';
import { selectAllPerguntasPerfil } from '../features/PerfilSlice';
import { selectAllUsuarios } from '../features/UsariosSlice';
import ReactApexChart from 'react-apexcharts';

export const Tempos = () => {
    const params = useParams();
    const navigate = useNavigate();
    const questionarios = useSelector(selectAllQuestionarios);
    const questionario = questionarios.todosQuestionarios.find(q => q.id === params.idQuestionario);
    const questionarioNome = questionario.nome;
    const usuarios = useSelector(selectAllUsuarios);
    const allRrespostas = useSelector(selectAllRespostas);
    const respostasQuestionario = allRrespostas.find(r => r.id === questionario.id);
    const perguntasPerfil = useSelector(selectAllPerguntasPerfil);
    const [filtrosAbertos, setFiltrosAbertos] = useState(false);

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
        return avaliacoes.filter(resposta =>
            idsUsuariosPermitidos.includes(resposta.idUsuario)
        );
    };

    const agruparPorPdf = (lista) => {
        const agrupado = {};

        lista.forEach(item => {
            const { idPdf, tempoPorQuestionario } = item;

            if (!agrupado[idPdf]) {
                agrupado[idPdf] = {
                    idPdf,
                    tempos: []
                };
            }

            agrupado[idPdf].tempos.push(tempoPorQuestionario);
        });

        return Object.values(agrupado);
    }

    const idsUsuariosFiltrados = filtrarUsuariosPorPerfil(usuarios, filtros);
    const respostasFiltrada = filtrarAvaliacoesPorUsuarios(respostasQuestionario.respostasPorQuestionario, idsUsuariosFiltrados);
    const tempoPorPdf = agruparPorPdf(respostasFiltrada);

    const calcularBoxplot = (dados, idPdf) => {
        if (!Array.isArray(dados) || dados.length === 0) {
            throw new Error("A lista fornecida deve ser um array não vazio.");
        }

        const dadosOrdenados = [...dados].sort((a, b) => a - b);

        if (dadosOrdenados.length === 1) {
            const unico = dadosOrdenados[0];
            return {
                pdf: idPdf,
                min: unico,
                lowerQuartile: unico,
                median: unico,
                upperQuartile: unico,
                max: unico,
                outliers: []
            };
        }

        const calcularMediana = (lista) => {
            const n = lista.length;
            const meio = Math.floor(n / 2);
            return n % 2 === 0
                ? (lista[meio - 1] + lista[meio]) / 2
                : lista[meio];
        };

        const n = dadosOrdenados.length;
        const metade = Math.floor(n / 2);

        const lowerHalf = dadosOrdenados.slice(0, metade);
        const upperHalf = n % 2 === 0
            ? dadosOrdenados.slice(metade)
            : dadosOrdenados.slice(metade + 1);

        const Q1 = calcularMediana(lowerHalf);
        const Q3 = calcularMediana(upperHalf);
        const IQR = Q3 - Q1;
        const lowerFence = Q1 - 1.5 * IQR;
        const upperFence = Q3 + 1.5 * IQR;

        const outliers = dadosOrdenados.filter(v => v < lowerFence || v > upperFence);

        return {
            pdf: idPdf,
            min: Math.min(...dadosOrdenados.filter(v => v >= lowerFence && v <= upperFence)),
            lowerQuartile: Q1,
            median: calcularMediana(dadosOrdenados),
            upperQuartile: Q3,
            max: Math.max(...dadosOrdenados.filter(v => v >= lowerFence && v <= upperFence)),
            outliers
        };
    };


    const data = questionario.listPdf.map((pdf, index) => {
        const temposDoPdf = tempoPorPdf.find(t => t.idPdf === pdf.id);

        if (temposDoPdf) {
            return calcularBoxplot(temposDoPdf.tempos, "PDF " + (index + 1));
        } else {
            return {
                pdf: "PDF " + (index + 1),
                min: null,
                lowerQuartile: null,
                median: null,
                upperQuartile: null,
                max: null,
                outliers: []
            };
        }
    });


    const { series, options } = useMemo(() => {
        return {
            series: [
                {
                    name: 'box',
                    type: 'boxPlot',
                    data: data
                        .filter(item => item !== undefined)
                        .map(item => ({
                            x: item.pdf,
                            y: [
                                item.min,
                                item.lowerQuartile,
                                item.median,
                                item.upperQuartile,
                                item.max
                            ],
                            goals: item.outliers.map(outlier => ({
                                value: outlier,
                                strokeWidth: 0,
                                strokeHeight: 10,
                                strokeLineCap: 'round',
                                strokeColor: 'black'
                            }))
                        }))
                }
            ],
            options: {
                chart: {
                    type: 'boxPlot',
                    height: "100%",
                    width: "90%",
                    toolbar: {
                        show: false
                    }
                },
                plotOptions: {
                    boxPlot: {
                        colors: {
                            upper: '#FBC49C',
                            lower: '#FBC49C',
                        },
                    },
                },
                xaxis: {
                    type: 'category',
                },
                tooltip: {
                    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                        const dataPoint = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
                        if (!dataPoint.y || dataPoint.y.some(v => v === null || v === undefined)) {
                            return '<div style="font-style: italic; padding: 16px">Sem dados</div>';
                        }

                        return `
                <div style="padding: 16px; gap: 4px;">
                    <b>Máximo:</b> ${dataPoint.y[4]}<br/>
                    <b>Q3:</b> ${dataPoint.y[3]}<br/>
                    <b>Mediana:</b> ${dataPoint.y[2]}<br/>
                    <b>Q1:</b> ${dataPoint.y[1]}<br/>
                    <b>Mínimo:</b> ${dataPoint.y[0]}
                </div>
            `;
                    }
                }
            }
        }
    }, [data]);

    return (
        <div>
            <Header headerText={questionarioNome} onVoltar={() => navigate('/analise')} headerButtons grafico />
            <div className="div-notas">
                <div className="div-filtros" data-mobile-open={filtrosAbertos}>
                    <div className="filtros-header">
                        <p className='filtros-geral-title'>Filtros</p>
                        <button
                            type="button"
                            className="chevron"
                            aria-expanded={filtrosAbertos}
                            onClick={() => setFiltrosAbertos(v => !v)}
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div id="filtros-corpo" className="filtros-corpo">
                        {perguntasPerfil.map((p) => (
                            <div key={p.id} className="bloco-filtro">
                                <p className='filtro-title'>{p.titulo}</p>

                                <div className="filtro-opcao opcoes-row">
                                    {p.opcoes?.map((item, idx) => (
                                        <label key={idx} className="opcao-inline">
                                            <input
                                                type="checkbox"
                                                checked={filtros[p.filtro].includes(item)}
                                                onChange={() => atualizarFiltros(p.filtro, item)}
                                            />
                                            <span>{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="underline-button limpar-filtro"
                        onClick={() => setFiltros({ faixaEtaria: [], escolaridade: [], familiaridade: [] })}
                    >
                        limpar filtros
                    </button>
                </div>

                {tempoPorPdf.length ? (
                    <div className='div-geral-grafico'>
                        <RightTitleComponent className="div-top"
                            titleText={"Tempo para completar o questionário (em segundos)"}
                            info={"https://datatab.net/tutorial/box-plot"}
                        />

                        <div className='div-grafico'>
                            <div className='grafico-box'>
                                <ReactApexChart options={options} series={series} type="boxPlot" width="100%" height="100%" />
                            </div>
                            <div className="div-grafico-legenda">
                                <h2>Legenda</h2>
                                <h4>Pdfs</h4>
                                {questionario.listPdf.map((pdf, index) => (
                                    <div key={index}>
                                        <span>{index + 1}. </span>
                                        <a href={pdf.url} target="_blank" rel="noreferrer noopener">
                                            Cliquei aqui para abrir o pdf {index + 1}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='div-notas-no-answer'>
                        <p className="no-answers">Não temos respostas para esse caso</p>
                    </div>
                )}
            </div>
        </div>
    );
};