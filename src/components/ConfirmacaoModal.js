import Modal from 'react-modal'
import { ReactComponent as Enviar } from '../svg/enviar.svg'
import { Button } from './Button';

export const ConfirmacaoModal = (props) => (
    <Modal
        isOpen={props.showModal}
        ariaHideApp={false}
        contentLabel="Selected Option"
        className="custom-modal"
    >
        <div className="modal-content">
            <div className="modal-icon">
                <Enviar />
            </div>
            <div>
                <p className="modal-title">{props.title}</p>
                <p className="modal-text">{props.text}</p>
            </div>
            <div className="modal-buttons">
                <Button classButton="confirm-button" onClick={props.confirmButton} label="Sim"/>
                <Button classButton="cancel-button" onClick={props.cancelButton} label="Não"/>
            </div>
        </div>
    </Modal>
);