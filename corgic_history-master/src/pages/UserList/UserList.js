import React, { useState, useContext, useEffect } from "react";
import {
    Loader, Table, Header,
    Image, Popup, Button, Icon, Label,
    Container, Segment, Pagination, List
} from "semantic-ui-react";
import { Spinner, Row } from 'reactstrap'
import { Link } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import moment from "moment";
import "./UserList.scss";
import { Form, Formik } from "formik";
import BgAudio from '../../assets/audio/user-page.mp3'

import Footer from "../../components/Footer/Footer";

import { AuthContext } from "../../shared/context/auth-context";
import { API_ROOT } from "../../utils/consts";
import Users_Video from '../../assets/Users.mp4'

const UserList = (props) => {

    const auth = useContext(AuthContext);

    const [users, setUsers] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [denomination, setDenomination] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [searchUsers, setSearchUsers] = useState(null);
    const [activePage, setActivePage] = useState(0);
    const [pageCount, setPageCount] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [total, setTotal] = useState(null);
    // const [isLoad, setLoad] = useState(false);
    const [showLoader, setLoader] = useState(false);
    const initialValues = {
        denomination: "",
        country: "",
        city: "",
        search: ""
    };

    useEffect(() => {

        window.document.title = "Members List | The Church Book";

        async function loadUsers() {

            let offset = 0;

            // if (activePage !== 0 && activePage !== 1) {
            //     offset = activePage * 15;
            // }

            const { data } = await axios.get(
                `/user/user-search/?type=all&limit=10&offset=${offset}`,
                { headers: { Authorization: `Bearer ${auth.user.token}` } }
            );

            setUsers(data.users);
            setPageCount(Math.floor(data.count / 10));
            setTotal(data.count);
            setLoaded(true);
            // setTimeout(() => {
            //     setLoad(true)
            // }, 125)
        }

        loadUsers();

    }, [activePage]);

    const sendFriendRequest = async (values, fr) => {

        const { data } = await axios.post(
            "/user/send-friend-req",
            { friend_id: values.friend_id },
            { headers: { Authorization: `Bearer ${auth.user.token}` } }
        );

        if (data.addFriend) {

            const updatedUsers = [...users];

            updatedUsers[values.index].isPending = true;

            setUsers(updatedUsers);
            fr.setSubmitting(false);

        } else {
            fr.setSubmitting(false);
        }
    }
    const handleSearchLoadMore = () => {
        if ((searchUsers.length > 0) && (total > searchUsers.length)) {
            async function loadUsers() {
                const { data } = await axios.get(
                    `/user/user-search/?search_key=${searchValue !== "" ? searchValue : null}&denomination=${denomination !== "" ? denomination : null}&country=${country !== "" ? country : null}&city=${city !== "" ? city : null}&limit=10&offset=${searchUsers.length} `,
                    { headers: { Authorization: `Bearer ${auth.user.token} ` } }
                );
                setSearchUsers(searchUsers.concat(data.users));
                setPageCount(Math.floor(data.count / 10));
                setTotal(data.count);
                setLoaded(false);
            }
            loadUsers();
            setLoader(true)
        }
    }
    const handleLoadMore = () => {
        if ((users && users.length > 0) && (total > users.length)) {
            async function loadUsers() {
                const { data } = await axios.get(
                    `/user/user-search/?type=all&limit=10&offset=${users.length} `,
                    { headers: { Authorization: `Bearer ${auth.user.token} ` } }
                );
                setUsers(users.concat(data.users));
                setPageCount(Math.floor(data.count / 10));
                setTotal(data.count);
                setLoader(false)
            }
            loadUsers();
            setLoader(true)
        }
    }
    const handlePageChange = (event, { activePage }) => setActivePage(activePage);
    const handleSearch = async (values, fr) => {
        let offset = 0;
        const { data } = await axios.get(
            `/user/user-search/?search_key=${values.search !== "" ? values.search : null}&denomination=${values.denomination !== "" ? values.denomination : null}&country=${values.country !== "" ? values.country : null}&city=${values.city !== "" ? values.city : null}&limit=10&offset=${offset}`,
            { headers: { Authorization: `Bearer ${auth.user.token}` } }
        );
        setSearchValue(values.search)
        setDenomination(values.denomination)
        setCountry(values.country)
        setCity(values.city)
        setSearchUsers(data.users);
        setPageCount(Math.floor(data.count / 10));
        setTotal(data.count);
        setLoaded(false);
        setLoader(false)
    };
    let userJSX = null;

    // if (!loaded && !users) {

    //     userJSX = <Loader size="medium" active />;

    // } else
    let data = searchUsers ? (searchUsers.length > 0 ? searchUsers : []) : users;

    if (data) {
        let userRows = (data && data.length > 0) ? data.map((user, index) => {
            let user_name = user.first_name + " " + user.last_name;
            return (
                <List.Item key={user.u_id} className="user-item">
                    <List.Content className="mt-2" floated='right'>
                        {
                            user.isFriend ?
                                <Button
                                    icon
                                    className="friend"
                                    title={"Friend"}
                                    type="submit"
                                >
                                    <Icon name="user" />
                                    {/* {user.isPending ? "Request Sent" : "Add Friend"} */}
                                </Button> :
                                user.u_id === auth.user.u_id ?
                                    <Button as={Link} to={`/profile/?u_id=${auth.user.u_id}`}>Visit</Button> :
                                    <Formik
                                        initialValues={{ friend_id: user.u_id, index: index }}
                                        onSubmit={sendFriendRequest}
                                    >
                                        {(fr) => (
                                            <Form>
                                                <input name="friend_id"
                                                    hidden
                                                    value={fr.values.friend_id}
                                                    onBlur={fr.handleBlur}
                                                    onChange={fr.handleChange}
                                                />
                                                <input name="index"
                                                    hidden
                                                    value={fr.values.index}
                                                    onBlur={fr.handleBlur}
                                                    onChange={fr.handleChange}
                                                />
                                                <Button
                                                    loading={fr.isSubmitting}
                                                    disabled={fr.isSubmitting || user.isPending}
                                                    icon
                                                    className="add-friend"
                                                    title={user.isPending ? "Request Sent" : "Add Friend"}
                                                    type="submit"
                                                >
                                                    <Icon name="add user" />
                                                    {/* {user.isPending ? "Request Sent" : "Add Friend"} */}
                                                </Button>
                                            </Form>
                                        )}
                                    </Formik>
                        }
                    </List.Content>
                    <Image className="avatar" avatar src={API_ROOT + user.avatar_url} />
                    <List.Content as={Link} to={`/profile/?u_id=${user.u_id}`}>
                        <List.Header className="user-title" title={user_name} as='a'>{user_name.length > 14 ? user_name.split(" ")[0] : user_name}</List.Header>
                        <List.Description className="user-description">
                            <Popup
                                position="bottom left"
                                size="tiny"
                                content={moment(user.created_at).format("Do MMMM YYYY, h:mm a")}
                                trigger={<p className="FeedCard--meta--name--date">{moment(user.created_at).fromNow()}</p>}
                            />
                        </List.Description>
                    </List.Content>
                </List.Item>
                // <Table.Row key={user.u_id}>
                //     <Table.Cell>
                //         <Header as="h4" image>
                //             <Image src={API_ROOT + user.avatar_url} rounded size="mini" />
                //             <Header.Content as={Link} to={`/profile/?u_id=${user.u_id}`}>
                //                 {user.first_name} {user.last_name}
                //                 <Header.Subheader>
                //                     <Popup
                //                         position="bottom left"
                //                         size="tiny"
                //                         content={moment(user.created_at).format("Do MMMM YYYY, h:mm a")}
                //                         trigger={<p className="FeedCard--meta--name--date">{moment(user.created_at).fromNow()}</p>}
                //                     />
                //                 </Header.Subheader>
                //             </Header.Content>
                //         </Header>
                //     </Table.Cell>
                //     <Table.Cell>
                //         {
                //             user.isFriend ?
                //                 <Label color="blue">Friends</Label> :
                //                 user.u_id === auth.user.u_id ?
                //                     <Button as={Link} to={`/profile/?u_id=${auth.user.u_id}`}>Go to profile</Button> :
                //                     <Formik
                //                         initialValues={{ friend_id: user.u_id, index: index }}
                //                         onSubmit={sendFriendRequest}
                //                     >
                //                         {(fr) => (
                //                             <Form>
                //                                 <input name="friend_id"
                //                                     hidden
                //                                     value={fr.values.friend_id}
                //                                     onBlur={fr.handleBlur}
                //                                     onChange={fr.handleChange}
                //                                 />
                //                                 <input name="index"
                //                                     hidden
                //                                     value={fr.values.index}
                //                                     onBlur={fr.handleBlur}
                //                                     onChange={fr.handleChange}
                //                                 />
                //                                 <Button
                //                                     loading={fr.isSubmitting}
                //                                     disabled={fr.isSubmitting || user.isPending}
                //                                     icon
                //                                     labelPosition="left"
                //                                     type="submit"
                //                                 >
                //                                     <Icon name="add user" />
                //                                     {user.isPending ? "Request Sent" : "Add Friend"}
                //                                 </Button>
                //                             </Form>
                //                         )}
                //                     </Formik>
                //         }
                //     </Table.Cell>
                // </Table.Row>
            );
        }) : null;

        userJSX = (
            <div className="userList-content-wrapper">
                <div className="user-list-wrapper">
                    <List>

                        <Formik
                            initialValues={initialValues}
                            onSubmit={handleSearch}
                        >
                            {(fr) => (
                                <Form>
                                    <div className="row mr-0 px-4">
                                        <div className="col-lg-2 col-md-4 col-12 m-2 form-container search-box">
                                            {/* <label className="mb-0 searchIcon" onClick={() => handleSearch(fr.values, null)}>
                                            <Icon name="search" size="large" />
                                        </label> */}
                                            <input type="text"
                                                name="denomination"
                                                className="denomination"
                                                placeholder="Denomination"
                                                value={fr.values.denomination}
                                                onChange={fr.handleChange} />
                                        </div>
                                        <div className="col-lg-2 col-md-4 col-12 m-2 form-container search-box">
                                            <input type="text"
                                                name="country"
                                                className="country"
                                                placeholder="Country"
                                                value={fr.values.country}
                                                onChange={fr.handleChange} />
                                        </div>
                                        <div className="col-lg-2 col-md-3 col-12 m-2 form-container search-box">
                                            <input type="text"
                                                name="city"
                                                className="city"
                                                placeholder="City"
                                                value={fr.values.city}
                                                onChange={fr.handleChange} />
                                        </div>
                                        <div className="col-lg-4 col-md-9 col-12 m-2 form-container search-box">
                                            <input type="text"
                                                name="search"
                                                className="search"
                                                placeholder="Search"
                                                value={fr.values.search}
                                                onChange={fr.handleChange} />
                                        </div>
                                        <div className="col-lg-1 col-md-2 col-12 my-2 p-0 text-right">
                                            <Button
                                                loading={fr.isSubmitting}
                                                disabled={fr.isSubmitting || (fr.values.denomination == '' && fr.values.country == '' &&
                                                    fr.values.city == '' && fr.values.search == '')}
                                                icon
                                                title={"Search"}
                                                type="submit"
                                                className="search-btn"
                                            >
                                                <Icon name="search" size="large" />
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        {userRows ? userRows :
                            <>
                                <List.Item className="user-item">
                                    <List.Content className="mt-2 text-center">
                                        <List.Header className="user-title">User not found</List.Header>
                                    </List.Content>
                                </List.Item>
                                <Row className="load-more-container">
                                    <div className="load-more-btn" onClick={() => props.history.go(0)}>
                                        {
                                            showLoader ?
                                                <>
                                                    Load All
                                                    <Spinner
                                                        color="seconday"
                                                        className="ml-3"
                                                        style={{ width: '22px', height: '22px' }}
                                                    />
                                                </>
                                                :
                                                'Load All'
                                        }
                                    </div>
                                </Row>
                            </>}
                    </List>
                    <Row className="load-more-container">
                        {(total > data.length) &&
                            <div className="load-more-btn" onClick={searchUsers && searchUsers.length > 0 ? handleSearchLoadMore : handleLoadMore}>
                                {
                                    showLoader ?
                                        <>
                                            Load More
                                            <Spinner
                                                color="seconday"
                                                className="ml-3"
                                                style={{ width: '22px', height: '22px' }}
                                            />
                                        </>
                                        :
                                        'Load More'
                                }
                            </div>
                        }
                    </Row>

                </div>
            </div>
            // <Table celled stackable={false}>
            //     <Table.Header>
            //         <Table.Row>
            //             <Table.HeaderCell>User</Table.HeaderCell>
            //             <Table.HeaderCell>Action</Table.HeaderCell>
            //         </Table.Row>
            //     </Table.Header>

            //     <Table.Body>
            //         {userRows}
            //     </Table.Body>

            //     {
            //         pageCount > 1 &&
            //         <Table.Footer>
            //             <Table.Row>
            //                 <Table.HeaderCell colSpan="3">
            //                     <Pagination
            //                         firstItem={null}
            //                         lastItem={null}
            //                         prevItem={null}
            //                         nextItem={null}
            //                         activePage={activePage}
            //                         totalPages={pageCount}
            //                         onPageChange={handlePageChange}
            //                     />
            //                 </Table.HeaderCell>
            //             </Table.Row>
            //         </Table.Footer>
            //     }
            // </Table>
        );
    }

    return (
        <div className="userlist_container">
            <div className="video-banner-container">
                <video muted autoPlay loop>
                    <source src={Users_Video} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            {
                (!loaded && !users) ? <Loader size="huge" active /> :
                    <>
                        <audio autoPlay hidden>
                            <source src={BgAudio} type="audio/mpeg" />
                        </audio>
                        <Container className="boot-container p-0">
                            {/* <div className={`title-btn-wrapper ${isLoad && 'loaded'}`}> */}
                            <div className={`title-btn-wrapper`}>
                                <div className="header-title">Members List</div>
                                <div className="custom-border"></div>
                            </div>
                            {userJSX}
                        </Container>
                        <Footer />
                    </>
            }
        </div>
    );
}

export default UserList;