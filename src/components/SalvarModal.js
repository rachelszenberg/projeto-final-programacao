import Modal from 'react-modal'

export const SalvarModal = (props) => (
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
        </div>
    </Modal>
);