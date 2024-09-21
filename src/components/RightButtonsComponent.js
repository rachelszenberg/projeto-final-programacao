import React from "react";
import { Button } from "./Button";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";

export const RightButtonsComponent = (props) => {
    return (
        <div className="div-form-button">
        {props.podeVoltar && <Button
            onClick={props.onVoltar}
            label="Voltar"
            class="button-cancel"
            iconLeft=<RxChevronLeft />
        />}
        <div className="button-right">
            {props.temProximo
                ? <Button
                    class={props.buttonNextOrSaveClass}
                    onClick={props.onProximo}
                    label="Próximo"
                    iconRight=<RxChevronRight />
                />
                :
                <Button
                    class={props.buttonNextOrSaveClass}
                    onClick={props.onEnviar}
                    label="Enviar"
                />
            }
        </div>
    </div>
    )
}