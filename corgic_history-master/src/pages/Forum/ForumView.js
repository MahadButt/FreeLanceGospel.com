import React, { useContext, useState, useEffect, Fragment } from "react";
import { Formik, Form } from "formik";
import { Segment, Header, Loader, Grid, Image, TextArea, Button } from "semantic-ui-react";
import axios from "../../utils/axiosInstance";
import * as yup from "yup";
import qs from "query-string";
import moment from "moment";
import { NavLink, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Row, Col } from 'reactstrap';
import Footer from "../../components/Footer/NewFooter/NewFooter";
import { API_ROOT } from "../../utils/consts";
import { AuthContext } from "../../shared/context/auth-context";

import "./ForumView.scss";

const ForumView = (props) => {

    const auth = useContext(AuthContext);
    const post_id = qs.parse(props.location.search).post_id;

    const [post, setPost] = useState(null);
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {

        window.scrollTo(0, 0);

        async function loadPost() {

            const { data } = await axios.get(`/forum/get-forum-post/${post_id}`);

            window.document.title = `${data.title} | Forum`;
            console.log(data)
            setPost(data);
            setPageLoaded(true);
        }

        loadPost();

    }, []);

    const initialValues = {
        post_id: post_id,
        reply: ""
    };

    const schema = yup.object().shape({
        reply: yup.string().required("Reply can't be empty!"),
    });

    const handleSubmit = async (values, fr) => {

        try {

            const result = await axios.post(
                "/forum/reply",
                values,
                { headers: { Authorization: `Bearer ${auth.user.token}` } }
            );

            if (result) {
                window.location.reload();
            } else {
                toast.error("Something went wrong. Please try again!");
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="forum-view-container">
            {
                !pageLoaded ? <Loader active size="massive" /> :
                <>
                    <div className="forum-view-inner-container">
                        <div className="forum-view-comments">                            
                            <Row className="title-comment-row top-row">
                                <Col md="3" className="user-avatar-wrapper">
                                    <img src={API_ROOT + post.user.avatar_url} className="avatar" alt="avatar"/>
                                    <NavLink to={`/profile/?u_id=${post.user.u_id}`} className="topic-author">
                                        <div className="church-title">{post.user.church_title}</div>
                                        <div className="user-name">{post.user.first_name} {post.user.last_name}</div>
                                    </NavLink>
                                    <div className="date">{moment(post.created_at).fromNow()}</div>
                                </Col>
                                <Col md="9" className="user-comment-wrapper">
                                    <div className="post-title">
                                        {post.title}
                                    </div>
                                    <div className="post-body">
                                        {post.body}
                                    </div>
                                </Col>
                            </Row>
                            <div className="row-separator">
                                <div className="separator"></div>
                                <div className="separator-label">Replies</div>
                                <div className="separator"></div>
                            </div>
                            {
                                post && post.replies && post.replies.length > 0 ?
                                post.replies.map(reply => (
                                <Row className="title-comment-row">
                                    <Col md="3" className="user-avatar-wrapper">
                                        <img src={API_ROOT + reply.user.avatar_url} className="avatar" alt="avatar"/>
                                        <NavLink to={`/profile/?u_id=${reply.user.u_id}`} className="topic-author">
                                            <div className="church-title">{reply.user.church_title}</div>
                                            <div className="user-name">{reply.user.first_name} {reply.user.last_name}</div>
                                        </NavLink>
                                        <div className="date">{moment(post.created_at).fromNow()}</div>
                                    </Col>
                                    <Col md="9" className="user-comment-wrapper">
                                        <div className="post-body">
                                            {reply.reply}
                                        </div>
                                    </Col>
                                </Row>
                                ))
                                :
                                <div className="no-reply">
                                    No Reply yet for this post
                                </div>
                            }
                        </div>
                        <div className="reply-form-wrapper-row">
                            <Formik
                                initialValues={initialValues}
                                validationSchema={schema}
                                onSubmit={handleSubmit}
                            >
                                {fr => (
                                    <Form>
                                        <div className="input-field">
                                            <div className="label">Leave Your Reply</div>
                                            <TextArea
                                                name="reply"
                                                values={fr.values.reply}
                                                onChange={fr.handleChange}
                                                onBlur={fr.handleBlur}
                                                style={{ resize: "none" }}
                                                placeholder="write your reply . . ."
                                                rows={8}
                                                className="text-area"
                                            />
                                        </div>
                                        <div className="button-wrapper">
                                            {
                                                !auth.isLoggedIn ?
                                                <div className="field-error">Please Login to submit your reply</div>
                                                :
                                                <div className="field-error">
                                                    {
                                                        fr.errors.reply && fr.touched.reply && fr.errors.reply
                                                    }
                                                </div>
                                            }
                                            <Button 
                                                disabled={fr.isSubmitting}
                                                loading={fr.isSubmitting}
                                                type="submit" 
                                                content="Submit Your Reply" 
                                                primary 
                                            />
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                    <Footer />
                </>
            }

        </div>
    );
}

export default ForumView;