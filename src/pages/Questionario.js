import React, { useEffect } from "react";
import { PdfViwer } from "../components/PdfViwer";
import { useDispatch, useSelector } from "react-redux";
import { Perguntas } from "../components/Perguntas";
import { selectAllQuestionarios, selectRandomPdfs } from "../features/QuestionarioSlice";
import { selectRespostasAtuais } from "../features/RespostaAtualSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";

export const Questionario = () => {
    const questionarios = useSelector(selectAllQuestionarios);
    const respostas = useSelector(selectRespostasAtuais);
    
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const idUsuario = location.state?.idUsuario || null;

    useEffect(() => {
        const isReload = sessionStorage.getItem('reload');
        
        if (isReload) {
            sessionStorage.removeItem('reload');
            navigate('/');
        }

        if (!idUsuario) {
            navigate('/');
        }

        if (questionarios.questionariosAbertos.length) {
            dispatch(selectRandomPdfs());
        } else {
            navigate('/questionarios-fechados');
        }
    }, [questionarios.todosQuestionarios, navigate, dispatch, idUsuario, questionarios.questionariosAbertos.length, location.state]);

    useEffect(() => {
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('reload', 'true');
        });

        return () => {
            window.removeEventListener('beforeunload', () => {
                sessionStorage.setItem('reload', 'true');
            });
        };
    }, []);

    return (
        <div>
            <Header headerText={"Avaliação de linguagem"} />
            {questionarios.pdfLoaded && <div className="questionario-div">
                <PdfViwer pdfClass={"div-pdf-questionario"} url={questionarios.questionariosAbertos[respostas.respostaIndex].pdf.url} />
                <Perguntas questionariosAbertos={questionarios.questionariosAbertos} idUsuario={idUsuario}/>
            </div>}
        </div>
    );
};
