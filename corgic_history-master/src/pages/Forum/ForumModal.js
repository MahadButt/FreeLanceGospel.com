import React, { useContext, useState } from "react";
import { Formik, Form } from "formik";
import { Modal, Button, Input, TextArea, Dropdown } from "semantic-ui-react";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";
import * as yup from "yup";

import { AuthContext } from "../../shared/context/auth-context";

const ForumModal = (props) => {

    const auth = useContext(AuthContext);

    const { handleClose, open, topics, sections } = props;

    const [topicSections, setTopicSections] = useState([]);

    const initialValues = {
        title: "",
        body: "",
        topic_id: "",
        section_id: ""
    };

    const schema = yup.object().shape({
        title: yup.string().min(2, "Title must be at least 2 characters long").required("Title is required!"),
        body: yup.string().min(5, "Post must be at least 5 characters long").required("Description is required!"),
        topic_id: yup.string().required("Topic is required!"),
        section_id: yup.string().required("Section is required!"),
    });

    const selectSections = (topic_id) => {

        const topicSections = [];
        
        sections.forEach(section => {

            if (section.topic_id === topic_id) {
                topicSections.push({
                    key: section.id,
                    value: section.id,
                    text: section.section_name
                });
            }
        });

        setTopicSections(topicSections);
        
    }

    const handleSubmit = async (values, fr) => {

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

    return (
        <div className="ForumModal">
            <Modal
                centered={false}
                open={open}
                onClose={handleClose}
                closeIcon
                size="small"
            >
                <Modal.Header>
                    Create New Forum Post
                </Modal.Header>

                <Modal.Content>
                    <Modal.Description>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={schema}
                            onSubmit={handleSubmit}
                        >
                            {(fr) => (
                                <Form>
                                    <div className="accounts-input">
                                        <label className="util-bold">Post Title</label>
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
                                        <p className="input-field-error">{fr.errors.title && fr.touched.title && fr.errors.title}</p>
                                    </div>
                                    <div className="accounts-input">
                                        <label className="util-bold">Post Topic</label>
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
                                        <p className="input-field-error">{fr.errors.topic_id && fr.touched.topic_id && fr.errors.topic_id}</p>
                                    </div>
                                    <div className="accounts-input">
                                        <label className="util-bold">Post Section</label>
                                        <Dropdown
                                            fluid
                                            placeholder="Choose Post Section"
                                            search
                                            selection
                                            name="section_id"
                                            value={fr.values.section_id}
                                            onClick={() => selectSections(fr.values.topic_id)}
                                            onChange={(event, { name, value }) => fr.setFieldValue(name, value)}
                                            options={topicSections}
                                        />
                                        <p className="input-field-error">{fr.errors.section_id && fr.touched.section_id && fr.errors.section_id}</p>
                                    </div>
                                    <div className="accounts-input">
                                        <label className="util-bold">Post Description</label>
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
                                        <p className="input-field-error">{fr.errors.body && fr.touched.body && fr.errors.body}</p>
                                    </div>
                                    <Button
                                        loading={fr.isSubmitting}
                                        disabled={
                                            fr.isSubmitting ||
                                            !fr.values.title ||
                                            !fr.values.body
                                        }
                                        fluid
                                        primary
                                        type="submit"
                                    >
                                        Create
                                </Button>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        </div>
    );
}

export default ForumModal;