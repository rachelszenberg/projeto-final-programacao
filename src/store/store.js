import { configureStore } from "@reduxjs/toolkit";
import perguntasReducer from "../features/PerguntasSlice";
import questionarioReducer from "../features/QuestionarioSlice";
import respostaAtualReducer from "../features/RespostaAtualSlice";
import todasRespostasReducer from "../features/CarregaRespostasSlice";
import avaliacaoReducer from "../features/AvaliacaoSlice";
import todasAvaliacoesReducer from "../features/CarregaAvaliacoesSlice";
import perfilReducer from "../features/PerfilSlice";
import usuariosReducer from "../features/UsariosSlice";
import tabelasReducer from "../features/TabelasSlice";

export default configureStore({
    reducer: {
        perguntas: perguntasReducer,
        questionario: questionarioReducer,
        respostaAtual: respostaAtualReducer,
        todasRespostas: todasRespostasReducer,
        avaliacao: avaliacaoReducer,
        todasAvaliacoes: todasAvaliacoesReducer,
        perfil: perfilReducer,
        usuarios: usuariosReducer,
        tabelas: tabelasReducer,
    },
})