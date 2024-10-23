import React from "react";
import { Button } from "./Button";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";

export const RightButtonsComponent = (props) => {
    return (
        <div className={props.noMarginTop ? "div-form-button-no-margin" : "div-form-button"}>
            {props.podeVoltar && <Button
                onClick={props.onVoltar}
                label="Voltar"
                classButton="button-cancel"
                iconLeft=<RxChevronLeft />
            />}
            {props.podeSalvar && <Button
                onClick={props.onSalvar}
                label="Salvar"
                classButton="button-cancel"
            />}
            
            <div className="button-right">
                {props.temProximo
                    ? <Button
                        classButton={props.buttonNextOrSaveClass}
                        onClick={props.onProximo}
                        label={props.textProximo || "Próximo"}
                        iconRight=<RxChevronRight />
                    />
                    :
                    <Button
                        classButton={props.buttonNextOrSaveClass}
                        onClick={props.onEnviar}
                        label="Enviar"
                    />
                }
            </div>
        </div>
    )
}