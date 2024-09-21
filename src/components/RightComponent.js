import React from "react";
import { RightTitleComponent } from "./RightTitleComponent";
import { RightButtonsComponent } from "./RightButtonsComponent";

export const RightComponent = (props) => {
    return (
        <div>
            <RightTitleComponent
                index={props.index}
                questionariosLength={props.questionariosLength}
                perguntasLength={props.perguntasLength}
                progressBar={props.progressBar}
                qtdRespondidas={props.qtdRespondidas} />
            {props.children}
            <RightButtonsComponent
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
    progressBar: 0,  // Valor padrão se progressBar não for passado
};