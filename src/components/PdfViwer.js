import React from "react";

export const PdfViwer = (props) => {
    return (
        <embed className={`pdf ${props.class}`} src={props.url} />
    )
}