import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get, ref } from "firebase/database";
import { db } from "../firebase/firebase";

export const fetchAvaliacoes = createAsyncThunk(
    'avaliacoes/fetchAvaliacoes',
    async () => {
        const snapshot = await get(ref(db, 'avaliacoes'))
        const todasAvaliacoes = [];
        snapshot.forEach((childSnapShot) => {
            const avaliacoes = Object.entries(childSnapShot.val()).map(([key, value]) => ({ id: key, value: value }));
            avaliacoes.forEach((avaliacao) => {
                todasAvaliacoes.push({
                    id: avaliacao.id,
                    ...avaliacao.value
                })
            })
        });
        return todasAvaliacoes;
    }
);

export const carregaAvaliacoesSlice = createSlice({
    name: 'todasAvaliacoes',
    initialState: {
        avaliacoes: []
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAvaliacoes.fulfilled, (state, action) => {
                state.avaliacoes = action.payload;
            })
    }
});

export const selectAllAvaliacoes = (state) => state.todasAvaliacoes.avaliacoes;

export default carregaAvaliacoesSlice.reducer;