import React, { useState, useEffect } from "react";
import { Loader, Input } from "semantic-ui-react";
import { Container, Row, Col } from 'reactstrap';
import { NavLink } from 'react-router-dom'
import axios from "axios";
import Footer from "../../components/Footer/NewFooter/NewFooter";
import FakePdf from '../../assets/fake_pdf.png';
import "./Library.scss";
import Pagination from '../../components/Pagination/Pagination'
import { API_ROOT } from '../../utils/consts'

const Library = (props) => {

    // const [pageLoaded, setPageLoaded] = useState(false);    
    const [showLoader, setLoader] = useState(false);
    const [books, setBooks] = useState([])
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const items_per_page = 15;

    useEffect(() => {
        window.document.title = "Library | The Church Book";
        loadBooks();
    }, [search, page]);

    async function loadBooks() {
        let offset = (page * 15) - 15;
        setLoader(true)
        let url;
        if (search) {
            url = `api/lib/library-list?search_key=${search}&limit=${items_per_page}&offset=${offset}`
        } else {
            url = `api/lib/library-list?limit=${items_per_page}&offset=${offset}`
        }
        const { data } = await axios.get(`${API_ROOT}${url}`);
        if (data && data.success && data.successResponse && data.successResponse.library && data.successResponse.library.length > 0) {
            setBooks(data?.successResponse?.library)
            setPages(Math.ceil(data?.successResponse?.count / items_per_page));
            setLoader(false)
        } else {
            setBooks([])
            setLoader(false)
        }
        // setPageLoaded(true);
    }

    const fetchIdRef = React.useRef(0)
    const onPageChange = React.useCallback((pageIndex) => {
        const fetchId = ++fetchIdRef.current
        if (fetchId === fetchIdRef.current) {
            setLoader(true)
            setPage(pageIndex)
            // loadBooks(pageIndex)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [])

    const handleSearchBook = (e) => {
        setPage(1)
        const keywords = e.target.value;
        setSearch(keywords)

        // if (keywords && keywords.length > 0) {
        //     const results = books.filter(item =>
        //         item && item.title
        //             .toLowerCase()
        //             .toString()
        //             .includes(keywords.toLowerCase())
        //     );
        //     setSearchedBooks(results);
        // } else {
        //     setSearchedBooks(books)
        // }

    }

    const checkFileExtension = (file) => {
        const extension = file?.split('.').pop();
        return extension;
    }

    return (
        <div className="library-main-wrapper">
            <>
                {
                    showLoader &&
                    <Loader active size="massive" />
                }
                <div className='library-inner-wrapper'>
                    <div className="page-title">
                        <div className="title">Dr. Mattie Mcglothen Library</div>
                    </div>
                    <div className={`custom-border`}></div>
                    <Container className="books-container">
                        <Row className="search-field-row">
                            <Col md="6" lg="6" xl="3" className="search-field-col">
                                <Input
                                    autoComplete="off"
                                    name="search"
                                    value={search}
                                    onChange={handleSearchBook}
                                    icon="search"
                                    placeholder="Search Books By Name"
                                />
                            </Col>
                        </Row>
                        <Row className="books-row">
                            {
                                books && books.length > 0 ?
                                    books.map((item, index) => {
                                        return (
                                            <Col sm="12" md="6" lg="6" xl="3" className="books-cols" key={index} >
                                                <NavLink to={`library-detail?id=${item?.id}`} className="book-item">
                                                    {
                                                        item && item.documents && item.documents.document_url && checkFileExtension(item?.documents?.document_url) === 'pdf' ?
                                                            <img
                                                                className="book-img"
                                                                alt="book-thumbnail"
                                                                src={FakePdf}
                                                            />
                                                            :
                                                            <img
                                                                className="book-img"
                                                                alt="book-thumbnail"
                                                                src={item?.documents?.document_url}
                                                            />

                                                    }
                                                    <div className="title">{item && item.title ? item.title : ''}</div>
                                                    <div className="description"></div>
                                                </NavLink>
                                            </Col>
                                        )
                                    }) :
                                    <Col sm="12" className="no-data">
                                        {
                                            !showLoader && books.length === 0 &&
                                            'No Data Available'
                                        }
                                    </Col>
                            }
                        </Row>
                        <div className="custom-pagination">
                            <Pagination
                                pages={pages}
                                page={page}
                                onChangePage={onPageChange}
                            />
                        </div>
                    </Container>
                </div>
                <Footer />
            </>
        </div>
    );
}

export default Library;