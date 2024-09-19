import { configureStore } from "@reduxjs/toolkit";
import perguntasReducer from "../features/PerguntasSlice";
import questionarioReducer from "../features/QuestionarioSlice";
import respostasReducer from "../features/RespostasSlice";

export default configureStore({
    reducer: {
        perguntas: perguntasReducer,
        questionario: questionarioReducer,
        respostas: respostasReducer,
    },
})