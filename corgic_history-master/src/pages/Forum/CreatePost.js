import React, { useContext, useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { Loader, Button, Input, TextArea, Dropdown } from "semantic-ui-react";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";
import * as yup from "yup";
import qs from "query-string";
import './CreatePost.scss';
import NewFooter from "../../components/Footer/NewFooter/NewFooter";
import { AuthContext } from "../../shared/context/auth-context";

const CreatePost = (props) => {
    
    const query = qs.parse(props.location.search);
    const auth = useContext(AuthContext);
    const [topicSections, setTopicSections] = useState([]);
    const [topics, setTopics] = useState([]);
    const [sections, setSections] = useState([]);
    const [forumPost, setForumPost] = useState(null);
    const [pageLoaded, setPageLoaded] = useState(false);
    
    const schema = yup.object().shape({
        title: yup.string().min(2, "Title must be at least 2 characters long").required("Title is required!"),
        body: yup.string().min(5, "Post must be at least 5 characters long").required("Description is required!"),
        topic_id: yup.string().required("Topic is required!"),
        // section_id: yup.string().required("Section is required!"),
    });

    // const selectSections = (topic_id, data) => {
    //     const topicSections = [];
    //     data.forEach(section => {
    //         if (section.topic_id === topic_id) {
    //             topicSections.push({
    //                 key: section.id,
    //                 value: section.id,
    //                 text: section.section_name
    //             });
    //         }
    //     });
    //     setTopicSections(topicSections);
    // }

    useEffect(() => {
        window.document.title = "Create Post | The Church Book";
        window.scrollTo(0, 0);
        if(query && query.forum_id) {
            loadCollectiveData(query.forum_id);
        } else {
            getPosts();
        }
    }, []);

    const loadCollectiveData = async (id) => {
        const [postObj, postArr] = await Promise.all([
            axios.get(`/forum/get-forum-post/${id}`),  
            axios.get("/forum/get-forum-home")
        ])
        setForumPost(postObj?.data ?? null);
        if(postArr && postArr.data && postObj && postObj.data) {
            arrangeData(postArr?.data,postObj?.data)
        }
        setPageLoaded(true)
    }

    async function getPosts() {
        try {
            const { data } = await axios.get("/forum/get-forum-home");
            if(data) {
                arrangeData(data, null)
            }
            setPageLoaded(true)
        } catch (err) {
            setPageLoaded(true)
            // console.log(err);   
        }
    }

    const arrangeData = (data, currentPost) => {
        const topics = data.topics.map(topic => {
            return {
                key: topic.id,
                value: topic.id,
                text: topic.topic_name
            }
        });
        // let sections = [];
        // data.topics.forEach(topic => {
        //     topic.sections.forEach(section => {
        //         sections.push({
        //             topic_id: section.topic_id,
        //             id: section.id,
        //             section_name: section.section_name
        //         });
        //     });
        // });
        setTopics(topics);
        // setSections(sections);
        // if(sections.length && currentPost) {
        //     selectSections(currentPost?.topic_id, sections)
        // }
    }

    const handleSubmit = async (values, fr) => {
        if(query && query.forum_id) {
            console.log(values)
            const { data } = await axios({
                method: "patch",
                url: `/forum/update-post/${query?.forum_id}`,
                data: values,
                headers: {
                    Authorization: `Bearer ${auth.user.token}` 
                },
            });
            if (data.success) {
                window.location.href = `/forum-post/?post_id=${query?.forum_id}`;
            } else {
                toast.error("Something went wrong, Please try again.");
            }
        } else {
            try {
                const { data } = await axios.post(
                    "/forum/new", 
                    values, 
                    { headers: { Authorization: `Bearer ${auth.user.token}` } }
                );
                if (data.success) {
                    window.location.href = `/forum-post/?post_id=${data.id}`;
                } else {
                    toast.error(data.msg);
                }
            } catch (err) {

            }
        }
    }

    const initialValues = {
        title: forumPost?.title ?? "",
        body: forumPost?.body ?? "",
        topic_id: forumPost?.topic_id ?? "",
        // section_id: forumPost?.section_id ?? ""
    };

    return (
        <div className="create-post-container">
            {
                !pageLoaded ? <Loader size="massive" active /> :
                <>
                    <div className="create-post-inner-container">
                        <div className="title-wrapper">
                            <div className="title">{query?.forum_id ? "Edit Your Post" : 'Create New Post'}</div>
                            <div className="custom-border"></div>
                        </div>
                        <div className="sub-title">
                            {query?.forum_id ? "Edit" : 'Write'} your forum post, let us know what's on your mind
                        </div>
                        <div className="create-blog-form-wrapper">
                            <Formik
                                initialValues={initialValues}
                                validationSchema={schema}
                                onSubmit={handleSubmit}
                            >
                                {(fr) => (
                                    <Form>
                                        <div className="input-field">
                                            <label className="field-label">Post Title</label>
                                            <Input
                                                fluid
                                                autoComplete="off"
                                                type="text"
                                                name="title"
                                                value={fr.values.title}
                                                placeholder="Enter post title"
                                                onBlur={fr.handleBlur}
                                                onChange={fr.handleChange}
                                            />
                                            <p className="field-error">{fr.errors.title && fr.touched.title && fr.errors.title}</p>
                                        </div>
                                        <div className="input-field">
                                            <label className="field-label">Post Topic</label>
                                            <Dropdown
                                                fluid
                                                placeholder="Choose Post Topic"
                                                search
                                                selection
                                                name="topic_id"
                                                value={fr.values.topic_id}
                                                onChange={(event, { name, value }) => fr.setFieldValue(name, value)}
                                                options={topics}
                                            />
                                            <p className="field-error">{fr.errors.topic_id && fr.touched.topic_id && fr.errors.topic_id}</p>
                                        </div>
                                        {/* <div className="input-field">
                                            <label className="field-label">Post Section</label>
                                            <Dropdown
                                                fluid
                                                placeholder="Choose Post Section"
                                                search
                                                selection
                                                name="section_id"
                                                value={fr.values.section_id}
                                                onClick={() => selectSections(fr.values.topic_id, sections)}
                                                onChange={(event, { name, value }) => fr.setFieldValue(name, value)}
                                                options={topicSections}
                                            />
                                            <p className="field-error">{fr.errors.section_id && fr.touched.section_id && fr.errors.section_id}</p>
                                        </div> */}
                                        <div className="input-field">
                                            <label className="field-label">Post Description</label>
                                            <div className="ui form">
                                                <TextArea
                                                    style={{ resize: "none" }}
                                                    name="body"
                                                    value={fr.values.body}
                                                    onChange={fr.handleChange}
                                                    onBlur={fr.handleBlur}
                                                    placeholder="Write your post here"
                                                    rows={8}
                                                />
                                            </div>
                                            <p className="field-error">{fr.errors.body && fr.touched.body && fr.errors.body}</p>
                                        </div>
                                        <div className="submit-btn">
                                            <Button
                                                loading={fr.isSubmitting}
                                                disabled={
                                                    fr.isSubmitting ||
                                                    !fr.values.title ||
                                                    !fr.values.body
                                                }
                                                type="submit"
                                            >
                                                {query?.forum_id ? "Edit Post" : 'Create Post'}
                                        </Button>
                                    </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                    <NewFooter />
                </>
            }
        </div>
    );
}

export default CreatePost;