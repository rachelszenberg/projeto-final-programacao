import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get, ref } from "firebase/database";
import { db } from "../firebase/firebase";

export const fetchAvaliacoes = createAsyncThunk(
    'avaliacoes/fetchResposta',
    async () => {
        const snapshot = await get(ref(db, 'avaliacoes'))
        const todasAvaliacoes = [];
        snapshot.forEach((childSnapShot) => {
            todasAvaliacoes.push({
                id: childSnapShot.key,
                ...childSnapShot.val()
            })
        });
        
        return todasAvaliacoes;
    }
);

export const carregaAvaliacoesSlice = createSlice({
    name: 'todasAvaliacoes',
    initialState: [],
    extraReducers: (builder) => {
        builder
            .addCase(fetchAvaliacoes.fulfilled, (state, action) => {
                state.push(action.payload)
            })
    }
});

export const selectAllAvaliacoes = (state) => state.todasAvaliacoes[0];

export default carregaAvaliacoesSlice.reducer;