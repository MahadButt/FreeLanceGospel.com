import React, { Fragment, useContext } from "react";
import { Modal, Button, Input, Grid, Header } from "semantic-ui-react";
import { Formik, Form } from "formik";
import { AuthContext } from "../../shared/context/auth-context";
import axios from "../../utils/axiosInstance";
import * as yup from "yup";
import { toast } from "react-toastify";

const ForgotPassword = (props) => {
    const auth = useContext(AuthContext);
    const schema = yup.object().shape({
        email: yup.string().email("Invalid Email").required("Email is required!"),
    });

    const recoverAccount = async (values, fr) => {
        const { data } = await axios.post("/auth/recover-password", values);
      
        console.log(data)
        if (data.success) {

            fr.setSubmitting(false);

            toast.success("Successfully recovered account!");

        } else {
            fr.setSubmitting(false);
            toast.error(data.msg);
        }
    }
    return (
        <div className="forgot_container">
            <Header className="forgot_header">
                <div className="title">Recover Account</div>
                <div className="custom-border"></div>
            </Header>
            <Modal.Content className="mx-4">
                <Modal.Description>
                    <div>
                        <Grid.Row>
                            <Grid.Column className="forgot-form-wrapper">
                                <Formik
                                    initialValues={{ email: "" }}
                                    validationSchema={schema}
                                    onSubmit={recoverAccount}
                                >
                                    {(fr) => (
                                        <Form>
                                            <div className="input-field">
                                                <label className="field-label">Email</label>
                                                {/* <Grid.Column textAlign="right" width={12}>
                                                       
                                                    </Grid.Column> */}
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    onChange={fr.handleChange}
                                                    onBlur={fr.handleBlur}
                                                    value={fr.values.email}
                                                    fluid placeholder="Enter your email"
                                                />
                                                <p className="field-error">{fr.errors.email && fr.touched.email && fr.errors.email}</p>
                                                <p onClick={() => auth.handleSwitchMethod("register")} className="accounts-link" to="/register">Don't have an account?</p>
                                            </div>
                                            <div className="submit-btn">
                                                <Button fluid primary type="submit">Submit</Button>
                                            </div>
                                            <div className="text-center pt-3">
                                                <p onClick={() => auth.handleSwitchMethod("login")} className="accounts-link">Remembered the password? Login!</p>
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

export default ForgotPassword;