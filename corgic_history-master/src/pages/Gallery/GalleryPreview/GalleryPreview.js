import React, { useState, useEffect } from 'react';
import { Modal } from 'reactstrap';
import { MapInteractionCSS } from 'react-map-interaction';
import { Icon } from 'semantic-ui-react'
import { API_ROOT } from '../../../utils/consts'
import './GalleryPreview.scss'
const GalleryPreview = (props) => {
    const {
        isOpen,
        toggle,
        activeImage,
        gallery,
        activeIndex
    } = props;
    const [active, setActive] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(null)

    useEffect(() => {
        setActive(activeImage)
        setCurrentIndex(activeIndex)
    }, [])

    const onPrev = (active, index) => {
        if (active && index > 0) {
            setActive(gallery[index - 1])
            setCurrentIndex(index - 1)
        }
    }
    const onNext = (active, index) => {
        if (active && (gallery.length - 1) > index) {
            setActive(gallery[index + 1])
            setCurrentIndex(index + 1)
        }
    }

    return (
        <div>
            <Modal
                isOpen={isOpen} toggle={toggle} className="gallery-preview-container"
            >
                <div className="gallery-zoom-controller">
                    <div className="times-icon" onClick={toggle}>
                        <Icon name="times circle" className="icon" />
                    </div>
                    <div
                        className={`arrow-icon prev ${currentIndex === 0 && 'disabled'}`}
                        onClick={() => onPrev(active, currentIndex)}
                    >
                        <Icon name="angle left" className="icon" />
                    </div>
                    <div
                        className={`arrow-icon next ${(gallery.length -1) === currentIndex && 'disabled'}`}
                        onClick={() => onNext(active, currentIndex)}
                    >
                        <Icon name="angle right" className="icon" />
                    </div>
                    <div className="gallery-preview-wrapper">
                        <MapInteractionCSS
                            showControls={true}
                            controlsClass="zoom-buttons-wrapper"
                            btnClass="zoom-buttons"
                            plusBtnClas="plus-btn"
                            minusBtnClass="min-btn"
                        >
                            {
                                active && active.image_url &&
                                <img src={API_ROOT + active.image_url} alt="thumbnail-img" />
                            }
                        </MapInteractionCSS>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default GalleryPreview;