import React, { useState, useContext, useRef } from 'react'
import { Modal, Button, Loader, Label, Input } from 'semantic-ui-react'
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { S3_BASE } from "../../../utils/consts";
import axios from "../../../utils/axiosInstance";
import { AuthContext } from "../../../shared/context/auth-context";

const UploadVideosModal = ({
    isOpen,
    toggle,
    isSuccessAction
}) => {

    const auth = useContext(AuthContext);
    const fileRef = useRef(null);
    const [isLoading, setLoading] = useState(false);

    const handleSubmit = async (values, fr) => {
        setLoading(true)
        try {

            const result = await Promise.all(values.video.map(async document => {
                const documentUrl = await axios.get(
                    `/admin/signed-url/?type=${document.object.type}&name=${document.object.name}`,
                    { headers: { Authorization: `Bearer ${auth.admin.token}` } }
                );
                const { status } = await axios.put(
                    documentUrl.data.url, document.object,
                    { headers: { "Content-Type": document.object.type } }
                );
                console.log("status", status);
                if (status === 200) {
                    return axios.post(
                        "/admin/videos",
                        { title: document.title, description: document.description, video_url: `${S3_BASE}/${documentUrl.data.key}` },
                        { headers: { Authorization: `Bearer ${auth.admin.token}` } }
                    );
                }

            }));

            if (result) {
                toggle();
                toast.success("Video has beed uploaded successfully");
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

    const handleVideo = (event, setFieldValue) => {

        if (event.target.files.length > 1) {
            return toast.error("Only 1 at a time!");
        }

        const data = [];

        for (let i = 0; i < event.target.files.length; i++) {
            data.push({
                title: "",
                description: "",
                object: event.target.files[i]
            });
        }
        setFieldValue("video", data);

    }
    const handleTitle = (index, event, fr) => {
        const updatedDocuments = [...fr.values.video];
        updatedDocuments[index].title = event.target.value;
        fr.setFieldValue(updatedDocuments);
    }
    const handleDescription = (index, event, fr) => {
        const updatedDocuments = [...fr.values.video];
        updatedDocuments[index].description = event.target.value;
        fr.setFieldValue(updatedDocuments);
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
                Add Video
            </Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Formik
                        initialValues={{
                            video: [],
                        }}
                        onSubmit={handleSubmit}
                    >
                        {fr => (
                            <Form className="upload-images-form-wrapper">
                                <div className="accounts-input">
                                    <Button
                                        content="Upload Video"
                                        labelPosition="right"
                                        icon="upload"
                                        type="button"
                                        onClick={() => fileRef.current.click()}
                                    />
                                    <input
                                        type="file"
                                        ref={fileRef}
                                        hidden
                                        multiple
                                        accept="video/mp4,video/x-m4v,video/*"
                                        onChange={(event) => handleVideo(event, fr.setFieldValue)}
                                    />
                                    <p className="input-field-error">
                                        {fr.errors.video && fr.touched.video && fr.errors.video}
                                    </p>
                                    {
                                        fr.values.video.length == 0 ? null :
                                            <div>
                                                {fr.values.video.map((item, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            style={{ marginTop: "20px", marginRight: '5px' }}
                                                        >
                                                            <div className="accounts-input">
                                                                <label className="util-bold">Title<span style={{ color: 'red' }}>*</span></label>
                                                                <Input
                                                                    placeholder="Enter title"
                                                                    onChange={(event) => handleTitle(index, event, fr)}
                                                                />
                                                            </div>
                                                            <div className="accounts-input">
                                                                <label className="util-bold">Description</label>
                                                                <Input
                                                                    placeholder="Enter description"
                                                                    onChange={(event) => handleDescription(index, event, fr)}
                                                                />
                                                            </div>
                                                            <Label >
                                                                {item.object.name}
                                                            </Label>
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
                                    disabled={fr.isSubmitting || isLoading || fr.values.video.length == 0 || fr.values.video[0].title == ""}
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

export default UploadVideosModal