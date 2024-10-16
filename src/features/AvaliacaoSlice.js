import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { set, ref } from "firebase/database";
import { db } from "../firebase/firebase";

export const addAvaliacao = createAsyncThunk(
    'avaliacoes/addAvaliacao',
    async (idQuestionario, { getState }) => {
        const state = getState();
        const avaliacao = state.avaliacao.notas;

        avaliacao.forEach(async (av) => {
            av.listNotasPorPdf.forEach(async (notas) => {
                const listNotas = notas.listNotasPorPerguntas.map(item => item.nota);
                await set(ref(db, `avaliacoes/avaliador1/${idQuestionario}/${av.idPdf}/${notas.idPergunta}`), {
                    ...listNotas
                });
            })

        })

    }
);

export const addSalvarAvaliacao = createAsyncThunk(
    'avaliacoesSalvas/addSalvarAvaliacao',
    async (idQuestionario, { getState }) => {
        const state = getState();
        const avaliacao = state.avaliacao.notas;
        
        avaliacao.forEach(async (av) => {
            av.listNotasPorPdf.forEach(async (notas) => {
                const listNotas = notas.listNotasPorPerguntas.map(item => item.nota);
                await set(ref(db, `avaliacoesSalvas/avaliador1/${idQuestionario}/${av.idPdf}/${notas.idPergunta}`), {
                    ...listNotas
                });
            })

        })

    }
);

export const avaliacaoSlice = createSlice({
    name: 'avaliacao',
    initialState: {
        notas: [],
        respostasSemNota: [],
        showErrors: false,
    },
    reducers: {
        setAvaliacaoNotas: (state, action) => {
            state.notas = action.payload;
        },
        setRespostasSemNota: (state, action) => {
            const { perguntas, respostasDoQuestionario, listIndex } = action.payload;
            state.respostasSemNota = []
            perguntas.forEach((pergunta, index) => {
                if (state.showErrors || listIndex.includes(index)) {
                    respostasDoQuestionario.forEach((resposta) => {
                        const nota = selectNota(state, { idPdf: resposta.idPdf, idPergunta: pergunta, idResposta: resposta.idResposta });
                        if (nota === 0) {
                            state.respostasSemNota.push({
                                perguntaId: pergunta,
                                respostaId: resposta.idResposta
                            });
                        }
                    })
                };
            });
        },
        setShowErrors: (state) => {
            state.showErrors = true;
        },
        removeItemFromRespostasSemNota: (state, action) => {
            const { idPergunta, idResposta } = action.payload;
            const index = state.respostasSemNota.findIndex(item => item.perguntaId === idPergunta && item.respostaId === idResposta);

            if (index !== -1) {
                state.respostasSemNota.splice(index, 1);
            }
        }
    },
});

export const selectNota = createSelector(
    (state) => state?.notas,
    (state, props) => props.idPdf,
    (state, props) => props.idPergunta,
    (state, props) => props.idResposta,
    (notas, idPdf, idPergunta, idResposta) => {
        const pdf = notas.find(p => p.idPdf === idPdf);
        if (pdf) {
            const pergunta = pdf.listNotasPorPdf?.find(p => p.idPergunta === idPergunta);
            if (pergunta) {
                const resposta = pergunta.listNotasPorPerguntas?.find(p => p.idResposta === idResposta);
                if (resposta) {
                    return resposta.nota;
                }
            }
        }
        return 0;
    }
);

export const { getNota, setAvaliacaoNotas, setRespostasSemNota, removeItemFromRespostasSemNota, setShowErrors } = avaliacaoSlice.actions;

export default avaliacaoSlice.reducer;