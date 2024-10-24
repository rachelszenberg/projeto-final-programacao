import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get, ref } from "firebase/database";
import { db } from "../firebase/firebase";

export const fetchPerguntas = createAsyncThunk(
    'perguntas/fetchPerguntas',
    async () => {
        const snapshot = await get(ref(db, 'perguntas'))
        const perguntas = [];

        snapshot.forEach((childSnapShot) => {
            perguntas.push({
                id: childSnapShot.key,
                pergunta: childSnapShot.val()
            })
        })
        return perguntas;
    }
);

export const perguntasSlice = createSlice({
    name: 'perguntas',
    initialState: [],
    extraReducers: (builder) => {
        builder
            .addCase(fetchPerguntas.fulfilled, (state, action) => {
                state.push(action.payload)
            })
    }
})

export const selectAllPerguntas = (state) => state.perguntas[0];

export default perguntasSlice.reducer;