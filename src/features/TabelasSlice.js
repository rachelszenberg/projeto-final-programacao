import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tabela: 0
}

export const tabelaAtualSlice = createSlice({
    name: 'tabelas',
    initialState,
    reducers: {
        switchTabela: (state, action) => {
            state.tabela = action.payload;
        }
    },
})

export const selectTabelaAtual = (state) => state.tabelas;

export const { switchTabela } = tabelaAtualSlice.actions;

export default tabelaAtualSlice.reducer;