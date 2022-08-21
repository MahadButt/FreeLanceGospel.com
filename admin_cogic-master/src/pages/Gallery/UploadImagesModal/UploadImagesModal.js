import React, { useState, useContext, useRef } from 'react'
import { Modal, Button, Loader } from 'semantic-ui-react'
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";
import axios from "../../../utils/axiosInstance";
import { AuthContext } from "../../../shared/context/auth-context";
import './UploadImagesModal.scss';

const UploadImagesModal = ({
    isOpen,
    toggle,
    isSuccessAction
}) => {

    const auth = useContext(AuthContext);
    const fileRef = useRef(null);
    const [isLoading, setLoading] = useState(false);

    const handleSubmit = async (values, fr) => {
        setLoading(true)
        const formData = new FormData();
        if (values.profile_pic.length > 0) {
            for (var x = 0; x < values.profile_pic.length; x++) {
                formData.append("disk", values.profile_pic[x]);
            }
        }
        UploadImagesRequest(formData, fr)
    }

    const UploadImagesRequest = async (payload, fr) => {
        try {
            const { data } = await axios.post(
                "/admin/new-gallery-images", payload,
                {
                    headers:
                    {
                        "content-type": "multipart/form-data",
                        Authorization: `Bearer ${auth.admin.token}`
                    }
                }
            );
            if (data.success) {
                toggle();
                toast.success("Images has beed uploaded successfully");
                isSuccessAction();
                setLoading(false)
            } else {
                toggle();
                setLoading(false)
                toast.error("Something Went Wrong Please try again.");
            }
            fr.setSubmitting(false);
        } catch (err) {
            toggle();
            toast.error("Something went wrong, Please try again.");
            fr.setSubmitting(false);
            setLoading(false)
        }
    }

    const handleProfilePic = (event, setFieldValue) => {
        if (event.target.files.length > 0) {
            for (var x = 0; x < event.target.files.length; x++) {
                event.target.files[x].preview = URL.createObjectURL(event.target.files[x]);
            }
        }
        setFieldValue("profile_pic", event.target.files);
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
                Upload Gallery Pictures
            </Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Formik
                        initialValues={{
                            profile_pic: "",
                        }}
                        validationSchema={
                            yup.object().shape({
                                profile_pic: yup.string().required("You should select at least one picture"),
                            })
                        }
                        onSubmit={handleSubmit}
                    >
                        {fr => (
                            <Form className="upload-images-form-wrapper">
                                {
                                    isLoading &&
                                    <Loader size="large" active />
                                }
                                <div className="accounts-input">
                                    <Button
                                        content="Update pictures"
                                        labelPosition="left"
                                        icon="images"
                                        type="button"
                                        onClick={() => fileRef.current.click()}
                                    />
                                    <input
                                        type="file"
                                        ref={fileRef}
                                        hidden
                                        multiple
                                        accept="image/*, image/heic, image/heif"
                                        onChange={(event) => handleProfilePic(event, fr.setFieldValue)}
                                    />
                                    <p className="input-field-error">
                                        {fr.errors.profile_pic && fr.touched.profile_pic && fr.errors.profile_pic}
                                    </p>
                                    {
                                        !fr.values.profile_pic ? null :
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                                                {Object.keys(fr.values.profile_pic).map((item, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            style={{ marginTop: "20px", marginRight: '5px' }}
                                                        >
                                                            <img
                                                                src={fr.values.profile_pic[item].preview}
                                                                alt="picture"
                                                                style={{ width: '50px', height: '50px', borderRadius: '5px' }}
                                                            />
                                                            {/* <span
																onClick={(event) => fr.setFieldValue("profile_pic", delete fr.values.profile_pic[item])}
																className="upload--file-preview--cross"
															>
																<Icon name="close" size="large" />
															</span> */}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                    }
                                </div>
                                <Button
                                    primary
                                    type="submit"
                                    loading={fr.isSubmitting}
                                    disabled={fr.isSubmitting || isLoading}
                                >
                                    Upload
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    )
}

export default UploadImagesModal