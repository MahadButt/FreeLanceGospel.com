import React, { useState, useEffect } from "react";
import { Loader } from "semantic-ui-react";
import { Spinner, Container, Row, Col } from 'reactstrap'
import axios from "axios";
import Footer from "../../components/Footer/NewFooter/NewFooter";
import GalleryPreview from './GalleryPreview/GalleryPreview'
import "./Gallery.scss";
import { API_ROOT } from '../../utils/consts'

const GospelGallery = (props) => {

    const [pageLoaded, setPageLoaded] = useState(false);
    const [gallery, setGallery] = useState([])
    const [isGalleryLoading, setGalleryLoading] = useState(false);
    const [isBottom, setIsBottom] = useState(false);
    const [limit, setLimit] = useState(16);
    const [totalCount, setTotalCount] = useState(0);
    const [isGalleryPreview, setGalleryPreview] = useState(false);
    const [activeImage, setActiveImage] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        window.document.title = "The Lady Elsie Mason Collections";
        async function loadInitialGallery() {
            setGalleryLoading(true)
            const { data } = await axios.get(`${API_ROOT}api/gallery/get-gallery-api/${limit}`);
            if (data && data.success && data.images && data.images.length > 0) {
                setGallery(data.images)
                // setGallery(imagesFunction(data.images))
                setTotalCount(data.count ? data.count : 0)
                setGalleryLoading(false)
                setIsBottom(false)
            } else {
                setGallery([])
                setGalleryLoading(false)
            }
            setPageLoaded(true)
        }
        loadInitialGallery();
    }, [limit]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isBottom) {
            if ((gallery && gallery.length > 0) && (totalCount > gallery.length)) {
                setLimit(limit + 16)
                setGalleryLoading(true)
            } else {
                setIsBottom(false)
            }
        }
    }, [isBottom]);

    const handleGalleryPreview = (active,index) => {
        setGalleryPreview(!isGalleryPreview)
        if (active) {
            setActiveImage(active)
            setActiveIndex(index)
        } else {
            setActiveImage(null)
            setActiveIndex(null)
        }
    }


    function handleScroll() {
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        if (scrollTop + window.innerHeight + 100 >= scrollHeight) {
            setIsBottom(true);
        }
    }

    return (
        <div className="gallery-main-wrapper">
            {
                !pageLoaded ?
                    <Loader active size="massive" /> :
                    <>
                        <div className='gallery-inner-wrapper'>
                            <div className="page-title">
                                <div className="title">The Lady Elsie Mason Collections</div>
                            </div>
                            <div className={`custom-border`}></div>
                            {/* <div className="sub-title">
                                In publishing and graphic design, Lorem ipsum is a placeholder text
                            </div> */}
                            <Container className="gallery-grid-container">
                                <Row className="gallery-grid-row">
                                    {
                                        gallery && gallery.length > 0 &&
                                        gallery.map((item, index) => (
                                            <Col md="3" className="gallery-grid-col">
                                                <div 
                                                    className="gallery-grid-item" 
                                                    onClick={() => handleGalleryPreview(item,index)}>
                                                    <img src={API_ROOT + item.image_url} alt="gallery-img" />
                                                </div>
                                            </Col>
                                        ))
                                    }
                                </Row>
                            </Container>
                            {
                                isBottom && (gallery && gallery.length > 0) &&
                                (totalCount > gallery.length) &&
                                <div className="load-more">
                                    {
                                        isGalleryLoading &&
                                        <Spinner
                                            color="seconday"
                                            className=""
                                            style={{ width: '36px', height: '36px' }}
                                        />
                                    }
                                </div>
                            }
                        </div>
                        <Footer />
                    </>
            }
            {
                isGalleryPreview && gallery.length > 0 && activeImage &&
                <GalleryPreview
                    isOpen={isGalleryPreview}
                    toggle={handleGalleryPreview}
                    activeImage={activeImage}
                    activeIndex={activeIndex}
                    gallery={gallery}
                />
            }   
        </div>
    );
}

export default GospelGallery;