import React, { Fragment, useContext } from "react";
import { Modal, Button, Input, Grid, Header, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";
import { AuthContext } from "../../shared/context/auth-context";
import * as yup from "yup";
import LoginIcon from '../../assets/login.jpg'
import PostIcon from "../../assets/paper.svg";
import ChatIcon from "../../assets/conversation.svg";
import PollsIcon from "../../assets/yes.svg";
import banner1 from "../../assets/Banner_1.png";

const Login = (props) => {

    const auth = useContext(AuthContext);

    const initialValues = {
        email: "",
        password: ""
    };

    const schema = yup.object().shape({
        email: yup.string().email("Invalid Email").required("Email is required!"),
        password: yup.string().min(6, "Password must be at least 6 characters long").required("Password is required!"),
    });

    const handleSubmit = async (values, fr) => {

        const { data } = await axios.post("/auth/sign-in", values);

        if (data.loginSuccess) {

            fr.setSubmitting(false);

            auth.login({
                u_id: data.u_id,
                role_id: data.role_id,
                first_name: data.first_name,
                last_name: data.last_name,
                church_title: data.church_title,
                email: data.email,
                avatar_url: data.avatar_url,
                token: data.token,
            }, true);

            toast.success("Successfully logged in!");

        } else {
            fr.setSubmitting(false);
            toast.error(data.msg);
        }
    }

    return (
        <div className="login_container">
            <Header className="login_header">
                <div className="title">Login to The Church Book</div>
                <div className="custom-border"></div>
                <Header.Subheader>
                    <div className="sub-title">Login to manage your profile and create posts</div>
                </Header.Subheader>
            </Header>
            <Modal.Content className="mx-4">
                <Modal.Description>
                <div class="d-flex justify-content-center">
                        <Grid.Row>
                            <Grid.Column className="login-form-wrapper">
                                <div className="Login--info">
                                    <img src={LoginIcon} alt="React Logo" />
                                </div>
                                        <Formik
                                            initialValues={initialValues}
                                            onSubmit={handleSubmit}
                                            validationSchema={schema}
                                        >
                                            {(fr) => (
                                                <Form>
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
                                                        <p className="field-error">{fr.errors.email && fr.touched.email && fr.errors.email}</p>
                                                        <p onClick={() => auth.handleSwitchMethod("register")}
                                                            className="accounts-link" to="/register"
                                                        >
                                                            Don't have an account?
                                                    </p>
                                                    </div>
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
                                                        <p className="field-error">{fr.errors.password && fr.touched.password && fr.errors.password}</p>
                                                        <p
                                                            onClick={() => auth.handleSwitchMethod("forgot")}
                                                            className="accounts-link" to="/forgot-password"
                                                        >
                                                            Forgot password?
                                                    </p>
                                                    </div>
                                                    <div className="accounts-privacy">
                                                        <p>
                                                            By signing in you agree to our <Link to="/terms">Terms of Use</Link> and have
                                                read and understood our <Link to="/privacy">Privacy Policy</Link>.
                                            </p>
                                                    </div>
                                                    <div className="submit-btn">
                                                        <Button
                                                            loading={fr.isSubmitting}
                                                            disabled={fr.isSubmitting}
                                                            fluid type="submit"
                                                        >
                                                            Agree & Login
                                        </Button>
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

export default Login;
