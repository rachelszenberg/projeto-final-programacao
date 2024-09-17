import React from "react";

export const Button = (props) => {
    return (
        <button className={props.class} onClick={props.onClick}>
            {props.iconLeft}
            {props.label}
            {props.iconRight}
        </button>
    )
}