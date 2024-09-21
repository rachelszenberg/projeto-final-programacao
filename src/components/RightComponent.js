import React from "react";
import { RightTitleComponent } from "./RightTitleComponent";
import { RightButtonsComponent } from "./RightButtonsComponent";

export const RightComponent = (props) => {
    return (
        <div className="div-right">
            <div className="div-top">
            <RightTitleComponent
                index={props.index}
                questionariosLength={props.questionariosLength}
                perguntasLength={props.perguntasLength}
                progressBar={props.progressBar}
                qtdRespondidas={props.qtdRespondidas} 
                titleText={props.titleText} />
            {props.children}
            </div>
            <RightButtonsComponent className="div-bottom"
                podeVoltar={props.podeVoltar}
                temProximo={props.temProximo}
                onVoltar={props.onVoltar}
                onProximo={props.onProximo}
                onEnviar={props.onEnviar}
                buttonNextOrSaveClass={props.buttonNextOrSaveClass}
            />
        </div>
    )
}

RightComponent.defaultProps = {
    progressBar: false, 
    perguntasLength: 0,
    qtdRespondidas: 0,
    titleText: "Avaliação",
};