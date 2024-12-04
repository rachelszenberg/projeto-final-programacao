import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { push, ref } from "firebase/database";
import { db } from "../firebase/firebase";

const initialState = {
    respostaIndex: 0,
    tempoPorQuestionario: [],
    confiancaPorQuestionario: [],
    listRespostas: []
}

export const addResposta = createAsyncThunk(
    'respostas/addResposta',
    async (idUsuario, { getState }) => {
        const state = getState();
        const respostas = state.respostaAtual;

        respostas.listRespostas.forEach(async (resposta, index) => {
            await push(ref(db, `respostas/${resposta.idQuestionario}`), {
                idPdf: resposta.idPdf,
                listRespostas: resposta.respostasPergunta,
                tempoPorQuestionario: respostas.tempoPorQuestionario[index],
                confiancaPorQuestionario: respostas.confiancaPorQuestionario[index],
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
        setTempoPorQuestionario: (state, action) => {
            state.tempoPorQuestionario[state.respostaIndex] = (action.payload);
        },
        setConfiancaPorQuestionario: (state, action) => {
            state.confiancaPorQuestionario[state.respostaIndex] = (action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addResposta.fulfilled, (state) => {
                return initialState;
            });
    }
})

export const selectRespostasAtuais = (state) => state.respostaAtual;

export const { decrementIndex, incrementIndex, setAvaliacaoRespostas, setTempoPorQuestionario, setConfiancaPorQuestionario } = respostaAtualSlice.actions;

export default respostaAtualSlice.reducer;