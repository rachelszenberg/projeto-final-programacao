import { configureStore } from "@reduxjs/toolkit";
import questionarioReducer from "../features/QuestionarioSlice";
import respostasReducer from "../features/RespostasSlice";

export default configureStore({
    reducer: {
        questionario: questionarioReducer,
        respostas: respostasReducer
    },
})