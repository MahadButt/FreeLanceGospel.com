import React, { useState, useEffect, useContext } from 'react'
import { Modal, Input, Button, Dropdown, Form as SemanticForm } from 'semantic-ui-react'
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import axios from "../../../utils/axiosInstance";
import { AuthContext } from "../../../shared/context/auth-context";
import * as yup from "yup";

const AddSubCategoryModal = ({
    isOpen,
    toggle,
    categories,
    isSuccessAction,
    activeSubCategory
}) => {
    const auth = useContext(AuthContext);
    const [categoriesOption, setCategoriesOptions] = useState([]);

    useEffect(() => {
        if (categories && categories.length) {
            const categoriesOption = categories.map(category => {
                return {
                    key: category.id,
                    value: category.id,
                    text: category.category_name
                };
            });
            setCategoriesOptions(categoriesOption)
        }
    }, [])

    const handleSubmit = async (values, fr) => {

        if (activeSubCategory && activeSubCategory.id) {
            updateSubCategoryRequest({
                subcat_name: values.subcategory,
                parent_id: values.category,
            }, fr)
        } else {
            addSubCategoryRequest({
                subcat_name: values.subcategory,
                category_id: values.category,
            }, fr)
        }

    }

    const addSubCategoryRequest = async (payload, fr) => {
        try {
            const { data } = await axios.post(
                "/admin/new-blog-subcategory", payload,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );
            if (data.success) {
                toggle();
                toast.success("SubCategory has beed created successfully");
                isSuccessAction();
            } else {
                toggle();
                toast.error("Something Went Wrong Please try again.");
            }
        } catch (err) {
            toggle();
            toast.error("Something went wrong, Please try again.");
            fr.setSubmitting(false);
        }
    }

    const updateSubCategoryRequest = async (payload, fr) => {
        try {
            const { data } = await axios.patch(
                `/admin/update-blog-subcategory/${activeSubCategory?.id}`, payload,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );
            if (data.success) {
                toggle();
                toast.success("Question has beed updated successfully");
                isSuccessAction();
            } else {
                toggle();
                toast.error("Something Went Wrong Please try again.");
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
                {activeSubCategory ? 'Edit SubCategory' : 'Add a New SubCategory'}
            </Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Formik
                        initialValues={{
                            subcategory: activeSubCategory?.subcat_name ?? "",
                            category: activeSubCategory?.parent_id ?? ""
                        }}
                        validationSchema={
                            yup.object().shape({
                                subcategory: yup.string().required("SubCategory is required!"),
                                category: yup.string().required("Category is required!"),
                            })
                        }
                        onSubmit={handleSubmit}
                    >
                        {fr => (
                            <Form className="add-subcategory-modal-container">
                                <div className="accounts-input">
                                    <label>SubCategory Name</label>
                                    <Input
                                        name="subcategory"
                                        fluid placeholder="Enter SubCategory Name"
                                        type="text"
                                        value={fr.values.subcategory}
                                        onBlur={fr.handleBlur}
                                        onChange={fr.handleChange}
                                    />
                                    <p className="input-field-error">
                                        {fr.errors.subcategory && fr.touched.subcategory && fr.errors.subcategory}
                                    </p>
                                </div>
                                <div className="accounts-input-layout">
                                    <label>Category</label>
                                    <Dropdown
                                        fluid
                                        placeholder="Select a Category"
                                        selection
                                        search
                                        scrolling
                                        name="category"
                                        // onClick={getCategories}
                                        onChange={(event, { name, value }) => fr.setFieldValue(name, value)}
                                        value={fr.values.category}
                                        options={categoriesOption}
                                    />
                                    <p className="input-field-error">
                                        {fr.errors.category && fr.touched.category && fr.errors.category}
                                    </p>
                                </div>

                                <Button
                                    primary
                                    type="submit"
                                    loading={fr.isSubmitting}
                                    disabled={fr.isSubmitting}
                                    style={{ marginTop: '20px' }}
                                >
                                    {activeSubCategory ? 'Edit SubCategory' : 'Add SubCategory'}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    )
}

export default AddSubCategoryModal