import React, { Fragment, useContext } from "react";
import { Formik, Form } from "formik";
import { Modal, Button, Input, Header, Grid } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../../shared/context/auth-context";
import * as yup from "yup";
import axios from "../../../utils/axiosInstance";

import "./Register.scss";

const Register = (props) => {
    const auth = useContext(AuthContext);
    const initialValues = {
        first_name: "",
        last_name: "",
        email: "",
        denomination: "",
        church_title: "",
        password: "",
        re_password: ""
    };

    const schema = yup.object().shape({
        first_name: yup.string().min(2, "Minimum 2 characters").required("First name is required!"),
        last_name: yup.string().min(2, "Minimum 2 characters").required("Last name is required!"),
        denomination: yup.string().min(2, "Minimum 2 characters").required("Church denomination is required!"),
        church_title: yup.string().min(2, "Minimum 2 characters").required("Church title is required!"),
        email: yup.string().email("Invalid Email").required("Email is required!"),
        password: yup.string().min(6, "Password must be at least 6 characters long").required("Password is required!"),
        re_password: yup.string().oneOf([yup.ref("password"), null], "Passwords must match!").required("Password is required!")
    });

    const handleSubmit = async (values, fr) => {

        try {

            const { data } = await axios.post("/auth/sign-up", values);

            if (data.signUpSuccess) {

                fr.resetForm();
                toast.success(data.msg);
                props.switchMethod("login");

            } else {
                toast.error(data.msg);
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="register_container">
            <Header className="register_header">
                <div className="title"> Join The Church Book</div>
                <div className="custom-border"></div>
                <Header.Subheader>
                    <div className="sub-title"> Register to create posts and be a part of the history</div>
                </Header.Subheader>
            </Header>
            <Modal.Content className="mx-4">
                <Modal.Description>
                    <div class="d-flex justify-content-center">
                        <Grid.Row>
                            <Grid.Column className="register-form-wrapper">
                                    <Formik
                                        initialValues={initialValues}
                                        onSubmit={handleSubmit}
                                        validationSchema={schema}
                                    >
                                        {(fr) => (
                                            <Form>
                                                <div className="row">
                                                    <div className="col-lg-6 col-12">
                                                        <div className="input-field">
                                                            <label className="field-label">First Name</label>
                                                            <Input
                                                                fluid name="first_name"
                                                                value={fr.values.first_name}
                                                                onBlur={fr.handleBlur}
                                                                onChange={fr.handleChange}
                                                                placeholder="Enter your first name"
                                                                type="text"
                                                            />
                                                            <p className="field-error">
                                                                {fr.errors.first_name && fr.touched.first_name && fr.errors.first_name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-12">
                                                        <div className="input-field">
                                                            <label className="field-label">Last Name</label>
                                                            <Input
                                                                fluid name="last_name"
                                                                value={fr.values.last_name}
                                                                onBlur={fr.handleBlur}
                                                                onChange={fr.handleChange}
                                                                placeholder="Enter your last name"
                                                                type="text"
                                                            />
                                                            <p className="field-error">
                                                                {fr.errors.last_name && fr.touched.last_name && fr.errors.last_name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="input-field">
                                                            <label className="field-label">Email</label>
                                                            <Input
                                                                fluid name="email"
                                                                value={fr.values.email}
                                                                onBlur={fr.handleBlur}
                                                                onChange={fr.handleChange}
                                                                placeholder="Enter your email"
                                                                type="email"
                                                            />
                                                            <p className="field-error">
                                                                {fr.errors.email && fr.touched.email && fr.errors.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-6 col-12">
                                                        <div className="input-field">
                                                            <label className="field-label">Church Denomination</label>
                                                            <Input
                                                                fluid name="denomination"
                                                                value={fr.values.denomination}
                                                                onBlur={fr.handleBlur}
                                                                onChange={fr.handleChange}
                                                                placeholder="Enter your church denomination"
                                                                type="text"
                                                            />
                                                            <p className="field-error">
                                                                {fr.errors.denomination && fr.touched.denomination && fr.errors.denomination}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-12">
                                                        <div className="input-field">
                                                            <label className="field-label">Church Title</label>
                                                            <Input
                                                                fluid name="church_title"
                                                                value={fr.values.church_title}
                                                                onBlur={fr.handleBlur}
                                                                onChange={fr.handleChange}
                                                                placeholder="Enter your church title"
                                                                type="text"
                                                            />
                                                            <p className="field-error">
                                                                {fr.errors.church_title && fr.touched.church_title && fr.errors.church_title}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="input-field">
                                                            <label className="field-label">Password</label>
                                                            <Input
                                                                fluid name="password"
                                                                value={fr.values.password}
                                                                onBlur={fr.handleBlur}
                                                                onChange={fr.handleChange}
                                                                placeholder="Enter your password"
                                                                type="password"
                                                            />
                                                            <p className="field-error">
                                                                {fr.errors.password && fr.touched.password && fr.errors.password}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="input-field">
                                                            <label className="field-label">Re-Password</label>
                                                            <Input
                                                                fluid name="re_password"
                                                                value={fr.values.re_password}
                                                                onBlur={fr.handleBlur}
                                                                onChange={fr.handleChange}
                                                                placeholder="Re-type password"
                                                                type="password"
                                                            />
                                                            <p className="field-error">
                                                                {fr.errors.re_password && fr.touched.re_password && fr.errors.re_password}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accounts-privacy">
                                                    <p>
                                                        By registering you agree to our <Link to="/terms">Terms of Use</Link> and have
                                        read and understood our <Link to="/privacy">Privacy Policy</Link>.
                                    </p>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-6 col-12">
                                                        <div className="submit-btn">
                                                            <Button
                                                                loading={fr.isSubmitting}
                                                                disabled={fr.isSubmitting}
                                                                fluid type="submit"
                                                            >
                                                                Agree & Register
                                </Button>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-12">
                                                        <div className="Register--link text-center">
                                                            <p onClick={() => auth.handleSwitchMethod("login")} className="accounts-link">
                                                                Already have an account? Login!
                        </p>
                                                        </div>
                                                    </div>

                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                            </Grid.Column>
                        </Grid.Row>
                    </div>
                </Modal.Description>
            </Modal.Content>
        </div>
    );
}

export default Register;