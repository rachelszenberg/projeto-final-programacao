import React from "react";
import { ReactComponent as Voltar } from '../svg/voltar.svg'

export const Header = (props) => {
    return (
        <div className="header">
            {props.onVoltar && <Voltar className="button-voltar" onClick={props.onVoltar}/>}
            <h1>{props.headerText}</h1>
        </div>
    )
}