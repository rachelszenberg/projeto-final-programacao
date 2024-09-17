import React from "react";
import { PdfViwer } from "./PdfViwer";
import { useDispatch, useSelector } from "react-redux";
import { Perguntas } from "./Perguntas";
import { selectAllAvaliacoes } from "../features/AvaliacaoSlice"

export const Body = () => {
    const avaliacao = useSelector(selectAllAvaliacoes);
    const questionario = avaliacao.questionarios[avaliacao.questionarioIndex];
  
    return (
        <div className="body">
            <PdfViwer url={questionario.pdf} />
            <Perguntas/>
        </div>
    )
}