import React, { useEffect } from "react";
import { Input, TextArea, Button, Icon, Image } from "semantic-ui-react";
import { Formik, Form } from "formik";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import * as yup from "yup";
import Footer from "../../components/Footer/NewFooter/NewFooter";
import { Row, Col } from 'reactstrap'
import "./ContactUs.scss";
import contactUs from "../../assets/contact_us.svg";

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
        <div className="contact-us-page-container">
            <div className="contact-us-inner-container">
                <div className="title-wrapper">
                    <div className="title">Contact Us</div>
                    <div className="custom-border"></div>
                </div>
                <div className="sub-title">Let's get in touch. Tell us know what you need</div>

                <div className="form-wrapper">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={schema}
                        onSubmit={sendMessage}
                    >
                        {(fr) => (
                            <Form>
                                <Row>
                                    <Col md="7">
                                        <div className="input-field">
                                            <label className="field-label">Name</label>
                                            <Input
                                                onChange={fr.handleChange}
                                                onBlur={fr.handleBlur}
                                                fluid name="name"
                                                placeholder="Name"
                                                type="text"
                                                autoComplete="off"
                                                value={fr.values.name}
                                            />
                                            <p className="field-error">
                                                {fr.errors.name && fr.touched.name && fr.errors.name}
                                            </p>
                                        </div>
                                        <div className="input-field">
                                            <label className="field-label">Email</label>
                                            <Input
                                                onChange={fr.handleChange}
                                                onBlur={fr.handleBlur}
                                                fluid name="email"
                                                placeholder="Email"
                                                type="email"
                                                value={fr.values.email}
                                            />
                                            <p className="field-error">
                                                {fr.errors.email && fr.touched.email && fr.errors.email}
                                            </p>
                                        </div>

                                        <div className="input-field">
                                            <label className="field-label">Message</label>
                                            <div className="ui form">
                                                <TextArea
                                                    style={{ resize: "none" }}
                                                    onChange={fr.handleChange}
                                                    onBlur={fr.handleBlur}
                                                    name="message"
                                                    placeholder="Message"
                                                    rows={5}
                                                    value={fr.values.message}
                                                />
                                            </div>
                                            <p className="field-error">
                                                {fr.errors.message && fr.touched.message && fr.errors.message}
                                            </p>
                                        </div>
                                        <div className="submit-btn">
                                            <Button
                                                type="submit"
                                                loading={fr.isSubmitting}
                                                disabled={fr.isSubmitting}
                                            >
                                                Send Message
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col md="5" className="right-cols">
                                        <div className="detail-wrapper">
                                            {/*<div className="website">thegospelpage.com</div>*/}
                                            <div className="email-support">
                                                Email: <span className="bolded-text">support@thegospelpage.com</span>
                                            </div>
                                        </div>
                                        <div className="image-wrapper">
                                            <Image src={contactUs} />
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ContactUs;