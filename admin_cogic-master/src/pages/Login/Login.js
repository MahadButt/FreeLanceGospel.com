import React, { useContext } from "react";
import axios from "../../utils/axiosInstance";
import { Button, Input, Grid, Header, Segment } from "semantic-ui-react";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";

import { AuthContext } from "../../shared/context/auth-context";

const Login = () => {

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

        try {

            const { data } =  await axios.post("/admin/sign-in", values);

            if (data.loginSuccess) {

                fr.setSubmitting(false);
    
                auth.login({
                    u_id: data.u_id,
                    email: data.email,
                    token: data.token,
                }, true);
        
            } else {
                fr.setSubmitting(false);
                toast.error(data.msg);
            }
            
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as="h2" color="blue">
                    Login to your account
                </Header>
                    <Segment stacked>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={schema}
                            onSubmit={handleSubmit}
                        >
                            {(fr) => (
                                <Form>
                                    <div className="accounts-input">
                                        <Input 
                                            fluid 
                                            type="email"
                                            name="email"
                                            onChange={fr.handleChange}
                                            onBlur={fr.handleBlur}
                                            icon="user" 
                                            iconPosition="left" 
                                            placeholder="Enter your email" 
                                        />
                                        <p className="input-field-error">
                                            {fr.errors.email && fr.touched.email && fr.errors.email}
                                        </p>
                                    </div>
                                    <div className="accounts-input">
                                        <Input
                                            fluid
                                            type="password"
                                            name="password"
                                            onChange={fr.handleChange}
                                            onBlur={fr.handleBlur}
                                            icon="lock"
                                            iconPosition="left"
                                            placeholder="Enter your password"
                                        />
                                        <p className="input-field-error">
                                            {fr.errors.password && fr.touched.password && fr.errors.password}
                                        </p>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        color="blue" 
                                        fluid 
                                        size="large"
                                        disabled={fr.isSubmitting || !fr.values.email || !fr.values.password}
                                        loading={fr.isSubmitting}
                                    >
                                        Login
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Segment>
            </Grid.Column>
        </Grid>
    );
}

export default Login;