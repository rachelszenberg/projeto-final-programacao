import React, { useState } from "react";
import { PdfViwer } from "./PdfViwer";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";

export const AvaliacaoPdf = (props) => {
    const [index, setIndex] = useState(0);

    const onPreviousClick = () => {
        setIndex(index - 1);
    }

    const onNextClick = () => {
        setIndex(index + 1);
    }

    return (
        <div className="avaliacao-pdf">
            <div className="div-title-avaliacao">
                <RxChevronLeft className={index === 0 ? "no-button" : "icon"} onClick={onPreviousClick}/>
                <p className="title-avaliacao">PDF Modelo {index + 1}</p>
                <RxChevronRight className={index === (props.listPdf.length - 1) ? "no-button" : "icon"} onClick={onNextClick}/>
            </div>
            <PdfViwer pdfClass={"div-pdf-avaliacao"} url={props.listPdf[index].url} />
        </div>
    )
}