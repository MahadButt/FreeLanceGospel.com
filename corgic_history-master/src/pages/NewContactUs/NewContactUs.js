import React, { useEffect } from "react";
import { Input, TextArea, Button, Image } from "semantic-ui-react";
import { Container, Row, Col } from 'reactstrap'
import { Formik, Form } from "formik";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import * as yup from "yup";
import contactUs from "../../assets/contact_us.svg";
import "./NewContactUs.scss";

const ContactUs = (props) => {

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!props.noHeader) window.document.title = "Contact Us | The Church Book";
    }, []);

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
        values.type = "contact";
        const { data } = await axios.post("/user/contact", values);

        if (data.success) {
            toast.success(data.msg);
            fr.setSubmitting(false);
            fr.resetForm({
                values: {
                    name: "",
                    email: "",
                    message: ""
                }
            });

        } else {
            toast.error(data.msg);
            fr.setSubmitting(false);
        }
    }

    return (
        <Container className="new-contact-us-container">
            <Row className="new-contact-us-row">
                <Col md="4" className="title-section">
                    <div className="title-wrapper">
                        <div className="title">Contact Us</div>
                        <div className="custom-border"></div>
                    </div>
                    <div className="description">Let's get in touch. Tell us know what you need</div>
                    <div className="email-wrapper">
                        Email: <span className="email">support@thegospelpage.com</span>
                    </div>
                </Col>
                <Col md="8" className="form-section">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={schema}
                        onSubmit={sendMessage}
                    >
                        {(fr) => (
                            <Form>
                                <Row className="form-row">
                                    <Col md="6" className="form-fields-wrapper">
                                        <div className="field-item">
                                            <Input
                                                onChange={fr.handleChange}
                                                onBlur={fr.handleBlur}
                                                fluid name="name"
                                                placeholder="Full Name"
                                                type="text"
                                                autoComplete="off"
                                                value={fr.values.name}
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
                                                value={fr.values.email}
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
                                                    placeholder="Message"
                                                    rows={2}
                                                    value={fr.values.message}
                                                />
                                            </div>
                                            <div className="field-error">
                                                {fr.errors.message && fr.touched.message && fr.errors.message}
                                            </div>
                                        </div>
                                        <div className="contact-us-submit-btn">
                                            <Button
                                                type="submit"
                                                loading={fr.isSubmitting}
                                                disabled={fr.isSubmitting}
                                            >
                                                Send Message
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col md="6" className="form-image-wrapper">
                                        <Image src={contactUs} />
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </Col>
            </Row>
        </Container>
    );
}

export default ContactUs;