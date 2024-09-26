import React from "react";
import { selectAllPerguntas } from "../features/PerguntasSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectAllRespostas } from "../features/CarregaRespostasSlice";
import { ListaExpansivelComponent } from "./ListaExpansivelComponent";
import { RightComponent } from "./RightComponent";
import { addAvaliacao } from "../features/AvaliacaoSlice";

export const AvaliacaoPorQuestionario = (props) => {
    const perguntasAll = useSelector(selectAllPerguntas);
    const respostas = useSelector(selectAllRespostas);
    const dispatch = useDispatch();

    const respostasDoQuestionario = respostas.find(r => r.id === props.questionario.id).respostasPorQuestionario;
    
    const onEnviar = () => {
        dispatch(addAvaliacao(props.questionario.id))
    };

    return (
        <div className="div-form">
            <RightComponent
                onEnviar={onEnviar}
                buttonNextOrSaveClass={undefined} //TODO: VERIFICAR - habilitar quando tudo tiver respondido
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