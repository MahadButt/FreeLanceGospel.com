import React, { useState, useContext, useEffect } from "react";
import { Header, Button, Pagination, Loader, Table, Popup } from "semantic-ui-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import moment from "moment";

import { AuthContext } from "../../shared/context/auth-context";

const Blogs = () => {

    const auth = useContext(AuthContext);

    const [blogs, setBlogs] = useState(null);
    const [activePage, setActivePage] = useState(1);
    const [pageCount, setPageCount] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {

        async function loadBlogs() {
            let offset = (activePage * 15) - 15;
            const { data } = await axios.get(`/blog/get-blogs/50/?offset=${offset}`);

            setBlogs(data.blogs);
            setPageCount(Math.floor(data.count / 15));
            setLoaded(true);
        }

        loadBlogs();

    }, [activePage]);

    const handlePageChange = (event, { activePage }) => setActivePage(activePage);

    const deleteBlog = async (id) => {

        setIsDeleting(true);

        try {

            const { data } = await axios.delete(
                `/admin/blog/${id}`,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );

            if (data) {
                window.location.reload();
            } else {
                toast.error("Something went wrong, try again later!");
            }

            setIsDeleting(false);
            
        } catch (err) {
            console.log(err.response)
        }
    }

    let blogJSX = null;

    if (!loaded && !blogs) {

        blogJSX = <Loader size="medium" active />;

    } else if (blogs.length > 0) {

        let blogRows = blogs.map((blog, index) => {

            return (
                <Table.Row key={blog.id}>
                    <Table.Cell width="12">
                        <Header as="h4" image>
                            <Header.Content as="a" target="_blank" href={`/`}>
                                {blog.title}
                                <Header.Subheader>
                                    <Popup
                                        position="bottom left"
                                        size="tiny"
                                        content={moment(blog.created_at).format("Do MMMM YYYY, h:mm a")}
                                        trigger={
                                            <p>
                                                Created {moment(blog.created_at).fromNow()}
                                            </p>
                                        }
                                    />
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </Table.Cell>
                    <Table.Cell width="4">
                        {/* <Button 
                            title="Edit Blog" 
                            style={{ marginRight: "10px" }}
                            as={Link} 
                            to={`/new-blog/?edit=true&id=${blog.id}`} 
                            primary 
                            circular 
                            icon="edit" 
                        /> */}
                        <Button 
                            title="Delete Blog" 
                            negative 
                            circular 
                            icon="trash" 
                            onClick={() => deleteBlog(blog.id)}
                            loading={isDeleting}
                            disabled={isDeleting}
                        />
                    </Table.Cell>
                </Table.Row>
            );
        });

        blogJSX = (
            <Table celled stackable={false}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Title</Table.HeaderCell>
                        <Table.HeaderCell>Action</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {blogRows}
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

        blogJSX = (
            <Header size="large" textAlign="center">
                No stories have been created yet!
            </Header>
        );
    }

    return (
        <div className="padded-content">
            <Header size="huge" dividing>
                Blogs
            </Header>
            {blogJSX}
        </div>
    );
}

export default Blogs;