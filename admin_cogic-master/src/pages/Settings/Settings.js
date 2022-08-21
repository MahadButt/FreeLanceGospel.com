import React, { useContext, useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Header, Checkbox, Button, Icon, Grid, Input, Segment } from "semantic-ui-react";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";

import { AuthContext } from "../../shared/context/auth-context";

import { siteStatusLiteral } from "../../utils/consts";

const Settings = (props) => {

    const auth = useContext(AuthContext);

    const [status, setStatus] = useState(1);

    useEffect(() => {

        async function loadStatus() {

            try {

                const { data } = await axios.get(
                    "/admin/status",
                    { headers: { Authorization: `Bearer ${auth.admin.token}` } }
                );

                setStatus(data.status);

            } catch (err) {
                console.log(err);
            }
        }

        loadStatus();

    }, []);

    const initialValues = {
        lockdown: status === siteStatusLiteral.LOCKED,
        maintain: status === siteStatusLiteral.MAINTAIN
    }

    const createAdmin = async (values, fr) => {

        try {

            const { data } = await axios.post(
                "/admin/new", values,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );

            if (data.success) {
                toast.success(data.msg);
            } else{
                toast.error(data.msg);
            }

            fr.setSubmitting(false);

        } catch (err) {
            console.log(err);
            fr.setSubmitting(false);
        }
    }

    const handleSubmit = async (values, fr) => {

        try {

            let status = 1;

            if (values.lockdown) {
                status = siteStatusLiteral.LOCKED;
            } else if (values.maintain) {
                status = siteStatusLiteral.MAINTAIN;
            }

            const { data } = await axios.patch(
                "/admin/status", { status },
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );

            if (data) {
                toast.success("Updated Successfully!");
            } else {
                toast.error("Something went wrong, try again!");
            }

            fr.setSubmitting(false);

        } catch (err) {
            console.log(err);
            fr.setSubmitting(false);
        }
    }

    return (
        <div className="padded-content">
            <Header size="large" dividing>
                Settings
            </Header>
            <Grid columns="equal">
                <Grid.Column>
                    <Header size="medium" dividing>
                        Site Status
                    </Header>
                    <Segment>
                        <Formik
                            enableReinitialize
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                        >
                            {fr => (
                                <Form>
                                    <div style={{ marginBottom: "20px" }}>
                                        <Checkbox
                                            toggle
                                            label="Enable Site Lockdown Mode"
                                            checked={fr.values.lockdown}
                                            onChange={() => fr.setFieldValue("lockdown", !fr.values.lockdown)}
                                        />
                                    </div>
                                    <div style={{ marginBottom: "20px" }}>
                                        <Checkbox
                                            toggle
                                            label="Enable Site Maintenanece Mode"
                                            checked={fr.values.maintain}
                                            onChange={() => fr.setFieldValue("maintain", !fr.values.maintain)}
                                        />
                                    </div>
                                    <Button
                                        primary
                                        icon labelPosition="right"
                                        type="submit"
                                        disabled={fr.isSubmitting}
                                        loading={fr.isSubmitting}
                                    >
                                        Save Settings
                                        <Icon name="save" />
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Segment>
                </Grid.Column>
                <Grid.Column>
                    <Header size="medium" dividing>
                        Create New Admin
                    </Header>
                    <Segment>
                        <Formik
                            initialValues={{
                                email: "",
                            }}
                            validationSchema={
                                yup.object().shape({
                                    email: yup.string().email("Invalid Email").required("Email is required!"),
                                })
                            }
                            onSubmit={createAdmin}
                        >
                            {fr => (
                                <Form>
                                    <div className="accounts-input">
                                        <label>Email</label>
                                        <Input
                                            name="email"
                                            fluid placeholder="Enter email"
                                            type="email"
                                            value={fr.values.email}
                                            onBlur={fr.handleBlur}
                                            onChange={fr.handleChange}
                                        />
                                        <p className="input-field-error">
                                            {fr.errors.email && fr.touched.email && fr.errors.email}
                                        </p>
                                    </div>
                                    <Button
                                        primary
                                        icon labelPosition="right"
                                        type="submit"
                                        loading={fr.isSubmitting}
                                        disabled={fr.isSubmitting}
                                    >
                                        Create Admin
                                        <Icon name="shield" />
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Segment>
                </Grid.Column>
            </Grid>
        </div>
    );
}

export default Settings;