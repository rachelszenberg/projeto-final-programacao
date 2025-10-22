import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAllQuestionarios } from "../features/QuestionarioSlice";
import { useParams } from 'react-router-dom';
import { AgCharts } from 'ag-charts-react';
import { selectAllPerguntas } from '../features/PerguntasSlice';

export const Histograma = ({ medias }) => {
    const params = useParams();
    const questionarios = useSelector(selectAllQuestionarios);
    const questionario = questionarios.todosQuestionarios.find(q => q.id === params.idQuestionario);
    const perguntas = useSelector(selectAllPerguntas);

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

    return (
        <div>
            {medias.length ? (
                <div className='div-graficos-histograma'>

                    {questionario.perguntas.map((pergunta, questaoIndex) => (
                        <div key={questaoIndex} className='div-pergunta'>
                            <div
                                onClick={() => togglePergunta(questaoIndex)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    userSelect: 'none'
                                }}
                            >
                                <p style={{ margin: 0, maxWidth: "90%" }}>
                                    <span style={{
                                        display: 'inline-block',
                                        transform: abertas[questaoIndex] ? 'rotate(90deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.2s',
                                        marginRight: '8px'
                                    }}>
                                        ►
                                    </span>
                                    <strong>{`Pergunta ${questaoIndex + 1}.`}</strong>{' '}
                                    {perguntas.find(p => p.id === questionario.perguntas[questaoIndex]).questao.pergunta}
                                </p>
                            </div>

                            {abertas[questaoIndex] && (
                                <div style={{ width: '100%', display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: "8px", marginBottom: "12px" }}>
                                    {questionario.listPdf.map((q, index) => {
                                        const transformarLista = () => {
                                            return medias.map(pergunta => {
                                                const agrupadoPorPdf = {};

                                                pergunta.value.forEach(resposta => {
                                                    const { idPdf, mediaNotas } = resposta;

                                                    if (!agrupadoPorPdf[idPdf]) {
                                                        agrupadoPorPdf[idPdf] = [];
                                                    }

                                                    agrupadoPorPdf[idPdf].push({
                                                        nota: parseFloat(mediaNotas)
                                                    });
                                                });

                                                return {
                                                    idPergunta: pergunta.idPergunta,
                                                    pdf: Object.entries(agrupadoPorPdf).map(([idPdf, notas]) => ({
                                                        idPdf,
                                                        notas
                                                    }))
                                                };
                                            });
                                        };

                                        const data = transformarLista();

                                        const notas = data
                                            .find(t => t.idPergunta === pergunta)
                                            ?.pdf.find(pdf => pdf.idPdf === q.id)
                                            ?.notas ?? [];

                                        const options = {
                                            data: notas,
                                            series: [
                                                {
                                                    type: "histogram",
                                                    xKey: "nota",
                                                    xName: "Participante nota",
                                                    fill: index === 0 ? "#A7C7E7" : "#FBC49C",
                                                    stroke: index === 0 ? "#5A7AAB" : "#C8874F",
                                                    bins: [
                                                        [1, 2],
                                                        [2, 3],
                                                        [3, 4],
                                                        [4, 5],
                                                        [5, 6],
                                                        [6, 7],
                                                        [7, 8],
                                                    ]
                                                },
                                            ],
                                            axes: [
                                                {
                                                    type: "number",
                                                    position: "bottom",
                                                    title: { text: "pdf" + (index + 1) },
                                                    min: 1,
                                                    max: 8,
                                                    interval: { step: 1 },
                                                },
                                                {
                                                    type: "number",
                                                    position: "left",
                                                    max: 30
                                                },
                                            ],
                                        };

                                        return (
                                            <div key={q.id} style={{
                                                flex: '1 1 0',
                                                width: `${100 / questionario.listPdf.length}%`
                                            }}>
                                                <AgCharts options={options} />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}

                </div>
            ) : (
                <div className='div-notas-no-answer'>
                    <p className="no-answers">Não temos respostas para esse caso</p>
                </div>
            )}
        </div>
    );
};
