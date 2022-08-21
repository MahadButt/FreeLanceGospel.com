import React, { useContext } from 'react'
import { Modal, Input, Button } from 'semantic-ui-react'
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";
import axios from "../../../utils/axiosInstance";
import { AuthContext } from "../../../shared/context/auth-context";

const AddBlogCategoryModal = ({
    isOpen,
    toggle,
    activeCategory,
    isSuccessAction
}) => {

    const auth = useContext(AuthContext);

    const handleSubmit = async (values, fr) => {
        if (activeCategory) {
            UpdateCategoryRequest({
                category_name: values.category_name
            }, fr)
        } else {
            AddCategoryRequest({
                category_name: values.category_name
            }, fr)
        }

    }

    const AddCategoryRequest = async (payload, fr) => {
        try {
            const { data } = await axios.post(
                "/admin/new-blog-category", payload,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );
            if (data.success) {
                toggle();
                toast.success("Category has beed created successfully");
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

    const UpdateCategoryRequest = async (payload, fr) => {
        try {
            const { data } = await axios.patch(
                `/admin/update-blog-catetory/${activeCategory?.id}`, payload,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );
            if (data.success) {
                toggle();
                toast.success("Category has been updated successfully");
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
                {activeCategory ? 'Edit Category' : 'Add a New Category'}
            </Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Formik
                        initialValues={{
                            category_name: activeCategory?.category_name ?? "",
                        }}
                        validationSchema={
                            yup.object().shape({
                                category_name: yup.string().required("Category Name is required!"),
                            })
                        }
                        onSubmit={handleSubmit}
                    >
                        {fr => (
                            <Form>
                                <div className="accounts-input">
                                    <label>Category Name</label>
                                    <Input
                                        name="category_name"
                                        fluid placeholder="Enter Category Name"
                                        type="text"
                                        value={fr.values.category_name}
                                        onBlur={fr.handleBlur}
                                        onChange={fr.handleChange}
                                    />
                                    <p className="input-field-error">
                                        {fr.errors.category_name && fr.touched.category_name && fr.errors.category_name}
                                    </p>
                                </div>
                                <Button
                                    primary
                                    type="submit"
                                    loading={fr.isSubmitting}
                                    disabled={fr.isSubmitting}
                                >
                                    {activeCategory ? 'Edit Category' : 'Add Category'}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    )
}

export default AddBlogCategoryModal