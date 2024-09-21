import React from "react";
import { selectAllPerguntas } from "../features/PerguntasSlice";
import { useSelector } from "react-redux";
import { selectAllRespostas } from "../features/CarregaRespostasSlice";
import { ListaExpansivelComponent } from "./ListaExpansivelComponent";
import { RightComponent } from "./RightComponent";
import { selectAllQuestionarios } from "../features/QuestionarioSlice";

export const AvaliacaoPorQuestionario = (props) => {
    const perguntasAll = useSelector(selectAllPerguntas);
    const respostas = useSelector(selectAllRespostas);
    const questionarios = useSelector(selectAllQuestionarios);

    const respostasDoQuestionario = respostas.find(r => r.id === props.questionario.id).respostasPorQuestionario;

    const onVoltar = (e) => {
        // e.preventDefault();
        // dispatch(setAvaliacaoRespostas({ idQuestionario: questionario.id, idPdf: questionario.pdf.id, respostasPergunta: respostasTmp }));
        // dispatch(decrementIndex());
    };

    const onProximo = (e) => {
        // e.preventDefault();
        // let erros = []
        // respostasTmp.forEach((r, index) => { if (!regex.test(r)) { erros.push(index); } });
        // if (erros.length === 0) {
        //     dispatch(setAvaliacaoRespostas({ idQuestionario: questionario.id, idPdf: questionario.pdf.id, respostasPergunta: respostasTmp }));
        //     dispatch(incrementIndex());
        // }
        // else {
        //     setListIndexErros(erros);
        // }
    };

    const onEnviar = (e) => {
        // e.preventDefault();
        // let erros = []
        // respostasTmp.forEach((r, index) => { if (!regex.test(r)) { erros.push(index); } });
        // if (erros.length === 0) {
        //     dispatch(setAvaliacaoRespostas({ idQuestionario: questionario.id, idPdf: questionario.pdf.id, respostasPergunta: respostasTmp }));
        //     setShowModal(true);
        // }
        // else {
        //     setListIndexErros(erros);
        // }
    };

    return (
        <div className="div-form">
            <RightComponent
                index={0} //TODO: ALETAR A CADA CLIQUE
                questionariosLength={questionarios.length}

                podeVoltar={true} //TODO: ALETAR A CADA CLIQUE
                temProximo={true} //TODO: ALETAR A CADA CLIQUE
                onVoltar={onVoltar}
                onProximo={onProximo}
                onEnviar={onEnviar}
                buttonNextOrSaveClass={undefined} //TODO: VERIFICAR
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