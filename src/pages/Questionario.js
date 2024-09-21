import React from "react";
import { PdfViwer } from "../components/PdfViwer";
import { useSelector } from "react-redux";
import { Perguntas } from "../components/Perguntas";
import { selectAllQuestionarios } from "../features/QuestionarioSlice"
import { selectRespostasAtuais } from "../features/RespostaAtualSlice";

export const Questionario = () => {
    const questionarios = useSelector(selectAllQuestionarios);
    const respostas = useSelector(selectRespostasAtuais);
    const questionario = questionarios[respostas.respostaIndex];    

    return (
        <div className="questionario-div">
            <PdfViwer pdfClass={"div-pdf-questionario"} url={questionario.pdf.url} />
            <Perguntas/>
        </div>
    )
}