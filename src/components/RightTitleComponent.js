import React from "react";
import { ProgressBar } from "./ProgressBar";
import { RxInfoCircled, RxLockClosed, RxLockOpen1 } from "react-icons/rx";
import { Button } from "./Button";

export const RightTitleComponent = (props) => {
    const status = props.questAberto;

    const handleToggle = () => {
        props.onChangeStatus();
    };
    return (
        <div className="div-avaliacao">
            <div className="div-title-avaliacao">
                <p className="title-avaliacao">{props.titleText} {props.progressBar && <span>
                    {props.index + 1}/{props.questionariosLength}
                </span>}
                    {props.info && <a href={props.info} target="_blank" rel="noreferrer noopener"><RxInfoCircled style={{ fontSize: '18px' }} /></a>}
                </p>
                {props.progressBar && <ProgressBar total={props.questionariosLength} ind={(props.qtdRespondidas === props.perguntasLength) ? props.index + 1 : props.index} />}
                {props.onChangeStatus && <div>
                    <div onClick={handleToggle} >
                        {status ? (
                            <Button
                                label={
                                    <>
                                        <RxLockClosed style={{ marginRight: 6 }} />
                                        Fechar questionário
                                    </>
                                }
                            />
                        ) : (
                            <Button
                                label={
                                    <>
                                        <RxLockOpen1 style={{ marginRight: 6 }} />
                                        Abrir questionário
                                    </>
                                }
                            />
                        )}
                    </div>
                </div>}
            </div>
            <div className="div-title-avaliacao">
                {props.nomeQuestionario && <p className="nome-questionario">{props.nomeQuestionario}</p>}
                {props.tempoQuestionario && <p className="nome-questionario">{props.tempoQuestionario}</p>}
            </div>
        </div>
    )
}