import React from "react";

export const Button = (props) => {
    return (
        <button className={`button ${props.classButton}`} onClick={props.onClick}>
            <div className="div-button">
                {props.iconLeft}
                {props.label}
                {props.iconRight}
            </div>
        </button>
    )
}