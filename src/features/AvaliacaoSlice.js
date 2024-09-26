import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { set, ref } from "firebase/database";
import { db } from "../firebase/firebase";

export const addAvaliacao = createAsyncThunk(
    'avaliacoes/addAvaliacao',
    async (idQuestionario, { getState }) => {
        const state = getState();
        const avaliacao = state.avaliacao;
        
        avaliacao.forEach(async (av) => {            
            av.listNotasPorPdf.forEach(async (notas) => {
                const listNotas = notas.listNotasPorPerguntas.map(item => item.nota);
                await set(ref(db, `avaliacoes/${idQuestionario}/${av.idPdf}/${notas.idPergunta}`), {
                    ...listNotas
                });
            })
            
        })
        
    }
);

export const avaliacaoSlice = createSlice({
    name: 'avaliacao',
    initialState: [],
    reducers: {
        setAvaliacaoNotas: (state, action) => {
            return action.payload;
        },
    },
})

export const selectAvaliacaoAtual = (state) => state.avaliacao;

export const { setAvaliacaoNotas } = avaliacaoSlice.actions;

export default avaliacaoSlice.reducer;