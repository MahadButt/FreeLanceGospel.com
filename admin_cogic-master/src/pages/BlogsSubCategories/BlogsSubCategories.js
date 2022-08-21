import React, { useState, useContext, useEffect } from "react";
import { Header, Button, Pagination, Loader, Table, Icon, Confirm, Checkbox } from "semantic-ui-react";
import { toast } from "react-toastify";
import qs from "query-string";
import axios from "../../utils/axiosInstance";
import AddBlogSubCategoriesModal from "./AddBlogSubCategoriesModal/AddBlogSubCategoriesModal";
import { AuthContext } from "../../shared/context/auth-context";

const BlogsSubCategories = (props) => {

    const category_id = qs.parse(props.location.search).category_id;
    const auth = useContext(AuthContext);
    const [activePage, setActivePage] = useState(1);
    const [pageCount, setPageCount] = useState(null);
    const [subCategories, setSubCategories] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmation, setIsEditConfirmation] = useState(false);
    const [isAddSubCategory, setIsAddSubCategory] = useState(false);
    const [activeSubCategory, setActiveSubCategory] = useState(null);

    useEffect(() => {
        loadSubCategory();
        loadCategories();
    }, [category_id, activePage]);

    async function loadSubCategory() {
        let offset = (activePage * 15) - 15;
        let url = "";
        if (category_id) {
            url = `/admin/get-blog-subcategory?type=${category_id}&limit=${15}&offset=${offset}`
        } else {
            url = `/admin/get-blog-subcategory?type=all&limit=${15}&offset=${offset}`
        }
        const { data } = await axios.get(`${url}`,
            {
                headers: {
                    Authorization: `Bearer ${auth.admin.token}`
                }
            }
        );
        if (data && data.success && data.successResponse && data.successResponse.length) {
            setSubCategories(data.successResponse);
            setPageCount(Math.floor(data.count / 15));
        } else {
            setSubCategories([])
        }
        setLoaded(true);
        setIsLoading(false)
    }

    async function loadCategories() {
        const { data } = await axios.get(`/admin/get-blog-categories`,
            {
                headers: {
                    Authorization: `Bearer ${auth.admin.token}`
                }
            }
        );
        if (data && data.success && data.successResponse && data.successResponse.length) {
            setCategories(data.successResponse);
        }
        setLoaded(true)
        setIsLoading(false)
    }

    const handlePageChange = (event, { activePage }) => setActivePage(activePage);

    const handleConfirm = () => {
        setIsLoading(true)
        setIsEditConfirmation(false)
        UpdateSubCategoryRequest()
    }
    const handleCancel = () => {
        setIsEditConfirmation(false)
        setActiveSubCategory(null)
    }

    const handleSubCategoryModal = () => {
        setIsAddSubCategory(true)
    }
    const hideSubCategoryModal = () => {
        setIsAddSubCategory(false)
        setActiveSubCategory(null)
    }
    const handleEditSubCategory = (subcategory) => {
        setActiveSubCategory(subcategory)
        handleSubCategoryModal()
    }
    const editSubCategory = (subCategory) => {
        setActiveSubCategory(subCategory)
        setIsEditConfirmation(true)
    }
    const handleActionStatus = () => {
        loadSubCategory();
    }

    const UpdateSubCategoryRequest = async () => {
        const payload = {
            active: activeSubCategory?.active === 1 ? 0 : 1
        }
        try {
            const { data } = await axios.patch(
                `/admin/update-blog-subcategory/${activeSubCategory?.id}`,
                payload,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );
            if (data.success) {
                toast.success("SubCategory has been updated successfully");
            } else {
                toast.error("Something went wrong Please try again.");
            }
            loadSubCategory();
            setActiveSubCategory(null);
        } catch (err) {
            setActiveSubCategory(null);
            setIsLoading(false)
            toast.error("Something went wrong Please try again.");
        }
    }

    let SubCategoryJSX = null;

    if (!loaded && !subCategories) {

        SubCategoryJSX = <Loader size="medium" active />;

    } else if (subCategories?.length > 0) {

        let SubCategoriesRows = subCategories.map((subCat, index) => {

            return (
                <Table.Row key={subCat?.id}>
                    <Table.Cell width="12">
                        <Header as="h4" image>
                            <Header.Content>
                                {subCat?.subcat_name}
                            </Header.Content>
                        </Header>
                    </Table.Cell>
                    <Table.Cell width="2">
                        <Button
                            title="Edit SubCategory"
                            style={{ marginRight: "10px" }}
                            primary
                            circular
                            icon="edit"
                            onClick={() => handleEditSubCategory(subCat)}
                        />
                    </Table.Cell>
                    <Table.Cell width="2">
                        <Checkbox
                            toggle
                            label=""
                            checked={subCat?.active === 1 ? true : false}
                            onChange={() => editSubCategory(subCat)}
                        />
                    </Table.Cell>
                </Table.Row>
            );
        });

        SubCategoryJSX = (
            <Table celled stackable={false}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Title</Table.HeaderCell>
                        <Table.HeaderCell>Action</Table.HeaderCell>
                        <Table.HeaderCell>Is Live</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {SubCategoriesRows}
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

        SubCategoryJSX = (
            <Header size="large" textAlign="center">
                No SubCategory have been created yet!
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
                    SubCategories
                </Header>
                <Button
                    style={{ fontWeight: "normal" }}
                    size="small"
                    primary
                    as="span"
                    icon
                    labelPosition="right"
                    onClick={handleSubCategoryModal}
                >
                    Add New SubCategory
                    <Icon name="plus" />
                </Button>
                {SubCategoryJSX}
            </>
            <Confirm
                header='Confirmation is Required'
                content='Are you sure to update this subCategory'
                cancelButton='No'
                confirmButton="Yes, Update it."
                open={isConfirmation}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
            {
                isAddSubCategory &&
                <AddBlogSubCategoriesModal
                    isOpen={isAddSubCategory}
                    toggle={hideSubCategoryModal}
                    categories={categories}
                    activeSubCategory={activeSubCategory}
                    isSuccessAction={handleActionStatus}
                />
            }
        </div>
    );
}

export default BlogsSubCategories;