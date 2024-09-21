import React from "react";

export const PdfViwer = (props) => {
    return (
        <div className={props.pdfClass}>
            <embed className="pdf" src={props.url} />
        </div>
    )
}