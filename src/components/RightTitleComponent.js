import React from "react";
import { ProgressBar } from "./ProgressBar";
import { RxInfoCircled } from "react-icons/rx";

export const RightTitleComponent = (props) => {
    return (
        <div className="div-avaliacao">
            <div className="div-title-avaliacao">
                <p className="title-avaliacao">{props.titleText} {props.progressBar && <span>
                    {props.index + 1}/{props.questionariosLength}
                </span>}
                {props.info && <a href={props.info} target="_blank" rel="noreferrer noopener"><RxInfoCircled style={{ fontSize: '18px' }} /></a>}
                </p>
                {props.progressBar && <ProgressBar total={props.questionariosLength} ind={(props.qtdRespondidas === props.perguntasLength) ? props.index + 1 : props.index} />}
            </div>
            <div className="div-title-avaliacao">
                {props.nomeQuestionario && <p className="nome-questionario">{props.nomeQuestionario}</p>}
                {props.tempoQuestionario && <p className="nome-questionario">{props.tempoQuestionario}</p>}
            </div>
        </div>
    )
}