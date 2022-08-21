import React from 'react';
import { Modal } from 'reactstrap';
import { Icon } from 'semantic-ui-react'
import './ConfirmationModal.scss'
const ConfirmationModal = (props) => {
  const {
    isOpen,
    toggle,
    handleDelete,
    text
  } = props;

  const handleAction = (status) => {
    toggle();
    handleDelete(status)
  }

  return (
    <div>
      <Modal 
        isOpen={isOpen} toggle={toggle} className="confirmation-modal-container"
        size="md"
      >
        <div className="confirmation-wrapper">
          <div className="times-icon" onClick={toggle}>
            <Icon name="times circle" className="icon" />
          </div>
          <div className="message">
            {
              text ? text : "Are you sure to delete"
            }
          </div>
          <div className="buttons-wrapper">
            <div className="action-button cancel" onClick={() => handleAction(false)}>Cancel</div>
            <div className="action-button delete" onClick={() => handleAction(true)}>Confirm</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ConfirmationModal;