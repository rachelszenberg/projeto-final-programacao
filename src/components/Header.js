import React, { useState } from "react";
import { ReactComponent as Voltar } from '../svg/voltar.svg';
import { ReactComponent as Grafico } from '../svg/grafico.svg';
import { ReactComponent as GraficoCinza } from '../svg/graficoCinza.svg';
import { ReactComponent as Avaliar } from '../svg/avaliar.svg';
import { ReactComponent as AvaliarCinza } from '../svg/avaliarCinza.svg';
import { useNavigate } from "react-router-dom";
import { ModalInput } from "./ModalInput";

export const Header = (props) => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="header">
            <div>
                {props.onVoltar && <Voltar className="button-voltar" onClick={props.onVoltar} />}
                <h1 className="header-title">{props.headerText}</h1>
            </div>
            {props.headerButtons && <div>
                {props.avaliar &&
                    <div>
                        <Avaliar className="button-avaliar" alt="Descrição da imagem" />
                        <GraficoCinza className="button-avaliar" alt="Descrição da imagem" onClick={() => navigate('/notas')} />
                    </div>}
                {props.grafico &&
                    <div>
                        <AvaliarCinza className="button-avaliar" alt="Descrição da imagem" onClick={() => setShowModal(true)} />
                        <Grafico className="button-avaliar" alt="Descrição da imagem" />
                    </div>}
            </div>}
            <ModalInput showModal={showModal} title={"Digite seu usuário, caso não tenha um, crie um que você irá lembrar depois"} text={"Ele será usado apenas como uma identificação para você poder ver as suas avaliações"} cancelButton={() => setShowModal(false)}/>
        </div>
    )
}