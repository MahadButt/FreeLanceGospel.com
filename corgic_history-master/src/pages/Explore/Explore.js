import React, { useEffect, useState, useContext, Fragment } from "react";
import { Loader, Message, Icon } from "semantic-ui-react";
import { Formik, Form } from "formik";
import { NavLink } from 'react-router-dom'
import { Container, Row, Col, Spinner } from 'reactstrap'
import axios from "../../utils/axiosInstance";
import { AuthContext } from "../../shared/context/auth-context";
import FeedCard from "../../components/FeedCard/FeedCard";
import Footer from "../../components/Footer/NewFooter/NewFooter";
import CatFilterBar from "./CatFilterBar/CatFilterBar";
import BgAudio from '../../assets/audio/Stories.mp3'
import Banner_Video from '../../assets/church book.mp4'
import "./Explore.scss";
import { toast } from "react-toastify";

const Explore = (props) => {

    const auth = useContext(AuthContext);
    const { filterUrl, setFilterUrl } = auth;

    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [isLoad, setLoad] = useState(false);
    const [blogLoads, setBlogLoads] = useState(10);
    const [total, setTotal] = useState(null);
    const [params, setParams] = useState('');
    const [showLoader, setLoader] = useState(false);
    
    useEffect(() => {
        window.document.title = "Stories | The Church Book";
        getInitialBlogs();
    }, [filterUrl, blogLoads, params]);

    async function getInitialBlogs() {
        let url;
        if (params && params.length > 0) {
            url = `/blog/get-blogs/${blogLoads}/?${params}`
        } else {
            url = `/blog/get-blogs/${blogLoads}`
        }
        const [blogs, parentCats] = await Promise.all([
            axios.get(url),
            axios.get("/blog/categories")
        ]);

        parentCats.data.forEach(cat => cat.subCats.unshift({}));
        setBlogs(blogs.data.blogs);
        setTotal(blogs.data.count);
        setCategories(parentCats.data);
        setLoader(false);
        setPageLoaded(true);
        setTimeout(() => {
            setLoad(true)
        }, 125)
    }

    const fetchBlogs = (values, fr) => {
        let query;
        if (values && values.category && !values.sub_category) {
            query = `cat_id=${values.category}`
        } else if (values && values.sub_category) {
            query = `subcat_id=${values.sub_category}&cat_id=${values.category}`
        } else {
            query = ''
        }
        setBlogLoads(10)
        setParams(query)

        let url = new URL("http://localhost:5000/blog/get-blogs/5");
        let params = url.searchParams;
        if (values.category) {
            params.append("cat_id", values.category);
        }

        if (values.sub_category) {
            params.append("subcat_id", values.sub_category);
        }

        const filteredUrl = url.href.substring("http://localhost:5000".length);

        fr.setFieldValue("category", "");
        fr.setFieldValue("sub_category", "");

        setFilterUrl(filteredUrl);
    }

    const handleLoadMore = () => {
        if ((blogs && blogs.length > 0) && (total > blogs.length)) {
            setBlogLoads(blogLoads + 10)
            setLoader(true)
        }
    }

    const deleteStoryRequest = async (story) => {
        try {
            const { data } = await axios.delete(`/blog/del-blog/${story.id}`, {
                headers: {
                    Authorization: `Bearer ${auth.user.token}`
                }
            });
            if (data && data.success) {
                getInitialBlogs()
                toast.success("Story has been deleted Successfully !");
                setPageLoaded(true)
            } else {
                toast.error("Something went wrong, Please try again.")
                setPageLoaded(true)
            }
        } catch (err) {
            setPageLoaded(true)
        }
    }

    const fetchIdRef = React.useRef(0)
    const onDeleteStory = React.useCallback((story) => {
        const fetchId = ++fetchIdRef.current
        if (fetchId === fetchIdRef.current) {
            deleteStoryRequest(story)
            setPageLoaded(false)
        }
    }, [])

    let blogsJSX = null;
    let errorJSX = null;

    if (pageLoaded && blogs && blogs.length > 0) {

        blogsJSX = blogs.map(blog => {
            return (
                <Col md="6" lg="6" xl="4" key={blog.id} className="blog-item">
                    <FeedCard blog={blog} onDeleteStory={onDeleteStory} />
                </Col>
            );
        });

    } else {

        errorJSX = (
            <Message size="small" negative>
                <Message.Header>No stories to load!</Message.Header>
                <p>Something went wrong. Try refreshing the page</p>
            </Message>
        );
    }

    const onSubCategoryClick = () => {
        let elmntToView = document.getElementById("story-section");
        elmntToView.scrollIntoView({
            behavior: 'smooth'
        });
    }

    return (
        <div className="explore">
            <div className="video-banner-container">
                <video muted autoPlay loop>
                    <source src={Banner_Video} height={"100vh"} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <audio autoPlay hidden>
                <source src={BgAudio} type="audio/mpeg" />
            </audio>
            {
                !pageLoaded ? <Loader active size="massive" /> :
                    <Fragment>
                        <Formik
                            initialValues={{
                                category: "",
                                sub_category: "",
                            }}
                            onSubmit={fetchBlogs}
                        >
                            {(fr) => (
                                <Form>
                                    <div className="explore-stories-container">
                                        <div className="categories-container">
                                            <CatFilterBar
                                                categories={categories}
                                                setFieldValue={fr.setFieldValue}
                                                submitForm={fr.submitForm}
                                                loaded={pageLoaded}
                                                onSubCategoryClick={onSubCategoryClick}
                                            />
                                        </div>
                                        <div className="stories-container" id="story-section">
                                            {/*<div className="google-ads">
                                            <GoogleAds slot="2434444"/>
                                        </div>*/}
                                            <div className={`title-btn-wrapper ${isLoad && 'loaded'}`}>
                                                <div className="header-title">Stories Feed</div>
                                                <NavLink to="/new">
                                                    <div className="create-btn">
                                                        <Icon name="plus" />
                                                        <div className="label">Create New Story</div>
                                                    </div>
                                                </NavLink>
                                            </div>
                                            {
                                                errorJSX ? errorJSX :
                                                    <Container fluid>
                                                        <Row className="explore-stories-wrapper">
                                                            {blogsJSX}
                                                        </Row>
                                                        <Row className="load-more-container">
                                                            {
                                                                (blogs && blogs.length > 0) &&
                                                                (total > blogs.length) &&
                                                                <div className="load-more-btn" onClick={handleLoadMore}>
                                                                    {
                                                                        showLoader ?
                                                                            <>
                                                                                Load More
                                                                                <Spinner
                                                                                    color="seconday"
                                                                                    className="ml-3"
                                                                                    style={{ width: '22px', height: '22px' }}
                                                                                />
                                                                            </>
                                                                            :
                                                                            'Load More'
                                                                    }
                                                                </div>
                                                            }
                                                        </Row>
                                                    </Container>
                                            }
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        <Footer />
                    </Fragment>
            }
        </div>
    );
}

export default Explore;