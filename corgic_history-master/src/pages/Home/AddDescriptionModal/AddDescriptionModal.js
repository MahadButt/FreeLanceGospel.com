import React from 'react';
import { Modal } from 'reactstrap';
import { Icon } from 'semantic-ui-react'
import { useFormik } from 'formik';
import * as Yup from "yup";
import './AddDescriptionModal.scss'
const AddDescriptionModal = (props) => {
    const {
        isOpen,
        toggle,
        active
    } = props;

    const validationSchema = Yup.object().shape({
        description: Yup.string()
            // .min(2, 'Description is too short!')
            .max(300, 'Description is too long, you can write upto 300 characters only.')
            .required('Description is required'),
    });

    const formik = useFormik({
        initialValues: {
            description: '',
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            toggle({ description: values.description }, true, active);
        },
    });

    const handleToggle = () => {
        toggle({ description: "" }, false, null)
    }

    return (
        <div>
            <Modal
                isOpen={isOpen}
                toggle={handleToggle}
                className="congrats-member-modal-container"
                size="md"
            >
                <div className="congrats-member-wrapper">
                    <div className="times-icon" onClick={handleToggle}>
                        <Icon name="times circle" className="icon" />
                    </div>
                    <div className="title"> Write Description </div>
                    <div className="congrats-body-wrapper">
                        <form onSubmit={formik.handleSubmit} className="form-wrapper">
                            <div className="label">
                                Write Description ({formik.values.description.length} / 300)
                            </div>
                            <div className="congrat-field-item">
                                <textarea
                                    id="description"
                                    name="description"
                                    type="text"
                                    rows="6"
                                    maxLength="300"
                                    placeholder="Write something about your achievement"
                                    onChange={formik.handleChange}
                                    value={formik.values.description}
                                />
                            </div>
                            <div className="error">
                                {
                                    formik?.errors?.description ?? ""
                                }
                            </div>
                            <button type="submit" className="submit-button">Submit</button>
                        </form>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default AddDescriptionModal;