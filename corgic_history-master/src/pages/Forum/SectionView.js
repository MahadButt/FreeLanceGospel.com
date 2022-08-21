import React, { useEffect, useState, Fragment, useContext } from "react";
import { Icon, Loader } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import moment from "moment";
import qs from "query-string";
import { toast } from "react-toastify";
import { AuthContext } from "../../shared/context/auth-context";
import { Table } from 'reactstrap'
import Footer from "../../components/Footer/NewFooter/NewFooter";
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal'
import "./SectionView.scss";

const SectionView = (props) => {

    const auth = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [isConfirmation, setConfirmation] = useState(false)
    const [activePost, setActivePost] = useState(null)

    const handleConfirmationModal = () => {
        setConfirmation(!isConfirmation)
    }
    const handleDelete = (confirm_status) => {
        console.log(confirm_status)
        if (confirm_status) {
            setPageLoaded(false)
            deleteStoryRequest(activePost)
        } else {
            setActivePost(null)
        }
    }

    const deleteStoryRequest = async (post) => {
        try {
            const { data } = await axios.delete(`/forum/del-post/${post.id}`, {
                headers: {
                    Authorization: `Bearer ${auth.user.token}`
                }
            });
            if (data && data.success) {
                loadSection();
                toast.success("Forum has been deleted Successfully !");
                setPageLoaded(true)
            } else {
                toast.error("Something went wrong, Please try again.")
                setPageLoaded(true)
            }
        } catch (err) {
            setPageLoaded(true)
        }
    }

    async function loadSection() {
        const query = qs.parse(props.location.search)
        const { data } = await axios.get(`/forum/section-post/?topic_id=${query.topic_id}&section_id=${query.section_id}`);
        setPosts(data);
        setPageLoaded(true);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        loadSection();
    }, []);

    return (
        <div className="section-view-container">
            {
                !pageLoaded ? <Loader size="huge" active /> :
                    <Fragment>
                        <div className="section-view-inner-container">
                            <div className="title-wrapper">
                                <div className="title">Section Posts</div>
                                <div className="custom-border"></div>
                            </div>
                            <div className="forum-topic">
                                ( {
                                    posts &&
                                    posts.section &&
                                    posts.section.section_name &&
                                    posts.section.section_name
                                } )
                            </div>
                            <div className="forum-table-wrapper">
                                <Table responsive borderless>
                                    <thead>
                                        <tr>
                                            <th>Topics</th>
                                            <th>Views</th>
                                            <th>Replies</th>
                                            <th>Last Post</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            posts.posts.map(post => (
                                                <tr key={post.id}>
                                                    <td>
                                                        <div className="title">
                                                            <NavLink
                                                                to={`/forum-post/?post_id=${post.id}`}
                                                                className="topic-title"
                                                            >
                                                                {post.title}
                                                            </NavLink>
                                                        </div>
                                                    </td>
                                                    <td><div className="views">{post.views}</div></td>
                                                    <td><div className="replies">{post.replies}</div></td>
                                                    <td>
                                                        <div className="last-reply">
                                                            {
                                                                post.lastReply ?
                                                                    <div>
                                                                        <NavLink
                                                                            to={`/profile/?u_id=${post.lastReply.user.u_id}`}
                                                                            className="topic-author"
                                                                        >
                                                                            {post.lastReply.user.church_title}{" "}
                                                                            {post.lastReply.user.first_name}
                                                                        </NavLink>
                                                                        <div
                                                                            style={{
                                                                                color: "gray",
                                                                                fontSize: "12px"
                                                                            }}
                                                                        >
                                                                            {moment(post.lastReply.created_at).fromNow()}
                                                                        </div>
                                                                    </div>
                                                                    : <p>No replies yet</p>
                                                            }
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {
                                                            auth?.user?.u_id === post?.u_id &&
                                                            <div className="actions-btns">
                                                                <div className="action edit" onClick={() => props.history.push(`/create-post?forum_id=${post.id}`)}>
                                                                    <Icon name="edit" className="icon" />
                                                                </div>
                                                                <div className="action delete" onClick={() => {
                                                                    handleConfirmationModal();
                                                                    setActivePost(post);
                                                                }}>
                                                                    <Icon name="trash" className="icon" />
                                                                </div>
                                                            </div>
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                        <Footer />
                    </Fragment>
            }
            {
                isConfirmation &&
                <ConfirmationModal
                    isOpen={isConfirmation}
                    toggle={handleConfirmationModal}
                    handleDelete={handleDelete}
                    text="Are you sure to delete this Post ?"
                />
            }
        </div>
    );
}

export default SectionView;