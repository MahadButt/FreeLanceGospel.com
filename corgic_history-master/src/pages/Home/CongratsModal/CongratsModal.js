import React, { useState } from 'react';
import { Modal } from 'reactstrap';
import { Icon } from 'semantic-ui-react'
import { useFormik } from 'formik';
import * as Yup from "yup";
import Trohpy from '../../../assets/trophy.png'
import './CongratsModal.scss'
const CongratsModal = (props) => {
    const {
        isOpen,
        toggle,
        selection
    } = props;

    const member = {
        "week": "Week",
        "month": "Month"
    }

    const [isWrite, setIsWrite] = useState(false);

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
            toggle({ description: values.description });
        },
    });

    const handleToggle = () => {
        toggle({ description: "" })
    }

    return (
        <div>
            <Modal
                isOpen={isOpen}
                toggle={handleToggle}
                className="congrats-member-modal-container"
                size="md"
                backdrop={false}
            >
                <div className="congrats-member-wrapper">
                    <div className="times-icon" onClick={handleToggle}>
                        <Icon name="times circle" className="icon" />
                    </div>
                    <div className="congrats-body-wrapper">
                        <div className="congrats-icon">
                            <img src={Trohpy} alt="trophy" className="trophy" />
                        </div>
                        <div className="congrats-title">Congratulations!</div>
                        <div className="congrats-text">You have been selected as the Member of the {member[selection?.member_type]}</div>
                        {
                            !isWrite &&
                            <div className="congrats-buttons-wrapper">
                                <div className="congrats-btn" onClick={() => setIsWrite(true)}>Write Details</div>
                                <div className="congrats-btn" onClick={handleToggle}>Cancel</div>
                            </div>
                        }
                        {
                            isWrite &&
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
                        }
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default CongratsModal;