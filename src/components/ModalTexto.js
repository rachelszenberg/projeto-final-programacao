import Modal from 'react-modal'
import { Button } from './Button';

export const ModalTexto = (props) => (
    <Modal
        isOpen={props.showModal}
        ariaHideApp={false}
        contentLabel="Selected Option"
        className="custom-modal"
    >
        <div className="modal-content">
            <div>
                <p className="modal-text">{props.title}</p>
                <p className="modal-title">{props.text}</p>
            </div>
            <Button classButton="confirm-button" onClick={props.okButton} label="Ok" />
        </div>
    </Modal>
);