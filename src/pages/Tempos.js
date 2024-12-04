import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ComposedChart, ZAxis, Scatter } from 'recharts';
import { selectAllQuestionarios } from "../features/QuestionarioSlice";
import { Header } from '../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { selectAllRespostas } from '../features/CarregaRespostasSlice';
import { RightTitleComponent } from '../components/RightTitleComponent';
import { selectAllPerguntasPerfil } from '../features/PerfilSlice';
import { selectAllUsuarios } from '../features/UsariosSlice';

export const Tempos = () => {
    const params = useParams();
    const navigate = useNavigate();
    const questionarios = useSelector(selectAllQuestionarios);
    const questionario = questionarios.todosQuestionarios.find(q => q.id === params.idQuestionario);
    const questionarioNome = questionario.nome;
    const usuarios = useSelector(selectAllUsuarios);
    const allRrespostas = useSelector(selectAllRespostas);
    const respostasQuestionario = allRrespostas.find(r => r.id === questionario.id);
    const boxPlots = new Array(questionario.listPdf.length).fill(undefined);
    const perguntasPerfil = useSelector(selectAllPerguntasPerfil);

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

    const listaFiltrada = filtrarLista(usuarios, filtros);
    const respostasFiltrada = removerUsuarios(respostasQuestionario.respostasPorQuestionario, listaFiltrada);
    const tempoPorPdf = agruparPorPdf(respostasFiltrada);

    const calcularBoxplot = (dados, idPdf) => {
        if (!Array.isArray(dados) || dados.length === 0) {
            throw new Error("A lista fornecida deve ser um array não vazio.");
        }

        if (dados.length === 1) {
            return {
                pdf: idPdf,
                min: dados[0],
                lowerQuartile: dados[0],
                median: dados[0],
                upperQuartile: dados[0],
                max: dados[0],
                average: dados[0],
            };
        }

        const dadosOrdenados = [...dados].sort((a, b) => a - b);

        const calcularMediana = (lista) => {
            const n = lista.length;
            const meio = Math.floor(n / 2);
            return n % 2 === 0
                ? (lista[meio - 1] + lista[meio]) / 2
                : lista[meio];
        };

        const lowerHalf = dadosOrdenados.slice(0, Math.floor(dadosOrdenados.length / 2));
        const upperHalf = dadosOrdenados.slice(Math.ceil(dadosOrdenados.length / 2));

        const min = dadosOrdenados[0];
        const max = dadosOrdenados[dadosOrdenados.length - 1];
        const lowerQuartile = calcularMediana(lowerHalf);
        const median = calcularMediana(dadosOrdenados);
        const upperQuartile = calcularMediana(upperHalf);
        const average = dadosOrdenados.reduce((soma, valor) => soma + valor, 0) / dadosOrdenados.length;

        return {
            pdf: idPdf,
            min,
            lowerQuartile,
            median,
            upperQuartile,
            max,
            average,
        };
    }

    const DotBar = (props) => {
        const { x, y, width, height } = props;

        if (x == null || y == null || width == null || height == null) {
            return null;
        }

        return (
            <line
                x1={x + width / 2}
                y1={y + height}
                x2={x + width / 2}
                y2={y}
                stroke={'#252525'}
                strokeWidth={3}
                strokeDasharray={'8'}
            />
        );
    };

    const HorizonBar = (props) => {
        const { x, y, width, height } = props;

        if (x == null || y == null || width == null || height == null) {
            return null;
        }

        return <line x1={x} y1={y} x2={x + width} y2={y} stroke={'#252525'} strokeWidth={3} />;
    };

    const useBoxPlot = (boxPlots) => {
        const data = useMemo(
            () =>
                boxPlots.map((v, index) => {
                    if (v === null || v === undefined) {
                        return {
                            pdf: "PDF " + (index + 1),
                            min: null,
                            bottomWhisker: null,
                            bottomBox: null,
                            topBox: null,
                            topWhisker: null,
                            average: null,
                            size: 500,
                        };
                    }

                    return {
                        pdf: v.pdf,
                        min: v.min,
                        bottomWhisker: v.lowerQuartile - v.min,
                        bottomBox: v.median - v.lowerQuartile,
                        topBox: v.upperQuartile - v.median,
                        topWhisker: v.max - v.upperQuartile,
                        average: v.average,
                        size: 500
                    };
                }),
            [boxPlots]
        );

        return data;
    };

    tempoPorPdf.forEach((t) => {
        const index = questionario.listPdf.findIndex(item => item.id === t.idPdf);
        boxPlots[index] = calcularBoxplot(t.tempos, "PDF " + (index + 1));
    });
    const data = useBoxPlot(boxPlots);

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
                {tempoPorPdf.length ?
                <div className='div-geral-grafico'>
                    <RightTitleComponent className="div-top"
                        titleText={"Tempo para completar o questionário (em segundos)"}
                    />
                    
                        <div className='div-grafico'>
                            <ResponsiveContainer width="70%" height="100%">
                                <ComposedChart data={data}>
                                    <CartesianGrid strokeDasharray='3 3' />
                                    <Bar stackId={'a'} dataKey={'min'} fill={'none'} />
                                    <Bar stackId={'a'} dataKey={'bar'} shape={<HorizonBar />} />
                                    <Bar stackId={'a'} dataKey={'bottomWhisker'} shape={<DotBar />} />
                                    <Bar stackId={'a'} dataKey={'bottomBox'} fill={'#8884d8'} />
                                    <Bar stackId={'a'} dataKey={'bar'} shape={<HorizonBar />} />
                                    <Bar stackId={'a'} dataKey={'topBox'} fill={'#8884d8'} />
                                    <Bar stackId={'a'} dataKey={'topWhisker'} shape={<DotBar />} />
                                    <Bar stackId={'a'} dataKey={'bar'} shape={<HorizonBar />} />
                                    <ZAxis type='number' dataKey='size' range={[0, 250]} />
                                    <Scatter dataKey='average' fill={'#82ca9d'} stroke={'#FEFEFE'} />
                                    <XAxis
                                        dataKey="pdf"
                                        tickFormatter={(value) => value}
                                    />
                                    <YAxis />
                                </ComposedChart>
                            </ResponsiveContainer>
                            <div className="div-grafico-legenda">
                                <h2>Legenda</h2>
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
                :
                <div className='div-notas-no-answer'>
                    <p className="no-answers">Não temos respostas para esse caso</p>
                </div>}
            </div>
        </div>
    );
};
