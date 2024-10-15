import React, { useCallback, useEffect, useState } from "react";
import { selectAllPerguntas } from "../features/PerguntasSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectAllRespostas } from "../features/CarregaRespostasSlice";
import { ListaExpansivelComponent } from "./ListaExpansivelComponent";
import { RightComponent } from "./RightComponent";
import { addAvaliacao, selectNota, setRespostasSemNota, setShowErrors } from "../features/AvaliacaoSlice";
import { ConfirmacaoModal } from "./ConfirmacaoModal";
import { useNavigate } from "react-router-dom";

export const AvaliacaoPorQuestionario = (props) => {
    const perguntasAll = useSelector(selectAllPerguntas);
    const respostas = useSelector(selectAllRespostas);
    const avaliacao = useSelector((state) => state.avaliacao);
    const dispatch = useDispatch();
    const [podeEnviar, setPodeEnviar] = useState(false);
    const [showModal, setShowModal] = useState(false);

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
        setShowModal(true);
    };


    const confirmar = () => {
        dispatch(addAvaliacao(props.questionario.id));
        navigate('/obrigado', { state: { title: "Obrigado pela avaliação!", text: "Salvamos as suas notas dadas para o questionário.", buttonNavigateTo: '/avaliacao'} });
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
            <ConfirmacaoModal showModal={showModal} title={"Você tem certeza que deseja enviar as notas?"} text={"Após o envio, não será possível editar ou excluir."} cancelButton={() => setShowModal(false)} confirmButton={confirmar} />
        </div>
    )
}