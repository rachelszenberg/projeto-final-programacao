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
                <p className="modal-title">Você tem certeza que deseja enviar a Avaliação?</p>
                <p className="modal-text">Após o envio, não será possível editar ou excluir as respostas.</p>
            </div>
            <div className="modal-buttons">
                <Button class="confirm-button" onClick={props.confirmButton} label="Sim"/>
                <Button class="cancel-button" onClick={props.cancelButton} label="Não"/>
            </div>
        </div>
    </Modal>
);