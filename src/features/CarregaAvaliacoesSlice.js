import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get, ref } from "firebase/database";
import { db } from "../firebase/firebase";

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