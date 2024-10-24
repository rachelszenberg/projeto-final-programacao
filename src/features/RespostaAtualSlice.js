import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { push, ref } from "firebase/database";
import { db } from "../firebase/firebase";

const initialState = {
    respostaIndex: 0,
    listRespostas: []
}

export const addResposta = createAsyncThunk(
    'respostas/addResposta',
    async (idUsuario, { getState }) => {
        const state = getState();
        const respostas = state.respostaAtual;
    
        respostas.listRespostas.forEach(async (respostas) => {
            await push(ref(db, `respostas/${respostas.idQuestionario}`), {
                idPdf: respostas.idPdf,
                listRespostas: respostas.respostasPergunta,
                idUsuario
            });
        })

    }
);

export const respostaAtualSlice = createSlice({
    name: 'respostaAtual',
    initialState,
    reducers: {
        incrementIndex: (state) => {
            state.respostaIndex += 1;
        },
        decrementIndex: (state) => {
            state.respostaIndex -= 1;
        },
        setAvaliacaoRespostas: (state, action) => {
            state.listRespostas[state.respostaIndex] = (action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addResposta.fulfilled, (state) => {
                return initialState;
            });
    }
})

export const selectRespostasAtuais = (state) => state.respostaAtual;

export const { decrementIndex, incrementIndex, setAvaliacaoRespostas } = respostaAtualSlice.actions;

export default respostaAtualSlice.reducer;