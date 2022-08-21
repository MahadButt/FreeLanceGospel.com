import React, { useState, useContext, useEffect } from "react";
import { Header, Button, Icon, Pagination, Loader, Table, Image, Popup } from "semantic-ui-react";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import moment from "moment";

import { AuthContext } from "../../shared/context/auth-context";
import { API_ROOT, userStatus } from "../../utils/consts";

import "./Users.scss";

const Users = () => {

    const auth = useContext(AuthContext);

    const [users, setUsers] = useState(null);
    const [activePage, setActivePage] = useState(1);
    const [pageCount, setPageCount] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {

        async function loadUsers() {
            let offset = (activePage * 15) - 15;

            const { data } = await axios.get(
                `/admin/users/?type=all&limit=15&offset=${offset}`, 
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );

            setUsers(data.users);
            setPageCount(Math.floor(data.count / 15));
            setLoaded(true);
        }

        loadUsers();

    }, [activePage]);

    const handlePageChange = (event, { activePage }) => setActivePage(activePage);

    const changeUserStatus = async (values, fr) => {
        
        try {

            const { data } = await axios.patch(
                `/admin/user-status/${values.u_id}`,
                { status: values.status },
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );

            if (data.success) {

                const updatedUsers = [...users];

                const foundIndex = updatedUsers.findIndex(user => user.u_id === values.u_id);

                updatedUsers[foundIndex].status = values.status;
                setUsers(updatedUsers);

                toast.success("User status updated!");
                fr.setSubmitting(false);
            } else {
                toast.error("User status updated failed!");
                fr.setSubmitting(false);
            }

        } catch (err) {
            console.log(err);
        }
    }

    let userJSX = null;

    if (!loaded && !users) {

        userJSX = <Loader size="medium" active />;

    } else if (users.length > 0) {

        let userRows = users.map((user, index) => {

            return (
                <Table.Row key={user.u_id}>
                    <Table.Cell>
                        <Header as="h4" image>
                            <Image src={API_ROOT + user.avatar_url} rounded size="mini" />
                            <Header.Content as={Link} to={`/profile/?u_id=${user.u_id}`}>
                                {user.first_name} {user.last_name}
                                <Header.Subheader>
                                    <Popup
                                        position="bottom left"
                                        size="tiny"
                                        content={moment(user.created_at).format("Do MMMM YYYY, h:mm a")}
                                        trigger={
                                            <p className="FeedCard--meta--name--date">
                                                {moment(user.created_at).fromNow()}
                                            </p>
                                        }
                                    />
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </Table.Cell>
                    <Table.Cell>
                        {
                            <Formik
                                enableReinitialize
                                initialValues={{ 
                                    status: 
                                        user.status === userStatus.ACTIVE || 
                                        user.status === userStatus.PENDING ?
                                        userStatus.DISABLED : userStatus.ACTIVE, 
                                    u_id: user.u_id 
                                }}
                                onSubmit={changeUserStatus}
                            >
                                {(fr) => (
                                    <Form>
                                        {
                                            user.status === userStatus.ACTIVE || 
                                            user.status === userStatus.PENDING ?
                                            <Button 
                                                negative
                                                style={{ fontWeight: "normal" }} 
                                                loading={fr.isSubmitting} 
                                                disabled={fr.isSubmitting} 
                                                icon 
                                                labelPosition="right" 
                                                type="submit"
                                            >
                                                <Icon name="ban" />
                                                Ban User
                                            </Button> :
                                            <Button 
                                                positive
                                                style={{ fontWeight: "normal" }} 
                                                loading={fr.isSubmitting} 
                                                disabled={fr.isSubmitting} 
                                                icon 
                                                labelPosition="right" 
                                                type="submit"
                                            >
                                                <Icon name="redo" />
                                                Activate User
                                            </Button>
                                        }
                                    </Form>
                                )}
                            </Formik>
                        }
                    </Table.Cell>
                </Table.Row>
            );
        });

        userJSX = (
            <Table celled stackable={false}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>User</Table.HeaderCell>
                        <Table.HeaderCell>Action</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {userRows}
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
    }

    return (
        <div className="Users">
            <Header size="huge" dividing>
                Users
            </Header>
            {userJSX}
        </div>
    );
}

export default Users;