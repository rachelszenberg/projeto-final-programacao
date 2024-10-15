import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get, ref } from "firebase/database";
import { db } from "../firebase/firebase";

export const fetchQuestionarios = createAsyncThunk(
    'questionario/fetchQuestionario',
    async () => {
        const snapshot = await get(ref(db, 'questionarios'))
        const questionarios = [];
        let index = 0;

        snapshot.forEach((childSnapShot) => {
            const pdfTemp = childSnapShot.val().pdf;
            const listPdf = Object.entries(pdfTemp).map(([key, value]) => ({ id: key, url: value }));

            const randomIndex = Math.floor(Math.random() * listPdf.length);
            const randomPdf = listPdf[randomIndex];

            questionarios.push({
                numero: index + 1,
                id: childSnapShot.key,
                listPdf,
                pdf: randomPdf,
                perguntas: childSnapShot.val().perguntas,
                nome: childSnapShot.val().nome,
                aberto: childSnapShot.val().aberto
            });
            index++;
        });
        return questionarios;
    }
);

export const avaliacaoSlice = createSlice({
    name: 'questionarios',
    initialState: [],
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuestionarios.fulfilled, (state, action) => {
                state.push(action.payload)
            })
    }
})

export const selectAllQuestionarios = (state) => state.questionario[0];

export default avaliacaoSlice.reducer;