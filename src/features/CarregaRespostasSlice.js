import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get, ref } from "firebase/database";
import { db } from "../firebase/firebase";

export const fetchRespostas = createAsyncThunk(
    'resposta/fetchResposta',
    async () => {
        const snapshot = await get(ref(db, 'respostas'))
        const todasRespostas = [];
        snapshot.forEach((childSnapShot) => {
            const respostas = Object.entries(childSnapShot.val()).map(([key, value]) => ({idResposta: key, idPdf: value.idPdf, idUsuario: value.idUsuario, listRespostas: value.listRespostas, tempoPorQuestionario: value.tempoPorQuestionario, confiancaPorQuestionario: value.confiancaPorQuestionario}));

            todasRespostas.push({
                id: childSnapShot.key,
                respostasPorQuestionario: respostas
            })
        });
        
        return todasRespostas;
    }
);

export const carregaRespostasSlice = createSlice({
    name: 'todasRespostas',
    initialState: [],
    extraReducers: (builder) => {
        builder
            .addCase(fetchRespostas.fulfilled, (state, action) => {
                return action.payload;
            })
    }
})

export const selectAllRespostas = (state) => state.todasRespostas;

export default carregaRespostasSlice.reducer;