import React from 'react';
import { Modal } from 'reactstrap';
import { Icon } from 'semantic-ui-react'
import Congrats from '../../../../assets/quiz/congrats3.mp4'
import { API_ROOT } from '../../../../utils/consts'
import './CongratulationsModal.scss'

const CongratulationsModal = (props) => {
    const {
        isOpen,
        toggle,
        titleObj
    } = props;
    
    return (
        <div>
            <Modal
                isOpen={isOpen} toggle={toggle}
                className="congrats-modal-container"
                backdropClassName="congrats-backdrop-container"
                size="lg"
            >
                <div className="congrats-screen-wrapper">
                    <div className="times-icon" onClick={toggle}>
                        <Icon name="times circle" className="icon" />
                    </div>
                    {
                        titleObj && titleObj.image_url &&
                        <img src={API_ROOT + titleObj.image_url} alt="" className="user-badge" />
                    }
                    <div className="congrats-title">
                        Congratulations You Got <span className="badge-name">{titleObj?.name ?? '-'}</span> Badge !!!
                    </div>
                    <video muted autoPlay loop className="video-item">
                        <source src={Congrats} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    {/* <img src={Congrats2} alt="icon" className="congrate-img" /> */}
                </div>
            </Modal>
        </div>
    );
}

export default CongratulationsModal;