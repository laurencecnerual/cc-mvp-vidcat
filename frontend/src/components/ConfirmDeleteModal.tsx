import Modal from 'react-modal';

type ConfirmDeleteModalProps = {
  isModalOpen: boolean,
  closeModal: () => void,
  handleDelete: () => void,
  deletionType: "CONSOLE" | "GAME"
}

export default function ConfirmDeleteModal ({isModalOpen, closeModal, handleDelete, deletionType}: ConfirmDeleteModalProps) {
  let confirmationMessage = (deletionType === "CONSOLE") 
  ? "Are you sure you would like to delete this console?\nNote that doing this will also delete any associated games." 
  : "Are you sure you would like to delete this game?";

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
        <button className="yes" type="button" onClick={handleDelete}>Yes</button>
        <button className="no" type="button" onClick={closeModal}>No</button>
      </div>
    </Modal>
  )
}