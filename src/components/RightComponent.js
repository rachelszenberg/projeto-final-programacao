import React from "react";
import { RightTitleComponent } from "./RightTitleComponent";
import { RightButtonsComponent } from "./RightButtonsComponent";

export const RightComponent = ({
    index = 0,
    questionariosLength,
    perguntasLength = 0,
    progressBar = false, 
    qtdRespondidas = 0,
    titleText = "Avaliação",
    podeVoltar = false,
    temProximo,
    onVoltar,
    onProximo,
    onEnviar,
    buttonNextOrSaveClass,
    children
}) => {
    return (
        <div className="div-right">
            <RightTitleComponent className="div-top"
                index={index}
                questionariosLength={questionariosLength}
                perguntasLength={perguntasLength}
                progressBar={progressBar}
                qtdRespondidas={qtdRespondidas} 
                titleText={titleText} />
            <div className="div-children">
            {children}
            </div>
            <RightButtonsComponent className="div-bottom"
                podeVoltar={podeVoltar}
                temProximo={temProximo}
                onVoltar={onVoltar}
                onProximo={onProximo}
                onEnviar={onEnviar}
                buttonNextOrSaveClass={buttonNextOrSaveClass}
            />
        </div>
    )
}