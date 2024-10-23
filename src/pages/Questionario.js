import React, { useEffect, useState } from "react";
import { PdfViwer } from "../components/PdfViwer";
import { useSelector } from "react-redux";
import { Perguntas } from "../components/Perguntas";
import { selectAllQuestionarios } from "../features/QuestionarioSlice"
import { selectRespostasAtuais } from "../features/RespostaAtualSlice";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";

export const Questionario = () => {
    const questionarios = useSelector(selectAllQuestionarios);
    const [questionariosAbertos, setQuestionariosAbertos] = useState();
    const [questionario, setQuestionario] = useState();
    const respostas = useSelector(selectRespostasAtuais);
    const navigate = useNavigate();

    useEffect(() => {
        const temp = questionarios.filter(questionario => questionario.aberto === true);

        if (temp.length) {
            setQuestionariosAbertos(temp);
            setQuestionario(temp[respostas.respostaIndex]);
        } else {
            navigate('/questionarios-fechados');
        }
    }, [questionarios, respostas.respostaIndex, navigate])

    return (
        <div>
            <Header headerText={"Avaliação de linguagem"} />
            {questionariosAbertos && <div className="questionario-div">
                <PdfViwer pdfClass={"div-pdf-questionario"} url={questionario.pdf.url} />
                <Perguntas questionariosAbertos={questionariosAbertos} />
            </div>}
        </div>
    )
}