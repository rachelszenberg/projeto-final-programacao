import React from "react";
import { useSelector } from "react-redux";
import { selectAllQuestionarios } from "../features/QuestionarioSlice";
import { AvaliacaoPdf } from "../components/AvaliacaoPdf";
import { AvaliacaoPorQuestionario } from "../components/AvaliacaoPorQuestionario";

export const Avaliacao = () => {
    const questionarios = useSelector(selectAllQuestionarios);
    const questionario = questionarios[0]; // TODO: VERIFICAR PARA IR INCREMENTANDO

    return (
        <div className="questionario-div">
            <AvaliacaoPdf listPdf={questionario.listPdf} />
            <AvaliacaoPorQuestionario questionario={questionario} />
        </div>
    )
}