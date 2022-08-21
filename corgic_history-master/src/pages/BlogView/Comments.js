import React, { useContext } from "react";
import { Header, Comment, TextArea, Button, Icon } from "semantic-ui-react";
import { Formik, Form } from "formik";
import axios from "../../utils/axiosInstance";
import * as yup from "yup";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import moment from "moment";
import Avatar from '../../assets/avatar.svg'
import { AuthContext } from "../../shared/context/auth-context";
import { API_ROOT } from "../../utils/consts";
import './Comments.scss';

const Comments = (props) => {

    const auth = useContext(AuthContext);

    const { blog_id, comments } = props;

    const initialValues = {
        blog_id: blog_id,
        comment: ""
    };

    const schema = yup.object().shape({
        comment: yup.string().required("Please fill the field"),
    });

    const handleSubmit = async (values, fr) => {

        try {
            
            const result = await axios.post(
                "/blog/comment", 
                values,
                { headers: { Authorization: `Bearer ${auth.user.token}` } }
            );

            if (result) {
                window.location.reload();
            } else  {
                toast.error("Something went wrong. Please try again!");
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="comments-container">
            <div className="title-wrapper">
                <div className="title1">
                    <div className="icon"><Icon name="comments" /></div>
                    <div className="label">Comments <span className="length">({comments.length})</span></div>
                </div>
                <div className="title2">Leave Your Response</div>
            </div>

            <div className="add-comments-wrapper">
                <div className="logged-user-avatar">
                    <img src={Avatar} alt="user-avatar" />
                </div>
                <div className="add-comments-form">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={schema}
                        onSubmit={handleSubmit}
                    >
                        {fr => (
                            <Form>
                                <div className="input-field">
                                    <TextArea 
                                        name="comment"
                                        values={fr.values.comment}
                                        onChange={fr.handleChange}
                                        onBlur={fr.handleBlur}
                                        style={{ resize: "none" }}
                                        placeholder="Add a comment"
                                        rows={2}
                                        className="text-area"
                                    />
                                </div>
                                <div className="button-wrapper">
                                    {
                                        !auth.isLoggedIn ?
                                        <div className="field-error">Please Login to submit your comment</div>
                                        :
                                        <div className="field-error">
                                            {
                                                fr.errors.comment && fr.touched.comment && fr.errors.comment
                                            }
                                        </div>
                                    }
                                    <Button 
                                        disabled={fr.isSubmitting}
                                        loading={fr.isSubmitting} 
                                        type="submit" 
                                        content="Post a Comment"
                                    />
                                </div>
                            </Form>
                        )}
                    </Formik>                
                </div>
            </div>

            <div className="comment-divider">
            </div>
            {
                comments.length === 0 ?
                <div className="not-comments">
				    <div className="label1">No comments yet!</div>
                    <div className="label2">
				    	Be a first one to post a comment!
                    </div>
                </div> : 
                <div className="prev-comments">
                {
                    comments.map(comment => (
                        <div className="comment-item">
                            <div className="avatar">
                                <img src={API_ROOT + comment.user.avatar_url} alt="avatar" />
                            </div>
                            <div className="comment-description">
                                <div className="user-name-wrapper">
                                    <NavLink to={`/profile/?u_id=${comment.user.u_id}`} className="link">
                                        <div className="name">
                                            {`${comment.user.first_name} ${comment.user.last_name}`}
                                        </div>
                                    </NavLink>
                                    <div className="comment-date">
                                        <div>{moment(comment.created_at).fromNow()}</div>
                                    </div>
                                </div>
                                <div className="actual-comment" style={{ whiteSpace: "pre-line" }}>{comment.comment}</div>
                            </div>
                        </div>
                    ))
                }
                </div>
            }
        </div>
    );
}

export default Comments;