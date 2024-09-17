import { configureStore } from "@reduxjs/toolkit";
import avaliacaoReducer from "../features/AvaliacaoSlice";

export default configureStore({
    reducer: {
        avaliacao: avaliacaoReducer,
    },
})