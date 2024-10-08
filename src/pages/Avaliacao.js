import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAllQuestionarios } from "../features/QuestionarioSlice";
import { AvaliacaoPdf } from "../components/AvaliacaoPdf";
import { AvaliacaoPorQuestionario } from "../components/AvaliacaoPorQuestionario";
import { useNavigate, useParams } from "react-router-dom";

export const Avaliacao = () => {
    const params = useParams()
    const questionarios = useSelector(selectAllQuestionarios);
    const [questionario, setQuestionario] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const temp = questionarios.find(q => q.id === params.idQuestionario);
        if (temp) {
            setQuestionario(temp);
        } else {
            navigate('/error')
        }
    }, [params.idQuestionario, questionarios, navigate])


    return (
        <>
            {questionario && <div className="questionario-div">
                <AvaliacaoPdf listPdf={questionario.listPdf} />
                <AvaliacaoPorQuestionario questionario={questionario} />
            </div>}
        </>
    )
}