import { configureStore } from "@reduxjs/toolkit";
import perguntasReducer from "../features/PerguntasSlice";
import questionarioReducer from "../features/QuestionarioSlice";
import respostaAtualReducer from "../features/RespostaAtualSlice";
import todasRespostasReducer from "../features/CarregaRespostasSlice";

export default configureStore({
    reducer: {
        perguntas: perguntasReducer,
        questionario: questionarioReducer,
        respostaAtual: respostaAtualReducer,
        todasRespostas: todasRespostasReducer
    },
})