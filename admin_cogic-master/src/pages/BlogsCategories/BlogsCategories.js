import React, { useState, useContext, useEffect } from "react";
import { Header, Button, Pagination, Loader, Table, Icon, Checkbox, Confirm } from "semantic-ui-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import AddBlogCategoryModal from "./AddBlogCategoryModal/AddBlogCategoryModal";
import { AuthContext } from "../../shared/context/auth-context";

const BlogsCategories = () => {

    const auth = useContext(AuthContext);

    const [categories, setCategories] = useState(null);
    const [activePage, setActivePage] = useState(1);
    const [pageCount, setPageCount] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isEditConfirmation, setIsEditConfirmation] = useState(false);
    const [isAddCategoryModal, setIsAddCategoryModal] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(() => {
        loadCategories();
    }, [activePage]);

    async function loadCategories() {
        let offset = (activePage * 15) - 15;
        const { data } = await axios.get(`/admin/get-blog-categories?limit=${15}&offset=${offset}`,
            {
                headers: {
                    Authorization: `Bearer ${auth.admin.token}`
                }
            }
        );
        if (data && data.success && data.successResponse && data.successResponse.length) {
            setCategories(data.successResponse);
            setPageCount(Math.floor(data.count / 15));
        }
        setLoaded(true);
        setLoading(false)
    }
    const handlePageChange = (event, { activePage }) => setActivePage(activePage);

    const handleCategoryModal = () => {
        setIsAddCategoryModal(true)
    }
    const hideCategoryModal = () => {
        setIsAddCategoryModal(false)
        setActiveCategory(null)
    }
    const handleEditCategory = (category) => {
        setActiveCategory(category)
        handleCategoryModal()
    }
    const editCategory = (category) => {
        setActiveCategory(category)
        setIsEditConfirmation(true)
    }

    const handleConfirm = () => {
        setIsEditConfirmation(false);
        setLoading(true)
        UpdateCategoryRequest();
    }
    const handleCancel = () => {
        setIsEditConfirmation(false)
        setActiveCategory(null)
    }

    const handleActionStatus = () => {
        loadCategories();
    }
    const UpdateCategoryRequest = async () => {
        const payload = {
            active: activeCategory?.active === 1 ? 0 : 1
        }
        try {
            const { data } = await axios.patch(
                `/admin/update-blog-catetory/${activeCategory?.id}`,
                payload,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );
            if (data.success) {
                toast.success("Category has been updated successfully");
            } else {
                toast.error("Something went wrong Please try again.");
            }
            loadCategories();
            setActiveCategory(null);
        } catch (err) {
            setActiveCategory(null);
            setLoading(false)
            toast.error("Something went wrong Please try again.");
        }
    }

    let categoryJSX = null;

    if (!loaded && !categories) {

        categoryJSX = <Loader size="medium" active />;

    } else if (categories?.length > 0) {

        let categoryRows = categories.map((category, index) => {

            return (
                <Table.Row key={category.id}>
                    <Table.Cell width="11">
                        <Header as="h4" image>
                            <Header.Content>
                                {category?.category_name}
                            </Header.Content>
                        </Header>
                    </Table.Cell>
                    <Table.Cell width="3">
                        <Button
                            title="Edit Category"
                            style={{ marginRight: "10px" }}
                            primary
                            circular
                            icon="edit"
                            size="tiny"
                            onClick={() => handleEditCategory(category)}
                        />
                        <Button
                            title="See Related Questions"
                            primary
                            size="tiny"
                            as={Link}
                            to={`/blogs-subCategories/?edit=true&category_id=${category?.id}`}
                        >
                            SubCategories
                        </Button>

                    </Table.Cell>
                    <Table.Cell width="2">
                        <Checkbox
                            toggle
                            label=""
                            checked={category?.active === 1 ? true : false}
                            onChange={() => editCategory(category)}
                        />
                    </Table.Cell>
                </Table.Row>
            );
        });

        categoryJSX = (
            <Table celled stackable={false}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Title</Table.HeaderCell>
                        <Table.HeaderCell>Action</Table.HeaderCell>
                        <Table.HeaderCell>Is Live</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {categoryRows}
                </Table.Body>
                {
                    pageCount > 1 &&
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan="3">
                                <Pagination
                                    firstItem={null}
                                    lastItem={null}
                                    prevItem={null}
                                    nextItem={null}
                                    activePage={activePage}
                                    totalPages={pageCount}
                                    onPageChange={handlePageChange}
                                />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                }
            </Table>
        );

    } else {

        categoryJSX = (
            <Header size="large" textAlign="center">
                No Category has been created yet!
            </Header>
        );
    }

    return (
        <div className="padded-content">
            <>
                {
                    isLoading &&
                    <Loader size="large" active />
                }
                <Header size="huge" dividing>
                    Categories
                </Header>
                <Button
                    style={{ fontWeight: "normal" }}
                    size="small"
                    primary
                    as="span"
                    icon
                    labelPosition="right"
                    onClick={handleCategoryModal}
                >
                    Add New Category
                    <Icon name="plus" />
                </Button>
                {categoryJSX}
            </>
            {
                isEditConfirmation &&
                <Confirm
                    header='Confirmation is Required'
                    content='Are you sure to update this category'
                    cancelButton='No'
                    confirmButton="Yes, Do it."
                    open={isEditConfirmation}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                />
            }
            {
                isAddCategoryModal &&
                <AddBlogCategoryModal
                    isOpen={isAddCategoryModal}
                    toggle={hideCategoryModal}
                    activeCategory={activeCategory}
                    isSuccessAction={handleActionStatus}
                />
            }
        </div>
    );
}

export default BlogsCategories;