import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { push, ref, set } from "firebase/database";
import { db } from "../firebase/firebase";

const initialState = {
    respostaIndex: 0,
    listRespostas: []
}

export const addResposta = createAsyncThunk(
    'respostas/addResposta',
    async (_, { getState }) => {
        const state = getState();
        const respostas = state.respostas;


        respostas.listRespostas.forEach(async (respostas) => {
            const dbRef = ref(db, `respostas/${respostas.idQuestionario}/${respostas.idPdf}`);
            const newListRef = push(dbRef);
            respostas.respostasPergunta.forEach(async (r) => {
                const itemRef = push(newListRef);
                set(itemRef, r);
            })
        })

    }
);

export const respostasSlice = createSlice({
    name: 'respostas',
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

export const selectAllRespostas = (state) => state.respostas;

export const { decrementIndex, incrementIndex, setAvaliacaoRespostas } = respostasSlice.actions;

export default respostasSlice.reducer;