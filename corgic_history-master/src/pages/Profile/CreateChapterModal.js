import React, { useState, useContext } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { Formik, Form } from "formik";
import axios from "../../utils/axiosInstance";
import { Icon, Input, Button, TextArea } from 'semantic-ui-react'
import { AuthContext } from "../../shared/context/auth-context";
import './CreateChapterModal.scss'
const CreateChapterModal = (props) => {
    const {
        isOpen,
        toggle,
        chapterCreatedSuccess
    } = props;
    const auth = useContext(AuthContext);

    const handleSubmit = async (values, fr) => {
        const { data } = await axios({
            method: "post",
            url: "chapter/new",
            data: {
                title: values.title,
                description: values.description
            },
            headers: {
                Authorization: `Bearer ${auth.user.token}` 
            },
        });
        if (data && data.success) {
            toggle()
            chapterCreatedSuccess(true)
        } else {
            fr.setSubmitting(false);
            toggle()
            chapterCreatedSuccess(false)
        }
    }

    return (
        <div>
            <Modal
                isOpen={isOpen} toggle={toggle} className="create-chapter-modal-container"
                size="md"
            >
                <div className="create-chapter-wrapper">
                    <div className="times-icon" onClick={toggle}>
                        <Icon name="times circle" className="icon" />
                    </div>
                    <div className="title"> Create New Chapter </div>
                    <div className="create-chapter-form">
                        <Formik
                            initialValues={{
                                title: '',
                                description: ''
                            }}
                            onSubmit={handleSubmit}
                        >
                            {(fr) => (
                                <Form>
                                    <div className="input-field">
                                        <label className="field-label">Title</label>
                                        <Input
                                            autoComplete="off"
                                            fluid name="title"
                                            value={fr.values.title}
                                            onBlur={fr.handleBlur}
                                            onChange={fr.handleChange}
                                            placeholder="Enter Chapter Title"
                                            type="text"
                                        />
                                        <p className="input-field-error">
                                            {fr.errors.title && fr.touched.title && fr.errors.title}
                                        </p>
                                    </div>
                                    <div className="input-field">
                                        <label className="field-label">Description</label>
                                        <TextArea
                                            fluid name="description"
                                            values={fr.values.description}
                                            onBlur={fr.handleBlur}
                                            onChange={fr.handleChange}
                                            placeholder="Enter Chapter description"
                                            rows={2}
                                        />
                                        <p className="input-field-error">
                                            {fr.errors.description && fr.touched.description && fr.errors.description}
                                        </p>
                                    </div>
                                    <div className="submit-btn">
                                        <Button
                                            loading={fr.isSubmitting}
                                            disabled={
                                                fr.isSubmitting || !fr.values.title
                                            }
                                            className={`submit-btn`}
                                        >
                                            Create Chapter
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default CreateChapterModal;