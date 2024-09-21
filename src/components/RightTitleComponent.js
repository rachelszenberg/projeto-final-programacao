import React from "react";
import { ProgressBar } from "./ProgressBar";

export const RightTitleComponent = (props) => {
    return (
        <div className="div-title-avaliacao">
            <p className="title-avaliacao">{props.titleText} {props.index + 1}/{props.questionariosLength}</p>
            {props.progressBar && <ProgressBar total={props.questionariosLength} ind={(props.qtdRespondidas === props.perguntasLength) ? props.index + 1 : props.index} />}
        </div>
    )
}