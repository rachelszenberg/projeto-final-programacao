import React, { useEffect, useRef } from "react";
import { RightTitleComponent } from "./RightTitleComponent";
import { RightButtonsComponent } from "./RightButtonsComponent";

export const RightComponent = ({
    index = 0,
    questionariosLength,
    perguntasLength = 0,
    progressBar = false, 
    qtdRespondidas = 0,
    titleText,
    nomeQuestionario,
    podeVoltar = false,
    temProximo,
    onVoltar,
    onProximo,
    onEnviar,
    buttonNextOrSaveClass,
    children
}) => {
    const childrenRef = useRef(null);

    useEffect(() => {
        childrenRef.current.scrollTop = 0;
    })

    return (
        <div className="div-right">
            <RightTitleComponent className="div-top"
                index={index}
                questionariosLength={questionariosLength}
                perguntasLength={perguntasLength}
                progressBar={progressBar}
                qtdRespondidas={qtdRespondidas} 
                titleText={titleText}
                nomeQuestionario={nomeQuestionario}
            />
            <div className="div-children" ref={childrenRef}>
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