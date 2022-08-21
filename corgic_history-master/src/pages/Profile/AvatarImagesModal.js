import React, { useState, useEffect } from 'react';
import { 
    Modal,
    // Carousel,
    // CarouselItem,
    // CarouselControl
 } from 'reactstrap';
 import ImageGallery from 'react-image-gallery';
import { Icon } from 'semantic-ui-react'
import { API_ROOT } from "../../utils/consts";
import './AvatarImagesModal.scss'
import { render } from '@testing-library/react';
const ImageModal = (props) => {
    const {
        isOpen,
        toggle,
        data
    } = props;
    // const [activeIndex, setActiveIndex] = useState(0);
    // const [animating, setAnimating] = useState(false);
    // const next = () => {
    //     if (animating) return;
    //     const nextIndex = activeIndex === data.length - 1 ? 0 : activeIndex + 1;
    //     setActiveIndex(nextIndex);
    // }

    // const previous = () => {
    //     if (animating) return;
    //     const nextIndex = activeIndex === 0 ? data.length - 1 : activeIndex - 1;
    //     setActiveIndex(nextIndex);
    // }

    // const slides = data.map((item) => {
    //     return (
    //         <CarouselItem
    //             onExiting={() => setAnimating(true)}
    //             onExited={() => setAnimating(false)}
    //             key={item.id}
    //         >
    //             <div className="slider-item">
    //                 <img src={API_ROOT + item.image_url} alt="slider_images"/>
    //             </div>
    //         </CarouselItem>
    //     );
    // });
    // useEffect(() => {
    //     renderedImages(data);
    // },[])
    const renderedImages = (data) => {
        const result = data.filter((item, index) => item.image_url).map((item, index) => {
            return {original:`${API_ROOT}${item.image_url}`, thumbnail: `${API_ROOT}${item.image_url}`};
        })
        return result;
    }
    return (
        <div>
            <Modal
                isOpen={isOpen} toggle={toggle} className="avatar-images-modal"
            >
                <div className="avatar-images-container">
                    <div className="times-icon" onClick={toggle}>
                        <Icon name="times circle" className="icon" />
                    </div>
                    <div className="slider-images">
                        <ImageGallery 
                            items={renderedImages(data)}
                            showThumbnails={false}
                            showFullscreenButton={false}
                            showPlayButton={false}
                            showNav={true} 
                            originalWidth={100}
                        />
                        {/* <Carousel
                            activeIndex={activeIndex}
                            next={next}
                            previous={previous}
                            interval={false}
                        >
                            {slides}
                            <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
                            <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
                        </Carousel> */}
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default ImageModal;