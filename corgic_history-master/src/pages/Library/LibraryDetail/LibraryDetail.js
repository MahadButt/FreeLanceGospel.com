import React, { useState, useEffect } from "react";
import { Loader, Input, Icon } from "semantic-ui-react";
import { Container, Row, Col, Collapse, Spinner } from 'reactstrap';
import axios from "axios";
import qs from "query-string";
import { useHistory } from 'react-router-dom'
import Footer from "../../../components/Footer/NewFooter/NewFooter";
import "./LibraryDetail.scss";
import Pagination from '../../../components/Pagination/Pagination'
import ImageModal from '../ImageModal/ImageModal'
import { LIBRARY_URL, API_ROOT } from '../../../utils/consts'
import FakePdf from '../../../assets/fake_pdf.png';

const LibraryDetail = (props) => {

    const items_per_page = 10;

    const [showLoader, setLoader] = useState(false);
    const [isTranscript, setTranscript] = useState(true);
    const [isObjDesc, setObjDesc] = useState(false);
    const [isItemDesc, setItemDesc] = useState(false);
    const [bookDetail, setBookDetail] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(15);
    const [totalItems, setTotalItems] = useState([]);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(items_per_page);
    const [isImageModal, setImageModal] = useState(false);
    const [isThumbnailLoaded, setThumbnailLoaded] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null)

    const history = useHistory();


    const book_id = qs.parse(props.location.search).id;
    const coll_alias = qs.parse(props.location.search).collection;

    useEffect(() => {
        window.document.title = "Book Detail | The Church Book";
        window.scrollTo({ top: 0 })
        loadBookDetail();
    }, [book_id]);

    async function loadBookDetail() {
        setLoader(true)
        setThumbnailLoaded(false)
        await axios.get(`${API_ROOT}api/lib/get-library/${book_id}`)
            .then((res) => {
                if (res && res.data && res.data.success && res.data.successResponse) {
                    setBookDetail(res.data.successResponse)
                    setLoader(false)
                    logicForPreviewFirstImage(res?.data?.successResponse?.documents)
                    // paginationLogic(res.data.successResponse)
                } else {
                    setLoader(false)
                    setBookDetail('')
                }
            })
            .catch((err) => {
                setLoader(false)
                setBookDetail('')
            })
    }

    const logicForPreviewFirstImage = (data) => {
        if (data && data.length && checkFileExtension(data[0].document_url) !== 'pdf') {
            setSelectedImage(data[0])
        }
    }

    const handleChangeImage = (item) => {
        if (item && item.document_url) {
            if (checkFileExtension(item.document_url) === 'pdf') {
                window.open(`${item.document_url}`, '_blank');
            } else {
                setSelectedImage(item)
            }

        }
    }

    // const handleDownloadImage = () => {
    //     if (bookDetail && bookDetail.collectionAlias && bookDetail.id) {
    //         console.log("triggered")
    //         window.open(`${API_ROOT}api/lib/downloadImage?alias=${bookDetail.collectionAlias}&id=${bookDetail.id}`);

    //     }

    // }

    const handleImageModal = () => {
        setImageModal(!isImageModal)
    }

    // const paginationLogic = (data) => {
    //     const arr = data.parent.children && data.parent.children.length > 0 ? data.parent.children : [];
    //     const count = arr.length;
    //     setTotalItems(arr)
    //     setPages(Math.ceil(count/items_per_page))
    //     // console.log(arr)
    //     // console.log(count)
    // }

    // const fetchIdRef = React.useRef(0)
    // const onPageChange = React.useCallback((pageIndex) => {
    //     const fetchId = ++fetchIdRef.current
    //     if (fetchId === fetchIdRef.current) {
    //         // console.log(pageIndex)
    //         // setLoader(true)
    //         setPage(pageIndex)
    //         let skip = ((pageIndex - 1) * (items_per_page)) // 1 => 1-1 * 10
    //         let limit = (pageIndex * items_per_page)      // 1 * 10 === (0,10)
    //         setSkip(skip)
    //         setLimit(limit)

    //         window.scrollTo({ top: 0, behavior: 'smooth' })
    //     }
    // }, [])

    // const handlePrevImage = () => {
    //     let arr = bookDetail && bookDetail.parent.children && bookDetail.parent.children.length > 0 ? bookDetail.parent.children : [];
    //     if (arr.length > 0 && bookDetail) {
    //         arr.forEach(function(item, index) {
    //             if (item.id == bookDetail.id && index > 0) {
    //                 // console.log(arr[index - 1].id)
    //                 history.push(`library-detail?id=${arr[index - 1].id}&collection=${bookDetail.collectionAlias}`)
    //             }          
    //         });
    //     }
    // }
    // const handleNextImage = () => {
    //     let arr = bookDetail && bookDetail.parent.children && bookDetail.parent.children.length > 0 ? bookDetail.parent.children : [];
    //     if (arr.length > 0 && bookDetail) {
    //         arr.forEach(function(item, index) {
    //             if (item.id == bookDetail.id && index < arr.length) {
    //                 // console.log(arr[index +1 ].id)
    //                 history.push(`library-detail?id=${arr[index +1 ].id}&collection=${bookDetail.collectionAlias}`)
    //             }
    //         });
    //     }
    // }

    const checkFileExtension = (file) => {
        if (file) {
            const extension = file?.split('.').pop();
            return extension
        }
        return;
    }

    return (
        <div className="library-detail-main-wrapper">
            <>
                {
                    showLoader &&
                    <Loader active size="massive" />
                }
                <div className='library-detail-inner-wrapper'>
                    <div className="page-title">
                        <div className="title">
                            {bookDetail?.title}
                        </div>
                        <div className="subtitle"></div>
                    </div>
                    <Container className="content-container">
                        <Row className="content-row">
                            <Col md="6" lg="7" xl="9" className="left-col">
                                <div className="book-thumbnail-wrapper">
                                    {/* <div className="left-arrow" onClick={handlePrevImage}>
                                        <Icon name="chevron left" />
                                    </div> */}
                                    {
                                        selectedImage && selectedImage.document_url &&
                                        <div className="thumbnail-img">
                                            <div className="icons-wrapper">
                                                {/* <div
                                                    className="icon-box"
                                                    onClick={handleDownloadImage}
                                                >
                                                    <Icon name="download" className="icon" />
                                                </div> */}
                                                <div className="icon-box ml-2" onClick={handleImageModal}>
                                                    <Icon name="expand arrows alternate" className="icon" />
                                                </div>
                                            </div>
                                            <img
                                                className={`${'show'}`}
                                                src={selectedImage?.document_url} alt="img"
                                            />
                                        </div>
                                    }
                                    {/* <div className="right-arrow" onClick={handleNextImage}>
                                        <Icon name="chevron right" />
                                    </div> */}
                                </div>
                                <div className="page-number"></div>
                                <div className="book-details-collapse-wrapper">
                                    <div className="collapse-item">
                                        <div
                                            className={`collapse-label ${isTranscript && 'selected'}`}
                                            onClick={() => setTranscript(!isTranscript)}
                                        >
                                            <div className="title">Description</div>
                                            <Icon
                                                name={`chevron ${isTranscript ? 'down' : 'right'}`}
                                                className="icon"
                                            />
                                        </div>
                                        <Collapse
                                            isOpen={isTranscript}
                                            className="collapse-wrapper"
                                        >
                                            {
                                                bookDetail && bookDetail.description ?
                                                    <div
                                                        className="description"
                                                        dangerouslySetInnerHTML={{ __html: bookDetail.description }}
                                                    />
                                                    :
                                                    <div className="description">No Description</div>
                                            }

                                        </Collapse>
                                    </div>
                                    {/*
                                    <div className="collapse-item">
                                        <div
                                            className={`collapse-label ${isObjDesc && 'selected'}`}
                                            onClick={() => setObjDesc(!isObjDesc)}
                                        >
                                            <div className="title">Object Description</div>
                                            <Icon
                                                name={`chevron ${isObjDesc ? 'down' : 'right'}`}
                                                className="icon"
                                            />
                                        </div>
                                        <Collapse
                                            isOpen={isObjDesc}
                                            className="collapse-wrapper"
                                        >
                                            <div className="obj-desc-wrapper">
                                                {
                                                    bookDetail && bookDetail.parent && bookDetail.parent.fields &&
                                                    bookDetail.parent.fields.length > 0 &&
                                                    bookDetail.parent.fields.map((item, index) => (
                                                        <div className="obj-item" key={"ind - " + index}>
                                                            <div className="obj-label">{item.label ? item.label : ''}</div>
                                                            <div className="obj-value">{item.value ? item.value : ''}</div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </Collapse>
                                    </div>
                                    <div className="collapse-item">
                                        <div
                                            className={`collapse-label ${isItemDesc && 'selected'}`}
                                            onClick={() => setItemDesc(!isItemDesc)}
                                        >
                                            <div className="title">Item Description</div>
                                            <Icon
                                                name={`chevron ${isItemDesc ? 'down' : 'right'}`}
                                                className="icon"
                                            />
                                        </div>
                                        <Collapse
                                            isOpen={isItemDesc}
                                            className="collapse-wrapper"
                                        >
                                            <div className="obj-item-wrapper">
                                                {
                                                    bookDetail && bookDetail.fields && bookDetail.fields.length > 0 &&
                                                    bookDetail.fields.map((item, index) => (
                                                        <div className="obj-item" key={"ind - " + index}>
                                                            <div className="obj-label">{item.label ? item.label : ''}</div>
                                                            <div className="obj-value">{item.value ? item.value : ''}</div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </Collapse>
                                    </div>
                                    */}
                                </div>
                            </Col>
                            <Col md="6" lg="5" xl="3" className="right-col mt-5 mt-md-0">
                                <div className="download-button">Assets</div>
                                <div className="pages-wrapper">
                                    {
                                        bookDetail && bookDetail && bookDetail.documents && bookDetail.documents.length > 0 &&
                                        // bookDetail.documents.slice(skip, limit).map((item, index) => (
                                        bookDetail.documents.map((item, index) => (
                                            <div
                                                className={`page-item ${(bookDetail && bookDetail.id === item.id) && 'active'}`}
                                                onClick={() => handleChangeImage(item)}
                                                key={index}
                                            >
                                                <div className="page-img">
                                                    {
                                                        item && item.document_url && checkFileExtension(item?.document_url) === 'pdf' ?
                                                            <img src={FakePdf} alt="page_img" />
                                                            :
                                                            <img src={item?.document_url} alt="page_img" />
                                                    }
                                                </div>
                                                <div className="page-number">{item.title && item.title}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="custom-pagination">
                                    {/*
                                        bookDetail && bookDetail.parent && bookDetail.parent.children &&
                                        <Pagination
                                            pages={pages}
                                            page={page}
                                            onChangePage={onPageChange}
                                        />
                                    */}
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <Footer />
            </>
            {
                isImageModal && selectedImage && selectedImage.document_url &&
                <ImageModal
                    isOpen={isImageModal}
                    toggle={handleImageModal}
                    imageUri={selectedImage.document_url}
                />
            }
        </div>
    );
}

export default React.memo(LibraryDetail);


