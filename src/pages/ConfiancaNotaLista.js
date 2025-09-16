import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAllAvaliacoes } from '../features/CarregaAvaliacoesSlice';
import { selectAllQuestionarios } from "../features/QuestionarioSlice";
import { selectAllUsuarios } from '../features/UsariosSlice';
import { useParams } from 'react-router-dom';
import { selectAllRespostas } from '../features/CarregaRespostasSlice';
import { mean } from 'mathjs';

export const ConfiancaNotaLista = ({ filtros, rangeNota, rangeConfianca, questao, pdfFilter }) => {
    const params = useParams();
    const avaliacao = useSelector(selectAllAvaliacoes);
    const questionarios = useSelector(selectAllQuestionarios);
    const usuarios = useSelector(selectAllUsuarios);
    const respostas = useSelector(selectAllRespostas);
    const questionario = questionarios.todosQuestionarios.find(q => q.id === params.idQuestionario);
    const medias = [];
    const temp = respostas.find(r => r.id === params.idQuestionario);
    const respostasDoQuestionario = temp?.respostasPorQuestionario;
    const colorsPdfBackground = ['#A7C7E790', '#FBC49C90'];
    const colorsPdfText = ['#A7C7E7', '#FBC49C'];
    const colorsBackground = ['#C41E0035', '#C41E0020', '#C44E0023', '#C47E0025', '#647B2423', '#03784720', '#03784735', '#03784735'];
    const colorsText = ['#C41E00', '#C41E0090', '#C44E0090', '#C47E00', '#647B2490', '#03784790', '#037847'];
    const [ordem, setOrdem] = useState('Confiança apropriada decrescente');

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

    const totalRespostas = respostasDoQuestionario.length;
    const filtrarNotasPorRange = () =>
        medias[questao]?.value.filter(({ mediaNotas }) =>
            parseFloat(mediaNotas) >= rangeNota[0] && parseFloat(mediaNotas) <= rangeNota[1]
        ) || [];

    const filtrarPorConfianca = () => {
        if (!Array.isArray(respostasDoQuestionario)) return [];

        return respostasDoQuestionario.filter(({ confiancaPorQuestionario }) => {
            const valor = confiancaPorQuestionario[questao];
            if (!valor) return rangeConfianca[0] === 0;
            const numero = parseInt(valor);
            return numero >= rangeConfianca[0] && numero <= rangeConfianca[1];
        });
    }

    const respostasFiltradas = filtrarPorConfianca();
    const respostasComNota = respostasFiltradas
        .map(resp => {
            const correspondente = filtrarNotasPorRange().find(n => n.idResposta === resp.idResposta);
            return correspondente ? { ...resp, ...correspondente } : null;
        })
        .filter(Boolean);

    let respostasFinais = respostasComNota;
    if (pdfFilter !== 'Todos os pdfs') {
        const id = questionario.listPdf[pdfFilter.slice(-1) - 1].id;
        respostasFinais = respostasComNota.filter(item => item.idPdf === id)
    }

    const sortBy = (a, b) => {
        const aInvalido = a.confiancaApropriada === -1 || a.confiancaQuestao === -1;
        const bInvalido = b.confiancaApropriada === -1 || b.confiancaQuestao === -1;
        if (ordem === 'Confiança apropriada decrescente') {
            if (aInvalido && !bInvalido) return 1;
            if (!aInvalido && bInvalido) return -1;
            return b.confiancaApropriada - a.confiancaApropriada;
        } else if (ordem === 'Confiança apropriada crescente') {
            if (aInvalido && !bInvalido) return 1;
            if (!aInvalido && bInvalido) return -1;
            return a.confiancaApropriada - b.confiancaApropriada;
        } else if (ordem === 'Nota decrescente') {
            return b.mediaNotas - a.mediaNotas;
        } else if (ordem === 'Nota crescente') {
            return a.mediaNotas - b.mediaNotas;
        } else if (ordem === 'Confiança decrescente') {
            if (aInvalido && !bInvalido) return 1;
            if (!aInvalido && bInvalido) return -1;
            return b.confiancaQuestao - a.confiancaQuestao;
        } else if (ordem === 'Confiança crescente') {
            if (aInvalido && !bInvalido) return 1;
            if (!aInvalido && bInvalido) return -1;
            return a.confiancaQuestao - b.confiancaQuestao;
        }
    };

    const respostasOrdenadas = respostasFinais
        .map((resp) => {
            const confiancaQuestao = Number(resp.confiancaPorQuestionario[questao]?.[0]);

            let confiancaApropriada = -1;

            if (confiancaQuestao) {
                const diferenca = Math.abs(Math.trunc(resp.mediaNotas) - confiancaQuestao);
                confiancaApropriada = parseFloat(((6 - diferenca) / 6 * 100).toFixed(2));
            }

            return {
                ...resp,
                confiancaQuestao: confiancaQuestao || null,
                confiancaApropriada
            };
        })
        .sort(sortBy);

    return (
        <div>
            <div className='div-grafico-confianca-container'>
                <div className='div-graficos-confianca'>
                    <div className='respostas-ordenar-div'>
                        <p style={{ fontWeight: 'bold' }}>{respostasOrdenadas.length} / {totalRespostas} resposta(s)</p>
                        <div className='ordenar-div'>
                            <p>Ordenar por:</p>
                            <select value={ordem} onChange={(e) => setOrdem(e.target.value)}>
                                <option>Nota decrescente</option>
                                <option>Nota crescente</option>
                                <option>Confiança decrescente</option>
                                <option>Confiança crescente</option>
                                <option>Confiança apropriada decrescente</option>
                                <option>Confiança apropriada crescente</option>
                            </select>
                        </div>
                    </div>
                    <div className='div-resposta-avaliada-container'>
                        {respostasOrdenadas.map((r, index) => {
                            return (
                                <div key={index} className='resposta-avaliada-field'>
                                    <p className='pdf-div' style={{ '--pdf-color': colorsPdfText[questionario.listPdf.findIndex(item => item.id === r.idPdf)], fontWeight: 'bold', backgroundColor: colorsPdfBackground[questionario.listPdf.findIndex(item => item.id === r.idPdf)] }}>pdf {questionario.listPdf.findIndex(item => item.id === r.idPdf) + 1}</p>
                                    <div className='resposta-div'>
                                        <p>{r.listRespostas[questao]}</p>
                                        <div className='confiancaxnota-div'>
                                            <p className='confiancaxnota' style={{ color: colorsText[Math.trunc(r.mediaNotas) - 1], backgroundColor: colorsBackground[Math.trunc(r.mediaNotas) - 1] }}>Nota média: {r.mediaNotas} / 7.00</p>
                                            {r.confiancaQuestao && <p className='confiancaxnota' style={{ color: colorsText[r.confiancaQuestao - 1], backgroundColor: colorsBackground[r.confiancaQuestao - 1] }}>Confiança: {r.confiancaQuestao} / 7</p>}
                                            {r.confiancaQuestao && <p className='confiancaxnota' style={{ color: colorsText[Math.trunc(r.confiancaApropriada / 20)], backgroundColor: colorsBackground[Math.trunc(r.confiancaApropriada / 20)] }}>Confiança apropriada: {r.confiancaApropriada}%</p>}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
