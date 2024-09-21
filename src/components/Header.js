import React from "react";

export const Header = (props) => {
    return (
        <div className="header">
            <h1>{props.headerText}</h1>
        </div>
    )
}