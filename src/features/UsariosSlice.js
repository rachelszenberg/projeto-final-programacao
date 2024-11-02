import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get, ref } from "firebase/database";
import { db } from "../firebase/firebase";

export const fetchUsuarios = createAsyncThunk(
    'suarios/fetchUsuarios',
    async () => {
        const snapshot = await get(ref(db, 'usuarios'))
        const perguntas = [];

        snapshot.forEach((childSnapShot) => {
            perguntas.push({
                id: childSnapShot.key,
                ...childSnapShot.val()
            })
        })
        return perguntas;
    }
);

export const UsuariosSlice = createSlice({
    name: 'usuario',
    initialState: [],
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsuarios.fulfilled, (state, action) => {
                return action.payload
            })
    }
})

export const selectAllUsuarios = (state) => state.usuarios;

export default UsuariosSlice.reducer;