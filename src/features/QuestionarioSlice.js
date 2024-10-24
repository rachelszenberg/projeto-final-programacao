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

            questionarios.push({
                numero: index + 1,
                id: childSnapShot.key,
                listPdf,
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
    initialState: {
        todosQuestionarios: [],
        questionariosAbertos: [],
        pdfLoaded: false
    },
    reducers: {
        selectRandomPdfs: (state, action) => {
            const questionariosAbertos = state.questionariosAbertos.map(q => JSON.parse(JSON.stringify(q)));

            let zeroAdded = false;
            questionariosAbertos.forEach((q, i) => {
                let pdfIdx;
                const listPdf = q.listPdf;
                if (!zeroAdded) {
                    if (i === (questionariosAbertos.length - 1)) {
                        pdfIdx = 0;
                    } else {
                        pdfIdx = Math.floor(Math.random() * listPdf.length);
                        if (pdfIdx === 0) {
                            zeroAdded = true;
                        }
                    }
                } else {
                    pdfIdx = Math.floor(Math.random() * (listPdf.length - 1)) + 1;
                }
                questionariosAbertos[i].pdf = listPdf[pdfIdx];
            });
            state.questionariosAbertos = questionariosAbertos;
            state.pdfLoaded = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuestionarios.fulfilled, (state, action) => {
                state.todosQuestionarios = action.payload;
                state.questionariosAbertos = action.payload.filter(q => q.aberto === true);
            })
    }
})

export const selectAllQuestionarios = (state) => state.questionario;

export const { selectRandomPdfs } = avaliacaoSlice.actions;

export default avaliacaoSlice.reducer;