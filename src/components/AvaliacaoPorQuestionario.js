import React, { useCallback, useEffect, useState } from "react";
import { selectAllPerguntas } from "../features/PerguntasSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectAllRespostas } from "../features/CarregaRespostasSlice";
import { ListaExpansivelComponent } from "./ListaExpansivelComponent";
import { RightComponent } from "./RightComponent";
import { addAvaliacao, addSalvarAvaliacao, selectNota, setRespostasSemNota, setShowErrors, setTemAlteracoes } from "../features/AvaliacaoSlice";
import { ConfirmacaoModal } from "./ConfirmacaoModal";
import { useNavigate } from "react-router-dom";
import { ModalTexto } from "./ModalTexto";

export const AvaliacaoPorQuestionario = (props) => {
    const perguntasAll = useSelector(selectAllPerguntas);
    const respostas = useSelector(selectAllRespostas);
    const avaliacao = useSelector((state) => state.avaliacao);
    const dispatch = useDispatch();
    const [podeEnviar, setPodeEnviar] = useState(false);
    const [showEnviarModal, setShowEnviarModal] = useState(false);
    const [showSalvarModal, setShowSalvarModal] = useState(false);

    const navigate = useNavigate();
    const temp = respostas.find(r => r.id === props.questionario.id);
    const respostasDoQuestionario = temp?.respostasPorQuestionario;
    const idDoQuestionario = temp?.id;

    const getNota = useCallback((idPdf, idPergunta, idResposta) => {
        const nota = selectNota(avaliacao, { idQuestionario: idDoQuestionario, idPdf, idPergunta, idResposta });
        return nota;
    }, [avaliacao, idDoQuestionario]);
    

    const onCheck = () => {
        dispatch(setShowErrors());
        dispatch(setRespostasSemNota({ idQuestionario: idDoQuestionario, perguntas: props.questionario.perguntas, respostasDoQuestionario }));
    };

    const onEnviar = () => {
        setShowEnviarModal(true);
    };

    const onSalvar = () => {
        dispatch(addSalvarAvaliacao(props.idAvaliador));
        dispatch(setTemAlteracoes(false));
        setShowSalvarModal(true);
        setTimeout(() => {
            setShowSalvarModal(false);
        }, 1500);
    }

    const confirmar = () => {
        dispatch(addSalvarAvaliacao(props.idAvaliador));
        dispatch(addAvaliacao({idQuestionario: props.questionario.id, idAvaliador: props.idAvaliador}));
        navigate('/obrigado', { state: { title: "Obrigado pela avaliação!", text: "Salvamos as suas notas dadas para o questionário.", buttonNavigateTo: `/${props.idAvaliador}/avaliacao`, buttonText: "Voltar a tela de avaliação", underlineButtonText: "Ver todas as avaliações", underlineButtonNavigateTo: '/graficos' } });
    }

    useEffect(() => {
        setPodeEnviar(true);
        if (props.questionario.aberto || !temp){
            setPodeEnviar(false);
            return ;
        }
        props.questionario.perguntas.forEach((pergunta) => {
            respostasDoQuestionario.forEach((respostas) => {
                const nota = getNota(respostas.idPdf, pergunta, respostas.idResposta);
                if (!nota) {
                    setPodeEnviar(false);
                    return;
                }
            });
        });
    }, [props.questionario.perguntas, temp, props.questionario.aberto, respostasDoQuestionario, getNota])

    return (
        <div className="div-form">
            <RightComponent
                podeSalvar={temp}
                onSalvar={onSalvar}
                onEnviar={!podeEnviar ? onCheck : onEnviar}
                buttonNextOrSaveClass={!podeEnviar ? "button-disabled" : undefined}
                titleText={`Avaliação - ${props.questionario.nome}`}
                nomeQuestionario={props.questionario.aberto && "Esse é um questionário que esta está aberto. Você não poderá enviar suas respostas, mas pode dar notas e salvar!"}
                noAnswer={!temp}
            >
                {temp 
                ? <ListaExpansivelComponent
                    perguntas={props.questionario.perguntas}
                    perguntasAll={perguntasAll}
                    respostasDoQuestionario={respostasDoQuestionario}
                    idDoQuestionario={idDoQuestionario}
                />
                : <p className="no-answers">Esse questionário ainda não tem respostas</p>}
            </RightComponent>
            <ModalTexto showModal={showSalvarModal} title={"Suas respostas foram salvas"} text={"Você pode voltar e editar quando quiser. Após avaliar todas as respostas, se o questionário estiver fechado, clique em Enviar"} />
            <ConfirmacaoModal showModal={showEnviarModal} title={"Você tem certeza que deseja enviar as notas?"} text={"Após o envio, não será possível editar ou excluir."} cancelButton={() => setShowEnviarModal(false)} confirmButton={confirmar} />
        </div>
    )
}