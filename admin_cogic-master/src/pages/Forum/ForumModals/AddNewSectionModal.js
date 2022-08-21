import React, { useState, useEffect, useContext } from 'react'
import { Modal, Input, Button, Dropdown } from 'semantic-ui-react'
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import axios from "../../../utils/axiosInstance";
import { AuthContext } from "../../../shared/context/auth-context";
import * as yup from "yup";
const AddSectionsModal = ({
    isOpen,
    toggle,
    topics,
    isSuccessAction,
    activeSection,
    activeTopicId
}) => {
    const auth = useContext(AuthContext);
    const [topicsOption, setTopicsOptions] = useState([]);

    useEffect(() => {
        if (topics && topics.length) {
            const topicsOption = topics.map(topic => {
                return {
                    key: topic.id,
                    value: topic.id,
                    text: topic.topic_name
                };
            });
            setTopicsOptions(topicsOption)
        }
    }, [])

    const handleSubmit = async (values, fr) => {

        const payload = {
            section_name: values.section,
            topic_id: values.topic,
        }
        if (activeSection && activeSection.id) {
            updateSectionRequest(payload, fr)
        } else {
            addSectionRequest(payload, fr)
        }

    }

    const addSectionRequest = async (payload, fr) => {
        try {
            const { data } = await axios.post(
                "/admin/new-forum-section", payload,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );
            if (data.success) {
                toggle();
                toast.success("Section has beed created successfully");
                isSuccessAction();
            } else {
                toggle();
                toast.error("Something Went Wrong Please try again.");
            }
        } catch (err) {
            toggle();
            toast.error("Something went wrong, Please try again.");
            fr.setSubmitting(false);
        }
    }

    const updateSectionRequest = async (payload, fr) => {
        try {
            const { data } = await axios.patch(
                `/admin/update-forum-section/${activeSection?.id}`, payload,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );
            if (data.success) {
                toggle();
                toast.success("Section has beed updated successfully");
                isSuccessAction();
            } else {
                toggle();
                toast.error("Something Went Wrong Please try again.");
            }
        } catch (err) {
            toggle();
            toast.error("Something went wrong, Please try again.");
            fr.setSubmitting(false);
        }
    }

    return (
        <Modal
            closeIcon
            centered={false}
            open={isOpen}
            onClose={toggle}
            onOpen={toggle}
        >
            <Modal.Header>
                {activeSection ? 'Edit Section' : 'Add a New Section'}
            </Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Formik
                        initialValues={{
                            section: activeSection?.section_name ?? "",
                            topic: activeSection && activeSection.topic_id ? activeSection.topic_id : activeTopicId ? activeTopicId : ""
                        }}
                        validationSchema={
                            yup.object().shape({
                                section: yup.string().required("Section is required!"),
                                topic: yup.string().required("Topic is required!"),
                            })
                        }
                        onSubmit={handleSubmit}
                    >
                        {fr => (
                            <Form className="add-section-modal-container">
                                <div className="accounts-input">
                                    <label>Section</label>
                                    <Input
                                        name="section"
                                        fluid placeholder="Enter section"
                                        type="text"
                                        value={fr.values.section}
                                        onBlur={fr.handleBlur}
                                        onChange={fr.handleChange}
                                    />
                                    <p className="input-field-error">
                                        {fr.errors.section && fr.touched.section && fr.errors.section}
                                    </p>
                                </div>

                                <div className="accounts-input-layout">
                                    <label>Topic</label>
                                    <Dropdown
                                        fluid
                                        placeholder="Select a Topic"
                                        selection
                                        search
                                        scrolling
                                        name="topic"
                                        // onClick={gettopics}
                                        onChange={(event, { name, value }) => fr.setFieldValue(name, value)}
                                        value={fr.values.topic}
                                        options={topicsOption}
                                    />
                                    <p className="input-field-error">
                                        {fr.errors.topic && fr.touched.topic && fr.errors.topic}
                                    </p>
                                </div>

                                <Button
                                    primary
                                    type="submit"
                                    loading={fr.isSubmitting}
                                    disabled={fr.isSubmitting}
                                    style={{ marginTop: '20px' }}
                                >
                                    {activeSection ? 'Edit Section' : 'Add Section'}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    )
}

export default AddSectionsModal