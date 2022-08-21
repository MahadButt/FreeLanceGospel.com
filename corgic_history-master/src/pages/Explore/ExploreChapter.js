import React, { useEffect, useState } from "react";
import moment from 'moment'
import { Loader } from "semantic-ui-react";
import { NavLink } from 'react-router-dom'
import { Spinner } from 'reactstrap'
import axios from "../../utils/axiosInstance"
import qs from "query-string";
import Footer from "../../components/Footer/NewFooter/NewFooter";
import { API_ROOT } from '../../utils/consts'
import "./ExploreChapter.scss";
import banner1 from "../../assets/Banner_1.png";

const ExploreChapter = (props) => {

    const chapter_id = qs.parse(props.location.search).id;

    const [blogs, setBlogs] = useState([]);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [blogLoads, setBlogLoads] = useState(10);
    const [total, setTotal] = useState(null);
    const [showLoader, setLoader] = useState(false);
    const [chapterDetail, setChapterDetail] = useState('');

    useEffect(() => {

        window.document.title = "Chapter's Stories | The Church Book";

        async function getInitialBlogs() {
            let url = `/blog/get-blogs/${blogLoads}?chap_id=${chapter_id}`
            // let url = `/blog/get-blogs/${blogLoads}`
            const [blogs] = await Promise.all([
                axios.get(url)
            ]);
            // console.log(blogs)
            setBlogs(blogs.data.blogs);
            setTotal(blogs.data.count);
            setChapterDetail(blogs.data)
            setLoader(false);
            setPageLoaded(true);
        }

        getInitialBlogs();

    }, [blogLoads]);

    const handleLoadMore = () => {
        if ((blogs && blogs.length > 0) && (total > blogs.length)) {
            setBlogLoads(blogLoads + 10)
            setLoader(true)
        }
    }

    return (
        <div className="explore-chapter">
            {
                !pageLoaded ? <Loader active size="massive" /> :
                <>
                    <div className="inner-container">
                        {    
                            chapterDetail && chapterDetail.chapter &&                 
                            <div className="title-wrapper">
                                <div className="title">
                                    {chapterDetail.chapter.title ? chapterDetail.chapter.title : ''}
                                </div>
                                <div className="description">
                                    {chapterDetail.chapter.description ? chapterDetail.chapter.description : ''}
                                </div>
                            </div>
                        }
                        <div className="content-container">
                            <hr className="separator"/>
                            {
                                chapterDetail && chapterDetail.chapter && chapterDetail.user &&
                                <div className="author-info-wrapper">
                                    <NavLink to={`/profile/?u_id=${chapterDetail.user.u_id}`} className="about-author">
                                        <div className="avatar">
                                            <img src={API_ROOT + chapterDetail.user.avatar_url} alt="avatar"/>
                                        </div>
                                        <div className="name">
                                            {chapterDetail.user.church_title} {chapterDetail.user.first_name} {chapterDetail.user.last_name}
                                        </div>
                                    </NavLink>
                                    <div className="created-date">
                                        <span className="label">Created Date: </span>{moment(chapterDetail.chapter.created_at).format("DD-MM-YYYY")}
                                    </div>
                                </div>
                            }
                            <div className="stories-listing">
                                {
                                    blogs && blogs.length > 0 ?
                                    blogs.map((item,index)=> (
                                        <NavLink to={`/story/?story_id=${item.id}`} className="story-item" key={'chap-story-' + index}>
                                            <div className="story-title">{item.title}</div>
                                            <div className="detail-wrapper">
                                                <div className="category" title="Category"> {item.category?.category_name}</div>
                                                <div className="sub-category" title="Sub Category"> {item.sub_category?.subcat_name}</div>
                                                <div className="created-at" title="Created at">{moment(item.created_at).fromNow()}</div>
                                            </div>
                                        </NavLink>
                                    ))
                                    :
                                    <div className="no-story">No Story Available For This Chapter</div>
                                }
                            </div>
                        </div>
                        <div className="load-more-container">
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
                                        style={{width: '22px', height: '22px'}}
                                    /> 
                                    </>
                                    :
                                    'Load More'
                                }
                            </div>
                        }
                        </div>
                    </div>
                    <Footer />
                </>
            }
        </div>
    );
}

export default ExploreChapter;