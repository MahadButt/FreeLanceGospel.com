import React, { useState, useContext, useEffect } from "react";
import { Header, Button, Pagination, Loader, Table, Icon, Checkbox, Confirm } from "semantic-ui-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { AuthContext } from "../../shared/context/auth-context";

const ForumPosts = () => {

    const auth = useContext(AuthContext);

    const [posts, setPosts] = useState(null);
    const [activePage, setActivePage] = useState(1);
    const [pageCount, setPageCount] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isEditConfirmation, setIsEditConfirmation] = useState(false);
    const [activePost, setActivePost] = useState(null);

    useEffect(() => {
        loadPosts();
    }, [activePage]);

    async function loadPosts() {
        let offset = (activePage * 15) - 15;
        const { data } = await axios.get(`/admin/get-forum-posts?limit=${15}&offset=${offset}`,
            {
                headers: {
                    Authorization: `Bearer ${auth.admin.token}`
                }
            }
        );
        if (data && data.success && data.successResponse && data.successResponse.length) {
            setPosts(data.successResponse);
            setPageCount(Math.floor(data.count / 15));
        }
        setLoaded(true);
        setLoading(false)
    }
    const handlePageChange = (event, { activePage }) => setActivePage(activePage);

    const editPost = (post) => {
        setActivePost(post)
        setIsEditConfirmation(true)
    }

    const handleConfirm = () => {
        setIsEditConfirmation(false);
        setLoading(true)
        UpdatePostRequest();
    }
    const handleCancel = () => {
        setIsEditConfirmation(false)
        setActivePost(null)
    }

    const UpdatePostRequest = async () => {
        const payload = {
            active: activePost?.active === 1 ? 0 : 1
        }
        try {
            const { data } = await axios.patch(
                `/admin/update-forum-post/${activePost?.id}`,
                payload,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );
            if (data.success) {
                toast.success("Category has been updated successfully");
            } else {
                toast.error("Something went wrong Please try again.");
            }
            loadPosts();
            setActivePost(null);
        } catch (err) {
            setActivePost(null);
            setLoading(false)
            toast.error("Something went wrong Please try again.");
        }
    }

    let categoryJSX = null;

    if (!loaded && !posts) {

        categoryJSX = <Loader size="medium" active />;

    } else if (posts?.length > 0) {

        let postRows = posts.map((post, index) => {

            return (
                <Table.Row key={post.id}>
                    <Table.Cell width="10">
                        <Header as="h4" image>
                            <Header.Content>
                                {post?.title}
                            </Header.Content>
                        </Header>
                    </Table.Cell>
                    <Table.Cell width="4">
                        {
                            post?.section?.section_name
                        }
                    </Table.Cell>
                    <Table.Cell width="2">
                        <Checkbox
                            toggle
                            label=""
                            checked={post?.active === 1 ? true : false}
                            onChange={() => editPost(post)}
                        />
                    </Table.Cell>
                </Table.Row>
            );
        });

        categoryJSX = (
            <Table celled stackable={false}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Post Title</Table.HeaderCell>
                        <Table.HeaderCell>Section Title</Table.HeaderCell>
                        <Table.HeaderCell>Is Live</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {postRows}
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
                No Post has been created yet!
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
                    Posts
                </Header>
                {categoryJSX}
            </>
            {
                isEditConfirmation &&
                <Confirm
                    header='Confirmation is Required'
                    content='Are you sure to update this Post'
                    cancelButton='No'
                    confirmButton="Yes, Do it."
                    open={isEditConfirmation}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                />
            }
        </div>
    );
}

export default ForumPosts;