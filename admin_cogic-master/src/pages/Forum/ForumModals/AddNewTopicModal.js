import React, { useContext } from 'react'
import { Modal, Input, Button } from 'semantic-ui-react'
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";
import axios from "../../../utils/axiosInstance";
import { AuthContext } from "../../../shared/context/auth-context";

const AddNewTopicModal = ({
    isOpen,
    toggle,
    activeTopic,
    isSuccessAction
}) => {

    const auth = useContext(AuthContext);

    const handleSubmit = async (values, fr) => {
        if (activeTopic) {
            UpdateTopicRequest({
                topic_name: values.topic_name
            }, fr)
        } else {
            AddTopicRequest({
                topic_name: values.topic_name
            }, fr)
        }

    }

    const AddTopicRequest = async (payload, fr) => {
        try {
            const { data } = await axios.post(
                "/admin/new-forum-topic", payload,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );
            if (data.success) {
                toggle();
                toast.success("Topic has beed created successfully");
                isSuccessAction();
            } else {
                toggle();
                toast.error("Something Went Wrong Please try again.");
            }
            fr.setSubmitting(false);
        } catch (err) {
            toggle();
            toast.error("Something went wrong, Please try again.");
            fr.setSubmitting(false);
        }
    }

    const UpdateTopicRequest = async (payload, fr) => {
        try {
            const { data } = await axios.patch(
                `/admin/update-forum-topic/${activeTopic?.id}`, payload,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );
            if (data.success) {
                toggle();
                toast.success("Topic has been updated successfully");
                isSuccessAction();
            } else {
                toggle();
                toast.error("Something went wrong, Please try again.");
                fr.setSubmitting(false);
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
            size="tiny"
        >
            <Modal.Header>
                {activeTopic ? 'Edit Topic' : 'Add a New Topic'}
            </Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Formik
                        initialValues={{
                            topic_name: activeTopic?.topic_name ?? "",
                        }}
                        validationSchema={
                            yup.object().shape({
                                topic_name: yup.string().required("Topic Name is required!"),
                            })
                        }
                        onSubmit={handleSubmit}
                    >
                        {fr => (
                            <Form>
                                <div className="accounts-input">
                                    <label>Topc Name</label>
                                    <Input
                                        name="topic_name"
                                        fluid placeholder="Enter Topic Name"
                                        type="text"
                                        value={fr.values.topic_name}
                                        onBlur={fr.handleBlur}
                                        onChange={fr.handleChange}
                                    />
                                    <p className="input-field-error">
                                        {fr.errors.topic_name && fr.touched.topic_name && fr.errors.topic_name}
                                    </p>
                                </div>
                                <Button
                                    primary
                                    type="submit"
                                    loading={fr.isSubmitting}
                                    disabled={fr.isSubmitting}
                                >
                                    {activeTopic ? 'Edit Topic' : 'Add Topic'}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    )
}

export default AddNewTopicModal