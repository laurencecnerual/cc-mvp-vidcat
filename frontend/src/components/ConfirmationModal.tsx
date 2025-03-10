import Modal from 'react-modal';

type ConfirmationModalProps = {
  isModalOpen: boolean,
  closeModal: () => void,
  handleClick: () => void,
  confirmationMessage: string
}

export default function ConfirmationModal ({isModalOpen, closeModal, handleClick, confirmationMessage}: ConfirmationModalProps) {
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Delete Confirmation"
      className="modal"
      overlayClassName="overlay"
    >
      <p className="confirmation-message">{confirmationMessage}</p>
      <div className="confirmation-buttons">
        <button className="yes" type="button" onClick={handleClick}>Yes</button>
        <button className="no" type="button" onClick={closeModal}>No</button>
      </div>
    </Modal>
  )
}