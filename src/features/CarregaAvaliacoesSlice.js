import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get, ref } from "firebase/database";
import { db } from "../firebase/firebase";

export const fetchAllAvaliacoes = createAsyncThunk(
    'avaliacoes/fetchAllAvaliacoes',
    async () => {

        const snapshot = await get(ref(db, 'avaliacoes'))
        const todasAvaliacoes = [];
        snapshot.forEach((childSnapShot) => {
            Object.entries(childSnapShot.val()).map(([idQuestionario, respostasPorQuestionario]) => (
                Object.entries(respostasPorQuestionario).map(([idPdf, respostasPorPdf]) => (
                    Object.entries(respostasPorPdf).map(([idPergunta, value]) => (
                        value.map((respostas) => (
                            todasAvaliacoes.push(
                                { idQuestionario: idQuestionario, idPdf: idPdf, idPergunta: idPergunta, ...respostas }
                            )
                        ))

                    ))
                ))
            ));
        });

        const avaliacaoAgrupadaPorQuestionario = todasAvaliacoes.reduce((acc, item) => {
            if (!acc[item.idQuestionario]) {
                acc[item.idQuestionario] = [];
            }
            const { idQuestionario, ...itemSemIdQuestionario } = item;
            acc[item.idQuestionario].push(itemSemIdQuestionario);
            return acc;
        }, {});
        return avaliacaoAgrupadaPorQuestionario;
    }
);

export const fetchAvaliacoes = createAsyncThunk(
    'avaliacoes/fetchAvaliacoes',
    async (idAvaliador) => {
        const snapshot = await get(ref(db, `avaliacoes/${idAvaliador}`));
        const todasAvaliacoes = [];
        snapshot.forEach((childSnapShot) => {
            todasAvaliacoes.push({
                id: childSnapShot.key,
                ...childSnapShot.val()
            });
        });

        return todasAvaliacoes;
    }
);

export const carregaAvaliacoesSlice = createSlice({
    name: 'todasAvaliacoes',
    initialState: {
        allAvaliacoes: [],
        avaliacoesPorId: []
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAvaliacoes.fulfilled, (state, action) => {
                state.avaliacoesPorId = action.payload;
            })
            .addCase(fetchAllAvaliacoes.fulfilled, (state, action) => {
                state.allAvaliacoes = action.payload;
            })
    }
});

export const selectAllAvaliacoes = (state) => state.todasAvaliacoes.allAvaliacoes;
export const selectAllAvaliacoesPorId = (state) => state.todasAvaliacoes.avaliacoesPorId;

export default carregaAvaliacoesSlice.reducer;