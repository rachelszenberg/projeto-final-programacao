import React, { useEffect, useState } from "react";
import { selectAllPerguntas } from "../features/PerguntasSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectAllRespostas } from "../features/CarregaRespostasSlice";
import { ListaExpansivelComponent } from "./ListaExpansivelComponent";
import { RightComponent } from "./RightComponent";
import { addAvaliacao, selectNota, setRespostasSemNota } from "../features/AvaliacaoSlice";

export const AvaliacaoPorQuestionario = (props) => {
    const perguntasAll = useSelector(selectAllPerguntas);
    const respostas = useSelector(selectAllRespostas);
    const avaliacao = useSelector((state) => state.avaliacao);
    const dispatch = useDispatch();
    const [podeEnviar, setPodeEnviar] = useState(false);

    const respostasDoQuestionario = respostas.find(r => r.id === props.questionario.id).respostasPorQuestionario;


    const getNota = (idPdf, idPergunta, idResposta) => {
        const nota = selectNota(avaliacao, { idPdf, idPergunta, idResposta });
        return nota;
    };

    const onCheck = () => {
        dispatch(setRespostasSemNota({ perguntas: props.questionario.perguntas, respostasDoQuestionario }))
    };

    const onEnviar = () => {
        dispatch(addAvaliacao(props.questionario.id));
    };

    useEffect(() => {
        setPodeEnviar(true);
        props.questionario.perguntas.map((pergunta) => {
            respostasDoQuestionario.map((respostas) => {
                const nota = getNota(respostas.idPdf, pergunta, respostas.idResposta);
                if (!nota) {
                    setPodeEnviar(false);
                    return;
                }
            });
        });
    })

    return (
        <div className="div-form">
            <RightComponent
                onEnviar={!podeEnviar ? onCheck : onEnviar}
                buttonNextOrSaveClass={!podeEnviar ? "button-disabled" : undefined}
            >
                <ListaExpansivelComponent
                    perguntas={props.questionario.perguntas}
                    perguntasAll={perguntasAll}
                    respostasDoQuestionario={respostasDoQuestionario}
                />
            </RightComponent>
        </div>
    )
}