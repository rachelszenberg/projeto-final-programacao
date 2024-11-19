import { useState } from 'react';
import Modal from 'react-modal'
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

export const ModalInput = (props) => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState(false);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        if (e.target?.value) {
            setError(false);
        }

    };

    const navegacao = () => {
        if (inputValue !== '') {
            navigate(`/${inputValue}/avaliacao`)
        } else {
            setError(true)
        }
    }

    return (
        <Modal
            isOpen={props.showModal}
            ariaHideApp={false}
            contentLabel="Selected Option"
            className="custom-modal"
        >
            <div className="modal-content">
                    <p className="modal-text">{props.title}</p>
                    <p className="modal-title" style={{ whiteSpace: "pre-wrap" }}>{props.text}</p>
                        <div className="input-container">
                            <textarea
                                className={error ? "input-error" : undefined}
                                rows={1}
                                value={inputValue || ''}
                                onChange={handleInputChange}
                                placeholder="Digite seu usuário"
                            ></textarea>
                            {error && <p className="obrigatorio">Obrigatório</p>}
                </div>
                <Button classButton="confirm-button" onClick={() => navegacao()} label="Ir para tela de avaliar" />
                <button className="underline-button" onClick={props.cancelButton}>Cancelar</button>
            </div>
        </Modal>
    )
};