import React from 'react';
import { Modal } from 'reactstrap';
import { Formik, Form } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Icon, Input, TextArea, Button, Image } from "semantic-ui-react";
import axios from "../../utils/axiosInstance";
import './FeedBackModal.scss'
const FeedBackModal = (props) => {
    const {
        isOpen,
        toggle
    } = props;

    const initialValues = {
        name: "",
        email: "",
        message: ""
    };

    const schema = yup.object().shape({
        name: yup.string().min(3, "Minimum 3 characters").required("Name is required!"),
        email: yup.string().email("Invalid Email").required("Email is required!"),
        message: yup.string().min(5, "Minimum 5 characters").required("Message is required!")
    });

    const sendMessage = async (values, fr) => {
        values.type = "feedback";
        const { data } = await axios.post("/user/contact", values);
        if (data.success) {
            toast.success("Thanks for your feedback.");
            fr.setSubmitting(false);
            fr.resetForm();
            toggle();

        } else {
            toast.error("Something went wrong, Please try again");
            fr.setSubmitting(false);
            toggle();
        }
    }

    return (
        <div>
            <Modal
                isOpen={isOpen} toggle={toggle} className="feedback-modal-container"
                size="md"
            >
                <div className="feedback-wrapper">
                    <div className="times-icon" onClick={toggle}>
                        <Icon name="times circle" className="icon" />
                    </div>
                    <div className="title">Feedback Us</div>
                    <div className="sub-title">Please fill for your feedback.</div>
                    <div className="form-wrapper">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={schema}
                            onSubmit={sendMessage}
                        >
                            {(fr) => (
                                <Form>
                                    <div className="field-item">
                                        <Input
                                            onChange={fr.handleChange}
                                            onBlur={fr.handleBlur}
                                            fluid name="name"
                                            placeholder="Full Name"
                                            type="text"
                                            autoComplete="off"
                                        />
                                        <div className="field-error">
                                            {fr.errors.name && fr.touched.name && fr.errors.name}
                                        </div>
                                    </div>
                                    <div className="field-item">
                                        <Input
                                            onChange={fr.handleChange}
                                            onBlur={fr.handleBlur}
                                            fluid name="email"
                                            placeholder="Email"
                                            type="email"
                                        />
                                        <div className="field-error">
                                            {fr.errors.email && fr.touched.email && fr.errors.email}
                                        </div>
                                    </div>
                                    <div className="field-item">
                                        <div className="ui form">
                                            <TextArea
                                                style={{ resize: "none" }}
                                                onChange={fr.handleChange}
                                                onBlur={fr.handleBlur}
                                                name="message"
                                                placeholder="Your feedback"
                                                rows={4}
                                            />
                                        </div>
                                        <div className="field-error">
                                            {fr.errors.message && fr.touched.message && fr.errors.message}
                                        </div>
                                    </div>
                                    <div className="feedback-submit-btn">
                                        <Button
                                            type="submit"
                                            loading={fr.isSubmitting}
                                            disabled={fr.isSubmitting}
                                        >
                                            Send Feedback
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

export default FeedBackModal;