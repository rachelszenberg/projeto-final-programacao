import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllQuestionarios } from "../features/QuestionarioSlice";
import { AvaliacaoPdf } from "../components/AvaliacaoPdf";
import { AvaliacaoPorQuestionario } from "../components/AvaliacaoPorQuestionario";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { ConfirmacaoModal } from "../components/ConfirmacaoModal";
import { addSalvarAvaliacao } from "../features/AvaliacaoSlice";

export const Avaliacao = () => {
    const params = useParams();
    const questionarios = useSelector(selectAllQuestionarios);
    const avaliacaoTemAlteracao = useSelector((state) => state.avaliacao).temAlteracoes;
    const [questionario, setQuestionario] = useState();
    const [showSalvarModal, setShowSalvarModal] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();    

    useEffect(() => {
        const temp = questionarios.todosQuestionarios.find(q => q.id === params.idQuestionario);
        if (temp) {
            setQuestionario(temp);
        } else {
            navigate('/error')
        }
    }, [params.idQuestionario, questionarios, navigate]);

    const onVoltar = () => {
        if (avaliacaoTemAlteracao) {
            setShowSalvarModal(true);
        } else {
            navigate(`/${params.idAvaliador}/avaliacao`);
        }
    }

    const confirmar = () => {
        setShowSalvarModal(false);
        dispatch(addSalvarAvaliacao(params.idAvaliador));
        navigate(`/${params.idAvaliador}/avaliacao`);
    }

    const cancelar = () => {
        setShowSalvarModal(false);
        navigate(`/${params.idAvaliador}/avaliacao`);
    }

    return (
        <>
            <Header headerText={"Respostas dos Questionarios"} onVoltar={onVoltar} headerButtons avaliar={true} />
            {questionario && <div className="questionario-div">
                <AvaliacaoPdf listPdf={questionario.listPdf} />
                <AvaliacaoPorQuestionario questionario={questionario} idAvaliador={params.idAvaliador} />
            </div>}
            <ConfirmacaoModal showModal={showSalvarModal} title={"Algumas alterações não foram salvas. Você gostaria de salvar a avaliação antes de voltar?"} cancelButton={cancelar} confirmButton={confirmar} />
        </>
    )
}