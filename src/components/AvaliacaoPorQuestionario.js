import React, { useCallback, useEffect, useState } from "react";
import { selectAllPerguntas } from "../features/PerguntasSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectAllRespostas } from "../features/CarregaRespostasSlice";
import { ListaExpansivelComponent } from "./ListaExpansivelComponent";
import { RightComponent } from "./RightComponent";
import { addAvaliacao, addSalvarAvaliacao, selectNota, setRespostasSemNota, setShowErrors } from "../features/AvaliacaoSlice";
import { ConfirmacaoModal } from "./ConfirmacaoModal";
import { useNavigate } from "react-router-dom";
import { SalvarModal } from "./SalvarModal";

export const AvaliacaoPorQuestionario = (props) => {
    const perguntasAll = useSelector(selectAllPerguntas);
    const respostas = useSelector(selectAllRespostas);
    const avaliacao = useSelector((state) => state.avaliacao);
    const dispatch = useDispatch();
    const [podeEnviar, setPodeEnviar] = useState(false);
    const [showEnviarModal, setShowEnviarModal] = useState(false);
    const [showSalvarModal, setShowSalvarModal] = useState(false);

    const navigate = useNavigate();
    const respostasDoQuestionario = respostas.find(r => r.id === props.questionario.id).respostasPorQuestionario;

    const getNota = useCallback((idPdf, idPergunta, idResposta) => {
        const nota = selectNota(avaliacao, { idPdf, idPergunta, idResposta });
        return nota;
    }, [avaliacao]);

    const onCheck = () => {
        dispatch(setShowErrors());
        dispatch(setRespostasSemNota({ perguntas: props.questionario.perguntas, respostasDoQuestionario }));
    };

    const onEnviar = () => {
        setShowEnviarModal(true);
    };

    const onSalvar = () => {
        dispatch(addSalvarAvaliacao(props.questionario.id));
        setShowSalvarModal(true);
        setTimeout(() => {
            setShowSalvarModal(false);
        }, 1500);
    }

    const confirmar = () => {
        dispatch(addAvaliacao(props.questionario.id));
        navigate('/obrigado', { state: { title: "Obrigado pela avaliação!", text: "Salvamos as suas notas dadas para o questionário.", buttonNavigateTo: '/avaliacao' } });
    }

    useEffect(() => {
        setPodeEnviar(true);
        props.questionario.perguntas.forEach((pergunta) => {
            respostasDoQuestionario.forEach((respostas) => {
                const nota = getNota(respostas.idPdf, pergunta, respostas.idResposta);
                if (!nota) {
                    setPodeEnviar(false);
                    return;
                }
            });
        });
    }, [props.questionario.perguntas, respostasDoQuestionario, getNota])

    return (
        <div className="div-form">
            <RightComponent
                podeSalvar={true}
                onSalvar={onSalvar}
                onEnviar={!podeEnviar ? onCheck : onEnviar}
                buttonNextOrSaveClass={!podeEnviar ? "button-disabled" : undefined}
                titleText={`Avaliação - ${props.questionario.nome}`}
            >
                <ListaExpansivelComponent
                    perguntas={props.questionario.perguntas}
                    perguntasAll={perguntasAll}
                    respostasDoQuestionario={respostasDoQuestionario}
                />
            </RightComponent>
            <SalvarModal showModal={showSalvarModal} title={"Suas respostas foram salvas"} text={"Você pode voltar e editar quando quiser. Após avaliar todas as respostas, clique em Enviar"} />
            <ConfirmacaoModal showModal={showEnviarModal} title={"Você tem certeza que deseja enviar as notas?"} text={"Após o envio, não será possível editar ou excluir."} cancelButton={() => setShowEnviarModal(false)} confirmButton={confirmar} />
        </div>
    )
}