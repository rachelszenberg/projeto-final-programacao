import React, { useState } from "react";
import { selectAllPerguntas } from "../features/PerguntasSlice";
import { useSelector } from "react-redux";
import { selectAllRespostas } from "../features/CarregaRespostasSlice";
import { ListaExpandivelComponent } from "./ListaExpansivel";

export const AvaliacaoPorQuestionario = (props) => {
    const perguntasAll = useSelector(selectAllPerguntas);
    const respostas = useSelector(selectAllRespostas);
    const respostasDoQuestionario = respostas.find(r => r.id === props.questionario.id).respostasPorQuestionario;

    return (
        <ListaExpandivelComponent
            perguntas={props.questionario.perguntas}
            perguntasAll={perguntasAll}
            respostasDoQuestionario={respostasDoQuestionario}
        />
    )
}