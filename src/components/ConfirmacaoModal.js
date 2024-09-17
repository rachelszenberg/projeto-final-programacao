import Modal from 'react-modal'
import { Button } from './Button';
import { ReactComponent as Enviar } from '../svg/enviar.svg'

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
                <p className="modal-title">Você tem certeza que deseja enviar a Avaliação?</p>
                <p className="modal-text">Após o envio, não será possível editar ou excluir as respostas.</p>
            </div>
            <div className="modal-buttons">
                <button className="confirm-button" onClick={props.confirmButton}>Sim</button>
                <button className="cancel-button" onClick={props.cancelButton}>Não</button>
            </div>
        </div>
    </Modal>
);