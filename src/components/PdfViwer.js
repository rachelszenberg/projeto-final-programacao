import React from "react";

export const PdfViwer = (props) => {
    return (
        <embed className="pdf" src={props.url} />
    )
}