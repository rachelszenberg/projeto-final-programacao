import React from "react";
import { PdfViwer } from "./PdfViwer";
import { useSelector } from "react-redux";
import { Perguntas } from "./Perguntas";
import { selectAllQuestionarios } from "../features/QuestionarioSlice"
import { selectAllRespostas } from "../features/RespostasSlice";

export const Body = () => {
    const questionarios = useSelector(selectAllQuestionarios);
    const respostas = useSelector(selectAllRespostas);
    const questionario = questionarios[respostas.respostaIndex];    

    return (
        <div className="body">
            <PdfViwer url={questionario.pdf} />
            <Perguntas/>
        </div>
    )
}