import React, { useState, useEffect, Fragment, useContext } from "react";
import { Loader, Header, Grid, Segment, Icon, Divider, Label } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";
import qs from "query-string";
import { Container, Row, Col } from 'reactstrap';
import Comments from "./Comments";
import NewFooter from "../../components/Footer/NewFooter/NewFooter";

import { AuthContext } from "../../shared/context/auth-context";
import { ThemeContext } from "../../shared/context/theme-context";

import { API_ROOT } from "../../utils/consts";
import AddChapterModal from './AddChapterModal/AddChapterModal'
import "./BlogView.scss";

const BlogView = (props) => {

    const blog_id = qs.parse(props.location.search).story_id;

    const auth = useContext(AuthContext);
    const themeContext = useContext(ThemeContext);

    const [blog, setBlog] = useState(null);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [isAddChapterModal, setAddChapterModal] = useState(false);
    const [chapters, setChapters] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        loadBlog();
    }, []);

    const loadBlog = async () => {
        const { data } = await axios.get(`/blog/get-blog/${blog_id}`);
        window.document.title = `${data.title} | Stories`;
        setBlog(data);
        setPageLoaded(true);
    }

    useEffect(() => {
        async function fetchChapters() {
            if (auth && auth.user && auth.user.token) {
                const { data } = await axios.get("/chapter/get-chapters", {
                    headers: {
                        'Authorization': `Bearer ${auth.user.token}` 
                    }
                });
                // console.log(data)
                if (data && data.successResponse && data.successResponse.length > 0) {
                    setChapters(data.successResponse);
                }
            }
        }
        fetchChapters()
    },[chapters.length])

    const handleAddChapterModal = () => {
        setAddChapterModal(!isAddChapterModal)
    }

    const storyAddedSuccess = (isSuccess) => {
        if (isSuccess) {
            toast.success("Story Added To chapter Successfully.");
            loadBlog()
        } else {
            toast.error("Something went wrong! Try Again");
        }
    }

    return (
        <div className="story-detail-container">
        {
            !pageLoaded ? <Loader size="massive" active /> :
            <Fragment>
                <Container fluid className="story-detail-inner-container">
                    <Row className="story-detail-row">
                        <Col md="4" lg="4" xl="3" className="story-info-col">
                            <div className="story-info-box">
                                <div className="title-wrapper">
                                    <div className="title">Story Info</div>
                                    <div className="custom-border"></div>
                                </div>
                                <div className="avatar-wrapper">
                                    <img className="avatar" src={API_ROOT + blog.user.avatar_url} />
                                    <div className="church-title"> {blog.user.church_title} </div>
                                    <div className="name"> 
                                        {blog.user.first_name} {blog.user.last_name} 
                                    </div>
                                    <NavLink to={`/profile/?u_id=${blog.user.u_id}`}>
                                        <div className="profile-link"> 
                                            <div className="label">See Profile</div>  
                                            <div><Icon  className="icon" name="long arrow alternate right" /></div>
                                        </div>
                                    </NavLink>
                                </div>
                                <div className="category-wrapper">
                                    {
                                        blog && blog.chapter &&
                                        <div className="chapter"><span className="cat-label">Chapter:</span> {blog.chapter.title}</div>
                                    }
                                    <div className="category"><span className="cat-label">Category:</span> {blog.category.category_name}</div>
                                    <div className="sub-category"><span className="cat-label">SubCategory:</span> {blog.sub_category.subcat_name}</div>
                                    {
                                        (blog && blog.user && blog.user.u_id) && 
                                        (auth && auth.user && auth.user.u_id) &&
                                        blog.user.u_id === auth.user.u_id && blog.chapter === null &&
                                        <div className="view-chapters-stories" onClick={handleAddChapterModal}>
                                            Add Story to Chapter
                                        </div>
                                    }
                                    {
                                        blog && blog.chapter !== null &&
                                        <NavLink 
                                            to={`/explore/chapter?name=${'chapter'}&id=${blog.chapter.id}`} 
                                            className="view-chapters-stories"
                                        >
                                            View Chapter's Stroies
                                        </NavLink>
                                    }
                                    <div className="tag-label">Tags:</div>
                                    <div className="tags-list">
                                        {
                                            blog.tags.map(tag => (
                                                <div key={tag.id} className="tag">
                                                    {tag.tag.tag_name}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md="8" lg="8" xl="9" className="story-description-col">
                            <div className="story-image">
                                <img src={API_ROOT + blog.banner_img_url} />
                            </div>
                            <div className="description-box">
                                <div className="story-title">
                                    { blog.title }
                                </div>
                                <div className="story-sub-title">
                                    ({ blog.sub_title })
                                </div>
                                <div 
                                    className="story-description" 
                                    dangerouslySetInnerHTML={{ __html: blog.description }}
                                />
                            </div>
                        </Col>
                    </Row>
                    <div className="story-comments-row">
                        <Comments blog_id={blog_id} comments={blog.comments} />
                    </div>
                </Container>
                <NewFooter />
            </Fragment>
        }
        {
            isAddChapterModal && blog  &&
            <AddChapterModal
                isOpen={isAddChapterModal}
                toggle={handleAddChapterModal}
                chapters={chapters.length > 0 ? chapters : []}
                story={blog}
                storyAddedSuccess={(isSuccess) => storyAddedSuccess(isSuccess)}
            />
        }
        </div>
    );
}

export default BlogView;