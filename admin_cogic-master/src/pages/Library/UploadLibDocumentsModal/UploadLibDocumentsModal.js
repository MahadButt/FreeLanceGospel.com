import React, { useState, useContext, useRef, useEffect } from 'react'
import { Modal, Button, Input, Label, Icon, Confirm } from 'semantic-ui-react'
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";
import { EditorState, convertToRaw, ContentState, convertFromHTML } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { S3_BASE } from "../../../utils/consts";
import axios from "../../../utils/axiosInstance";
import { AuthContext } from "../../../shared/context/auth-context";
import pdfLogo from "../../../assets/pdfLogo.jpg";
import "./editor.scss";
const UploadLibDocumentsModal = ({
    isOpen,
    toggle,
    isSuccessAction,
    activeLibrary
}) => {

    const auth = useContext(AuthContext);
    const fileRef = useRef(null);
    const [isLoading, setLoading] = useState(false);
    const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [deleteData, setDataForDelete] = useState({})
    useEffect(() => {
        if (activeLibrary) {
            const previewUrlsArray = [];

            for (let i = 0; i < activeLibrary.documents.length; i++) {
                if (activeLibrary.documents[i].document_url.includes(".pdf")) {
                    previewUrlsArray.push({
                        id: activeLibrary.documents[i].id,
                        type: "pdf",
                        preview: activeLibrary.documents[i].document_url
                    })
                } else if (activeLibrary.documents[i].document_url.includes("library/")) {
                    previewUrlsArray.push({
                        id: activeLibrary.documents[i].id,
                        type: "image",
                        preview: activeLibrary.documents[i].document_url
                    })
                }
            }
            setPreviewUrls(previewUrlsArray)
        }
    }, [activeLibrary]);

    const handleSubmit = async (values, fr) => {
        if (activeLibrary) {
            UpdatLibraryRequest(values, fr)
        } else {
            AddLibraryRequest(values, fr)
        }
    }
    const AddLibraryRequest = async (values, fr) => {
        setLoading(true)
        try {
            let documentUrls = []
            const result = await Promise.all(values.profile_pic.map(async document => {

                const documentUrl = await axios.get(
                    `/admin/signed-url/?type=${document.object.type}&name=${document.object.name}`,
                    { headers: { Authorization: `Bearer ${auth.admin.token}` } }
                );

                const { status } = await axios.put(
                    documentUrl.data.url, document.object,
                    { headers: { "Content-Type": document.object.type } }
                );

                if (status === 200) {
                    documentUrls.push(`${S3_BASE}/${documentUrl.data.key}`)
                }

            }));

            if (result) {
                let library = await axios.post(
                    "/admin/library",
                    { title: values.title, description: draftToHtml(convertToRaw(values.description.getCurrentContent())), document_url: documentUrls },
                    { headers: { Authorization: `Bearer ${auth.admin.token}` } }
                );
                if (library.data.success) {
                    toggle();
                    toast.success("Documents have beed uploaded successfully");
                    isSuccessAction();
                    setLoading(false)
                } else {
                    toggle();
                    setLoading(false)
                    toast.error("Something Went Wrong Please try again.");
                }
            } else {
                toggle();
                setLoading(false)
                toast.error("Something Went Wrong Please try again.");
            }
            fr.setSubmitting(false);
        } catch (err) {
            console.log(err);
            fr.setSubmitting(false);
            setLoading(false)
        }
    }
    const UpdatLibraryRequest = async (payload, fr) => {
        setLoading(true)
        try {
            let documentUrls = []
            const result = await Promise.all(payload.profile_pic.map(async document => {

                const documentUrl = await axios.get(
                    `/admin/signed-url/?type=${document.object.type}&name=${document.object.name}`,
                    { headers: { Authorization: `Bearer ${auth.admin.token}` } }
                );

                const { status } = await axios.put(
                    documentUrl.data.url, document.object,
                    { headers: { "Content-Type": document.object.type } }
                );

                if (status === 200) {
                    documentUrls.push(`${S3_BASE}/${documentUrl.data.key}`)
                }

            }));
            let body = {
                title: payload.title,
                description: draftToHtml(convertToRaw(payload.description.getCurrentContent())),
                document_url: documentUrls
            }
            if (result) {
                const { data } = await axios.post(
                    `/admin/update-library/${activeLibrary?.id}`, body,
                    { headers: { Authorization: `Bearer ${auth.admin.token}` } }
                );
                if (data.success) {
                    toggle();
                    toast.success("Library has been updated successfully");
                    isSuccessAction();
                    setLoading(false)
                } else {
                    toggle();
                    toast.error("Something went wrong, Please try again.");
                    fr.setSubmitting(false);
                    setLoading(false)
                }
                fr.setSubmitting(false);
            } else {
                fr.setSubmitting(false);
                setLoading(false)
                toggle();
                toast.error("Something Went Wrong Please try again.");
            }
        } catch (err) {
            toggle();
            toast.error("Something went wrong, Please try again.");
            fr.setSubmitting(false);
            setLoading(false)
        }
    }
    const handleProfilePic = async (event, profile_pics, setFieldValue) => {

        const profileData = [];
        const previewUrlsArray = [];
        const updatedPics = [...profile_pics];

        for (let i = 0; i < event.target.files.length; i++) {
            console.log(" event.target.files[i]", event.target.files[i])
            profileData.push({
                object: event.target.files[i]
            });
            if (event.target.files[i].type.includes("image")) {
                previewUrlsArray.push({
                    id: null,
                    type: "image",
                    preview: URL.createObjectURL(event.target.files[i])
                })
            } else if (event.target.files[i].type.includes("pdf")) {
                previewUrlsArray.push({
                    id: null,
                    type: "pdf",
                    preview: event.target.files[i]
                })
            }

        }
        const previewArray = previewUrls.concat(previewUrlsArray)
        const profile_pic_array = updatedPics.concat(profileData)
        setPreviewUrls(previewArray)
        setFieldValue("profile_pic", profile_pic_array);
    }
    const handleDescription = (editorState, fr) => {
        fr.setFieldValue("description", editorState)
    }
    const removeImage = async (index, imageID, profile_pics, setFieldValue) => {

        const updatedPics = [...profile_pics];
        updatedPics.splice(index, 1);
        previewUrls.splice(index, 1);
        if (imageID) {
            const { data } = await axios.delete(
                `/admin/del-lib_document/${imageID}`,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );
            if (data.success) {
                setPreviewUrls(previewUrls)
                setFieldValue("profile_pic", updatedPics);
                toast.success("Library has been deleted successfully");
            } else {
                toast.error("Something went wrong, Please try again.");
            }
        }
    }
    const handleConfirm = () => {
        setIsDeleteConfirmation(false);
        removeImage(deleteData.index, deleteData.itemId, deleteData.profile_pic, deleteData.setFieldValue);
    }
    const handleCancel = () => {
        setIsDeleteConfirmation(false)
    }

    const handleDeleteLibraryImage = (index, itemId, profile_pic, setFieldValue) => {
        let data = {
            index: index,
            itemId: itemId,
            profile_pic: profile_pic,
            setFieldValue: setFieldValue
        }
        setDataForDelete(data)
        setIsDeleteConfirmation(true)
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
                {activeLibrary ? 'Edit Library' : 'Upload Library'}

            </Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Formik
                        initialValues={{
                            profile_pic: [],
                            title: activeLibrary?.title ?? "",
                            description: (activeLibrary && activeLibrary.description) ? EditorState.createWithContent(
                                ContentState.createFromBlockArray(
                                    convertFromHTML(activeLibrary?.description)
                                )
                            ) : EditorState.createEmpty()
                        }}
                        onSubmit={handleSubmit}
                    >
                        {fr => (
                            <Form className="upload-images-form-wrapper">
                                <div className="accounts-input">
                                    <Button
                                        content="Upload Images / PDF"
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
                                        accept="image/*, image/heic, image/heif,application/pdf"
                                        onChange={(event) => handleProfilePic(event, fr.values.profile_pic, fr.setFieldValue)}
                                    />
                                    <p className="input-field-error">
                                        {fr.errors.profile_pic && fr.touched.profile_pic && fr.errors.profile_pic}
                                    </p>
                                    {
                                        previewUrls.length == 0 ? null :
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                                                {previewUrls.map((item, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            style={{ marginRight: '5px' }}
                                                        >
                                                            {item.type == "image" ?
                                                                <img
                                                                    src={item.preview}
                                                                    alt="picture"
                                                                    style={{ width: '50px', height: '50px', borderRadius: '5px' }}
                                                                /> :
                                                                <img
                                                                    src={pdfLogo}
                                                                    alt="pdf"
                                                                    style={{ width: '40px', height: '50px', borderRadius: '5px' }}
                                                                />
                                                            }
                                                            <Icon name="delete"
                                                                onClick={() => handleDeleteLibraryImage(index, item.id, fr.values.profile_pic, fr.setFieldValue)} />
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                    }
                                    <div style={{ marginTop: "20px", marginRight: '5px' }}>
                                        <div className="accounts-input">
                                            <label className="util-bold">Title <span style={{ color: 'red' }}>*</span></label>
                                            <Input
                                                name="title"
                                                value={fr.values.title}
                                                type="text" fluid
                                                placeholder="Enter title"
                                                onBlur={fr.handleBlur}
                                                onChange={fr.handleChange}
                                            />
                                        </div>
                                        <div className="accounts-input">
                                            <label className="util-bold">Description <span style={{ color: 'red' }}>*</span></label>
                                            <div style={{ border: "1px solid rgba(34, 36, 38, 0.15)", padding: 10, marginBottom: 5 }}>
                                                <Editor
                                                    editorState={fr.values.description}
                                                    wrapperClassName="draft-wrapper"
                                                    editorClassName="draft-editor"
                                                    onEditorStateChange={(editorState) => handleDescription(editorState, fr)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    primary
                                    type="submit"
                                    loading={fr.isSubmitting || isLoading}
                                    disabled={fr.isSubmitting || isLoading || (!activeLibrary && fr.values.profile_pic.length == 0 && previewUrls.length == 0) || previewUrls.length == 0 || fr.values.title == "" || fr.values.description == ""}
                                >
                                    Upload
                                </Button>
                            </Form>
                        )}
                    </Formik>
                    {
                        isDeleteConfirmation &&
                        <Confirm
                            header='Confirmation is Required'
                            content='Are you sure to delete this library image / PDF'
                            cancelButton='No'
                            confirmButton="Yes, Delete it."
                            open={isDeleteConfirmation}
                            onCancel={handleCancel}
                            onConfirm={handleConfirm}
                        />
                    }
                </Modal.Description>
            </Modal.Content>
        </Modal>
    )
}

export default UploadLibDocumentsModal