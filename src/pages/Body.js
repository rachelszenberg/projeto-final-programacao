import React from "react";
import { PdfViwer } from "../components/PdfViwer";
import { useSelector } from "react-redux";
import { Perguntas } from "../components/Perguntas";
import { selectAllQuestionarios } from "../features/QuestionarioSlice"
import { selectAllRespostas } from "../features/RespostasSlice";

export const Body = () => {
    const questionarios = useSelector(selectAllQuestionarios);
    const respostas = useSelector(selectAllRespostas);
    const questionario = questionarios[respostas.respostaIndex];    

    return (
        <div className="body">
            <PdfViwer url={questionario.pdf.url} />
            <Perguntas/>
        </div>
    )
}