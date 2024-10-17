import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { set, ref, get } from "firebase/database";
import { db } from "../firebase/firebase";

export const addAvaliacao = createAsyncThunk(
    'avaliacoes/addAvaliacao',
    async (idQuestionario, { getState }) => {
        const state = getState();
        const avaliacao = state.avaliacao.notas;

        avaliacao.forEach((av) => {
            if (av.idQuestionario === idQuestionario){
            av.listNotasPorQuestionario.forEach((notasPorQuestionario) => {
                notasPorQuestionario.listNotasPorPdf.forEach(async (notas) => {
                    await set(ref(db, `avaliacoes/avaliador1/${av.idQuestionario}/${notasPorQuestionario.idPdf}/${notas.idPergunta}`), {
                        ...notas.listNotasPorPerguntas
                    });
                })
            })
        }});
    }
);

export const addSalvarAvaliacao = createAsyncThunk(
    'avaliacoesSalvas/addSalvarAvaliacao',
    async (_, { getState }) => {
        const state = getState();
        const avaliacao = state.avaliacao.notas;

        avaliacao.forEach(async (av) => {
            await set(ref(db, `avaliacoesSalvas/avaliador1/${av.idQuestionario}`), {
                ...av.listNotasPorQuestionario
            })
        })
    }
);

export const fetchAvaliacoesSalvas = createAsyncThunk(
    'avaliacoesSalvas/fetchAvaliacoesSalvas',
    async () => {
        const snapshot = await get(ref(db, 'avaliacoesSalvas'))
        const todasAvaliacoesSalvas = [];

        snapshot.forEach((childSnapShot) => {
            const avaliacoesSalvas = Object.entries(childSnapShot.val()).map(([key, value]) => ({ idQuestionario: key, listNotasPorQuestionario: value }));
            avaliacoesSalvas.forEach((av) => {
                todasAvaliacoesSalvas.push(av)
            })
        });
        return todasAvaliacoesSalvas;
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
            const { idQuestionario, perguntas, respostasDoQuestionario, listIndex } = action.payload;
            state.respostasSemNota = []
            perguntas.forEach((pergunta, index) => {
                if (state.showErrors || listIndex.includes(index)) {
                    respostasDoQuestionario.forEach((resposta) => {
                        const nota = selectNota(state, { idQuestionario: idQuestionario, idPdf: resposta.idPdf, idPergunta: pergunta, idResposta: resposta.idResposta });
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
    extraReducers: (builder) => {
        builder
            .addCase(fetchAvaliacoesSalvas.fulfilled, (state, action) => {
                state.notas = action.payload;
            })
    }
});

export const selectNota = createSelector(
    (state) => state?.notas,
    (state, props) => props.idQuestionario,
    (state, props) => props.idPdf,
    (state, props) => props.idPergunta,
    (state, props) => props.idResposta,
    (notas, idQuestionario, idPdf, idPergunta, idResposta) => {
        const questionario = notas.find(p => p.idQuestionario === idQuestionario);
        if (questionario) {
            const pdf = questionario.listNotasPorQuestionario.find(p => p.idPdf === idPdf);
            if (pdf) {
                const pergunta = pdf.listNotasPorPdf?.find(p => p.idPergunta === idPergunta);
                if (pergunta) {
                    const resposta = pergunta.listNotasPorPerguntas?.find(p => p.idResposta === idResposta);
                    if (resposta) {
                        return resposta.nota;
                    }
                }
            }
        }
        return 0;
    }
);

export const { getNota, setAvaliacaoNotas, setRespostasSemNota, removeItemFromRespostasSemNota, setShowErrors } = avaliacaoSlice.actions;

export default avaliacaoSlice.reducer;