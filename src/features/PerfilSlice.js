import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get, push, ref, set } from "firebase/database";
import { db } from "../firebase/firebase";

export const fetchPerguntasPerfil = createAsyncThunk(
    'perguntasPerfil/fetchPerguntasPerfil',
    async () => {
        const snapshot = await get(ref(db, 'perguntasPerfil'))
        const perguntas = [];

        snapshot.forEach((childSnapShot) => {
            perguntas.push({
                id: childSnapShot.key,
                ...childSnapShot.val()
            }
            )
        })
        return perguntas;
    }
);


export const addPerfil = createAsyncThunk(
    'perfil/addPerfil',
    async (selecoes) => {
        const newRef = push(ref(db, 'usuarios'));
        await set(newRef, selecoes); 
        return newRef.key; 
    }
);
export const PerfilSlice = createSlice({
    name: 'perfil',
    initialState: [],
    extraReducers: (builder) => {
        builder
            .addCase(fetchPerguntasPerfil.fulfilled, (state, action) => {
                return action.payload
            })
    }
})

export const selectAllPerguntasPerfil = (state) => state.perfil;

export default PerfilSlice.reducer;