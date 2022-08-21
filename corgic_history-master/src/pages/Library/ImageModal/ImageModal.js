import React, { useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { MapInteractionCSS } from 'react-map-interaction';
import { Icon } from 'semantic-ui-react'
import './ImageModal.scss'
const ImageModal = (props) => {
  const {
    isOpen,
    toggle,
    imageUri
  } = props;

  return (
    <div>
      <Modal 
        isOpen={isOpen} toggle={toggle} className="image-modal-container"
      >
        <div className="image-zoom-controller">
          <div className="times-icon" onClick={toggle}>
            <Icon name="times circle" className="icon" />
          </div>
          <div className="image-wrapper">
            // <MapInteractionCSS>
              <img src={imageUri} alt="thumbnail-img" />
            </MapInteractionCSS>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ImageModal;