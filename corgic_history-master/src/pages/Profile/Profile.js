import React, { useState, useContext, useEffect, Fragment } from "react";
import styles from "./style.module.css";
import {
    Tab,
    Container,
    Message,
    Loader,
    Segment,
    Grid,
    Header,
    Input,
    Icon,
    Button,
    Radio
} from "semantic-ui-react";
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import * as yup from "yup";
import {
    Carousel,
    CarouselItem,
    CarouselControl
} from 'reactstrap';
import moment from "moment";
import { DateInput } from "semantic-ui-calendar-react";
import { Form, Formik } from "formik";
import { toast } from "react-toastify";
import { AuthContext } from "../../shared/context/auth-context";
import qs from "query-string";
import axios from "../../utils/axiosInstance";

import { friendReqStatus, API_ROOT } from "../../utils/consts";

import ProfileInfo from "./ProfileInfo";
import ProfileSettings from "./ProfileSettings";
import ChaptersPanel from "./ChaptersPanel";
import UserStories from "./UserStories";
import FriendsPanel from "./FriendsPanel";
import PhotosPanel from "./PhotosPanel";
// import AdminActions from "./AdminActions";
import Footer from "../../components/Footer/NewFooter/NewFooter";
import AvatarImagesModal from './AvatarImagesModal'
import "./Profile.scss";

const Profile = (props) => {
    const auth = useContext(AuthContext);
    const u_id = qs.parse(props.location.search).u_id;
    const target = qs.parse(props.location.search).target;
    const sub_target = qs.parse(props.location.search).sub_target;

    const [isExtraPanel, setExtraPanel] = useState(false);
    const [userSettings, setUserSettings] = useState(null);
    const [selectedPage, setPage] = useState(null);
    const [sliderImgs, setSliderImages] = useState(null);
    const [avatarImagesData, setAvatarImagesData] = useState([]);
    const [friendData, setFriendData] = useState(null);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [chapters, setChapters] = useState([]);
    const [isAvatarImagesModal, setAvatarImagesModal] = useState(false);
    const [isUpdateProfile, setUpdateProfile] = useState(false);
    const toggleExtraPanel = () => setExtraPanel(prevState => !prevState);

    useEffect(() => {
        let mySound;
        window.document.title = "Profile | The Church Book";

        async function fetchUser() {
            if (u_id) {
                const [userData, friendData] = await Promise.all([
                    axios.get(`/user/get-user/${u_id}`, {
                        headers: { Authorization: `Bearer ${auth.user.token}` },
                    }),
                    axios.get(`/user/check-friend/${u_id}`, {
                        headers: { Authorization: `Bearer ${auth.user.token}` },
                    }),
                ]);
                if (userData.data.userDefaultMusic && userData.data.user.u_id) {
                    mySound = new Audio(`${API_ROOT}${userData.data.userDefaultMusic.file_path}`);
                    mySound.play()
                }

                setFriendData(friendData.data);
                setUserSettings(userData.data);
                setPageLoaded(true);
            }
        }

        fetchUser();
        return () => {
            if(mySound){
                mySound.pause();
                mySound.currentTime = 0;
            }
            // Anything in here is fired on component unmount.
        }
    }, [auth.user.token, props.location.search]);

    useEffect(() => {
        fetchChapters()
    }, [])
    async function fetchChapters() {
        if (auth && auth.user && auth.user.token) {
            const { data } = await axios.get("/chapter/get-chapters", {
                headers: {
                    'Authorization': `Bearer ${auth.user.token}`
                }
            });
            if (data && data.successResponse && data.successResponse.length > 0) {
                setChapters(data.successResponse);
            }
        }
    }
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const schema = yup.object().shape({
        email: yup.string().email("Invalid Email").required("Email is required!"),
        denomination: yup.string().min(2, "Minimum 2 characters").required("Church denomination is required!"),
        date_of_birth: yup.date().required("Date of Birth is required!"),
        contact_no: yup.string().matches(phoneRegExp, 'Contact no is not valid'),
    });
    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === sliderImgs.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    }

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? sliderImgs.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    }

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    }
    const slides = sliderImgs && sliderImgs.map((item) => {
        return (
            <CarouselItem
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={item.id}
            >
                <div className="box-wrapper">
                    <div className="left-box">
                        <div className="image-preview">
                            <img src={API_ROOT + item.image_url} alt="image" onClick={() => getSliderImages("header")} />
                        </div>
                    </div>
                </div>
            </CarouselItem>
        );
    });
    const sendFriendRequest = async (setSubmitting) => {
        const { data } = await axios.post(
            "/user/send-friend-req",
            { friend_id: u_id },
            { headers: { Authorization: `Bearer ${auth.user.token}` } }
        );

        if (data.addFriend) {
            const updateFriendData = { ...friendData };

            updateFriendData.isFriend = true;
            updateFriendData.friendStatus = friendReqStatus.PENDING;

            setFriendData(updateFriendData);
            setSubmitting(false);
        } else {
            setSubmitting(false);
        }
    };
    const handleSubmit = async (values, fr) => {
        const { data } = await axios.patch(`/user/patch-basic/${auth.user.u_id}`, values, { headers: { Authorization: `Bearer ${auth.user.token}` } });

        if (data.update) {
            window.location.href = `/profile/?u_id=${auth.user.u_id}&target=info`;
        } else {
            fr.setSubmitting(false);
            toast.error(data.msg);
        }
    }
    const handleEditProfile = async () => {
        setUpdateProfile(!isUpdateProfile)
    }
    const getSliderImages = async (imageType) => {
        if (imageType == "header") {
            const [sliderData] = await Promise.all([
                axios.get(`/user/get-images/${u_id}?header=true`, {
                    headers: { Authorization: `Bearer ${auth.user.token}` },
                })
            ]);
            setSliderImages(sliderData.data.successResponse);
            setPageLoaded(true);
        } else if (imageType == "profile") {
            const [sliderData] = await Promise.all([
                axios.get(`/user/get-images/${u_id}?profile=true`, {
                    headers: { Authorization: `Bearer ${auth.user.token}` },
                })
            ]);
            setAvatarImagesData(sliderData.data.successResponse);
            setPageLoaded(true);
        }
    };
    const handleAvatarImagesModal = () => {
        setAvatarImagesModal(!isAvatarImagesModal)
    }
    let authPanes = [
        {
            menuItem: { key: "friends", icon: "users", content: "Friends" },
            render: () => (
                <Tab.Pane attached={false}>
                    <FriendsPanel sub_target={sub_target} />
                </Tab.Pane>
            ),
        },
        {
            menuItem: { key: "photos", icon: "photo", content: "Photos" },
            render: () => (
                <Tab.Pane attached={false}>
                    <PhotosPanel />
                </Tab.Pane>
            ),
        },
        {
            menuItem: {
                key: "more", style: { "padding": 4 }, content: (
                    <Dropdown isOpen={isExtraPanel} toggle={toggleExtraPanel} className="custom-dropdown-class">
                        <DropdownToggle>
                            <div activeClassName="active-link">
                                <div className="link-item">
                                    <Icon className="icon" name="caret down" size="small" />
                                    <div className="label">More</div>
                                </div>
                            </div>
                        </DropdownToggle>
                        <DropdownMenu className="drop-down-menu">
                            <div className="drop-down-item-wrapper">
                                <div className="link-item py-2" onClick={() => { return setPage("stories"), toggleExtraPanel() }}>
                                    <Icon className="dropdown-icon" name="book" size="small" />
                                    <div className="dropdown-label2">Stories</div>
                                </div>
                                <div className="link-item py-2" onClick={() => { return setPage("chapters"), toggleExtraPanel() }}>
                                    <Icon className="dropdown-icon" name="book" size="small" />
                                    <div className="dropdown-label2">Chapters</div>
                                </div>
                                <div className="link-item py-2" onClick={() => { return setPage("settings"), toggleExtraPanel() }}>
                                    <Icon className="dropdown-icon" name="settings" size="small" />
                                    <div className="dropdown-label2">Update Profile</div>
                                </div>
                            </div>
                        </DropdownMenu>
                    </Dropdown>
                )
            },
            render: () => (
                selectedPage === "chapters" ? <Tab.Pane attached={false}>
                    {pageLoaded ? (
                        <ChaptersPanel chapters={chapters} fetchChapters={fetchChapters} />
                    ) : null}
                </Tab.Pane> : selectedPage === "settings" ? <Tab.Pane attached={false}>
                    {pageLoaded && userSettings.user ? (
                        <ProfileSettings user={userSettings.user} />
                    ) : null}
                </Tab.Pane> : (!selectedPage || selectedPage === "stories") && <Tab.Pane attached={false}>
                    <UserStories />
                </Tab.Pane>
            )
        },
    ];

    let panes = [
        {
            menuItem: { key: "info", icon: "info", content: "About" },
            render: () => (
                <Tab.Pane loading={!pageLoaded} attached={false}>
                    {pageLoaded && userSettings.user ? (
                        <ProfileInfo
                            u_id={u_id}
                            user={userSettings.user}
                            sendFriendRequest={sendFriendRequest}
                            isOwnProfile={userSettings.isOwnProfile}
                            friendData={friendData}
                        />
                    ) : null}
                </Tab.Pane>
            ),
        },
    ];

    let noAuthPan = [
        {
            menuItem: { key: "friends", icon: "users", content: "Friends" },
            render: () => (
                <Tab.Pane attached={false}>
                    <FriendsPanel
                        isOwnProfile={false}
                        userId={u_id}
                        userDetails={userSettings?.user ?? null}
                    />
                </Tab.Pane>
            ),
        },
        {
            menuItem: { key: "photos", icon: "photo", content: "Photos" },
            render: () => (
                <Tab.Pane attached={false}>
                    <PhotosPanel
                        isOwnProfile={false}
                        userId={u_id}
                        userDetails={userSettings?.user ?? null}
                    />
                </Tab.Pane>
            ),
        },
    ];

    if (pageLoaded && userSettings.isOwnProfile) {
        let panesArr = [...panes];
        // panesArr.splice(panesArr.length - 1, 0, ...panes);
        panes = [...panesArr, ...authPanes];
    } else {
        let panesArr = [...panes];
        // panesArr.splice(panesArr.length - 1, 0, ...panes);
        panes = [...panesArr, ...noAuthPan];
    }

    // if (auth.isAdmin) {
    //     panes.push({
    //         menuItem: { key: "shield", icon: "shield", content: "Actions" },
    //         render: () => (
    //             <Tab.Pane attached={false}>
    //                 <AdminActions u_id={u_id} token={auth.user.token} />
    //             </Tab.Pane>
    //         ),
    //     });
    // }

    return (
        <div className="Profile">
            {pageLoaded && userSettings ? (
                <Fragment>
                    <Container>
                        {userSettings.user ? (
                            <Fragment>
                                <Segment className={styles.mainHeader}>
                                    <div className="Profile--basic-info">
                                        <Grid
                                            columns="equal"
                                            verticalAlign="middle"
                                            stackable
                                        >
                                            <Grid.Column>
                                                <Header as="h3">
                                                    {!userSettings.user
                                                        .avatar_url ? null : (
                                                        <div>
                                                            <div
                                                                className={
                                                                    styles.profileImg
                                                                }
                                                            >
                                                                {!sliderImgs ?
                                                                    <img
                                                                        src={
                                                                            API_ROOT +
                                                                            userSettings
                                                                                .user
                                                                                .header_image_url
                                                                        }
                                                                        onClick={() => getSliderImages("header")}
                                                                        alt=""
                                                                    /> : <Carousel
                                                                        activeIndex={activeIndex}
                                                                        next={next}
                                                                        previous={previous}
                                                                        interval={false}
                                                                    >
                                                                        {/* <CarouselIndicators items={sliderImgs} activeIndex={activeIndex} onClickHandler={goToIndex} /> */}
                                                                        {slides}
                                                                        <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
                                                                        <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
                                                                    </Carousel>
                                                                }
                                                            </div>
                                                            <div
                                                                className={
                                                                    styles.coverImg
                                                                }
                                                                onClick={() => {
                                                                    getSliderImages("profile")
                                                                    handleAvatarImagesModal()
                                                                }}
                                                            >
                                                                <img
                                                                    src={
                                                                        API_ROOT +
                                                                        userSettings
                                                                            .user
                                                                            .avatar_url
                                                                    }
                                                                    alt=""
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {/*<Header.Content>
                                                        {userSettings.user
                                                            .church_title +
                                                            " " +
                                                            userSettings.user
                                                                .first_name +
                                                            " " +
                                                            userSettings.user
                                                                .last_name}
                                                        {userSettings.user
                                                            .country && (
                                                            <Header.Subheader>
                                                                {userSettings
                                                                    .user
                                                                    .country
                                                                    .country_name +
                                                                    " "}
                                                                <Flag
                                                                    name={userSettings.user.country.country_code.toLowerCase()}
                                                                />
                                                            </Header.Subheader>
                                                        )}
                                                    </Header.Content>*/}
                                                </Header>
                                            </Grid.Column>
                                            {/*<Grid.Column
                                                textAlign="right"
                                                only="computer"
                                            >
                                                <Header
                                                    size="medium"
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "flex-end",
                                                    }}
                                                >
                                                    <Image
                                                        verticalAlign="middle"
                                                        size="medium"
                                                        src={ConfettiImg}
                                                    />
                                                    Member Since:{" "}
                                                    {moment(
                                                        userSettings.user
                                                            .created_at
                                                    ).format("Do MMMM YYYY")}
                                                </Header>
                                            </Grid.Column>*/}
                                        </Grid>
                                    </div>
                                </Segment>
                                <div className="row">
                                    <div className="col-lg-4 col-12">
                                        <Formik
                                            initialValues={{
                                                denomination: userSettings.user.denomination,
                                                date_of_birth: userSettings.user.date_of_birth ? moment(userSettings.user.date_of_birth).format("YYYY-MM-DD") : "",
                                                email: userSettings.user.email,
                                                contact_no: userSettings.user.contact_no ? userSettings.user.contact_no : "",
                                                region: userSettings?.user?.region ?? "",
                                                sign: userSettings?.user?.sign ?? "",
                                                marital_status: userSettings?.user?.marital_status ?? 1,
                                            }}
                                            validationSchema={schema}
                                            onSubmit={handleSubmit}
                                        >
                                            {(fr) => (
                                                <Form>
                                                    <Segment>
                                                        <Header size="small" className="d-flex justify-content-between">
                                                            <div>
                                                                <Icon name="user outline" />
                                                                {userSettings.user.first_name +
                                                                    " " +
                                                                    userSettings.user.last_name}
                                                            </div>
                                                            {(!isUpdateProfile && userSettings.isOwnProfile) && <Button onClick={() => { handleEditProfile() }}>Edit</Button>}
                                                            {isUpdateProfile && <Button onClick={() => { handleEditProfile() }}>Cancel</Button>}
                                                        </Header>
                                                        <Segment>
                                                            {!isUpdateProfile ?
                                                                <>
                                                                    <div className="ProfileInfo--info--container--info">
                                                                        {/*<Image src={ChurchIcon} />*/}
                                                                        <p>
                                                                            Church Denomination:{" "}
                                                                            <span>
                                                                                {userSettings.user.denomination}
                                                                            </span>
                                                                        </p>
                                                                    </div>
                                                                    <div className="ProfileInfo--info--container--info">
                                                                        {/*<Image src={ChurchIcon} />*/}
                                                                        <p>
                                                                            Birthday:{" "}
                                                                            <span>
                                                                                {userSettings.user.date_of_birth ? moment(userSettings.user.date_of_birth).format("Do MMMM") : "Not Set"}
                                                                            </span>
                                                                        </p>
                                                                    </div>
                                                                    <div className="ProfileInfo--info--container--info">
                                                                        <p>
                                                                            Email: <span>{userSettings.user.email}</span>
                                                                        </p>
                                                                    </div>

                                                                    <div className="ProfileInfo--info--container--info">
                                                                        <p>
                                                                            Contact No: <span>{userSettings.user.contact_no ? userSettings.user.contact_no : "Not Set"}</span>
                                                                        </p>
                                                                    </div>
                                                                    {/* <div className="ProfileInfo--info--container--info">
                                                                        <Image src={ChurchIcon} />
                                                                        <p>
                                                                            Marital Status:{" "}
                                                                            <span>
                                                                                Marital
                                                                            </span>
                                                                        </p>
                                                                    </div> */}
                                                                </>
                                                                :
                                                                <div className="row">
                                                                    <div className="col-12">
                                                                        <div className="row">
                                                                            <div className="col-12">
                                                                                <div className="input-field">
                                                                                    <label className="field-label">Church Denomination</label>
                                                                                    <Input
                                                                                        name="denomination"
                                                                                        fluid placeholder="Enter your church denomination"
                                                                                        type="text"
                                                                                        value={fr.values.denomination}
                                                                                        onBlur={fr.handleBlur}
                                                                                        onChange={fr.handleChange}
                                                                                    />
                                                                                    <p className="field-error">
                                                                                        {fr.errors.denomination && fr.touched.denomination && fr.errors.denomination}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-12">
                                                                                <div className="input-field">
                                                                                    <label className="field-label">Birthday</label>
                                                                                    <DateInput
                                                                                        fluid
                                                                                        placeholder="Date of Birth"
                                                                                        dateFormat="YYYY-MM-DD"
                                                                                        value={fr.values.date_of_birth ? moment(fr.values.date_of_birth).format("YYYY-MM-DD") : ""}
                                                                                        iconPosition="left"
                                                                                        onChange={(event, { name, value }) => fr.setFieldValue("date_of_birth", value)}
                                                                                    />
                                                                                    <p className="field-error">
                                                                                        {fr.errors.date_of_birth && fr.touched.date_of_birth && fr.errors.date_of_birth}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-12">
                                                                                <div className="input-field">
                                                                                    <label className="field-label">Email</label>
                                                                                    <Input
                                                                                        fluid name="email"
                                                                                        value={fr.values.email}
                                                                                        onBlur={fr.handleBlur}
                                                                                        onChange={fr.handleChange}
                                                                                        placeholder="Enter your email"
                                                                                        type="email"
                                                                                    />
                                                                                    <p className="field-error">
                                                                                        {fr.errors.email && fr.touched.email && fr.errors.email}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-12">
                                                                                <div className="input-field">
                                                                                    <label className="field-label">Contact No</label>
                                                                                    <Input
                                                                                        name="contact_no"
                                                                                        fluid placeholder="Enter your contact no."
                                                                                        type="number"
                                                                                        value={fr.values.contact_no}
                                                                                        onBlur={fr.handleBlur}
                                                                                        onChange={fr.handleChange}
                                                                                    />
                                                                                    <p className="field-error">
                                                                                        {fr.errors.contact_no && fr.touched.contact_no && fr.errors.contact_no}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-12">
                                                                                <div className="input-field">
                                                                                    <label className="field-label">State/Region</label>
                                                                                    <Input
                                                                                        name="region"
                                                                                        fluid placeholder="Enter your State/Region"
                                                                                        type="text"
                                                                                        value={fr.values.region}
                                                                                        onBlur={fr.handleBlur}
                                                                                        onChange={fr.handleChange}
                                                                                    />
                                                                                    <p className="field-error">
                                                                                        {fr.errors.region && fr.touched.region && fr.errors.region}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-12">
                                                                                <div className="input-field">
                                                                                    <label className="field-label">Sign</label>
                                                                                    <Input
                                                                                        name="sign"
                                                                                        fluid placeholder="Enter Sign"
                                                                                        type="text"
                                                                                        value={fr.values.sign}
                                                                                        onBlur={fr.handleBlur}
                                                                                        onChange={fr.handleChange}
                                                                                    />
                                                                                    <p className="field-error">
                                                                                        {fr.errors.sign && fr.touched.sign && fr.errors.sign}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-12">
                                                                                <div className="input-field">
                                                                                    <div className="field-label mb-2">Relationship Status</div>
                                                                                    <div className="accounts-input-radio">
                                                                                            <Radio
                                                                                                label="Single"
                                                                                                name="marital_status"
                                                                                                onChange={(event, { name, value }) => fr.setFieldValue("marital_status", value)}
                                                                                                value="1" // 1 for single
                                                                                                checked={`${fr.values.marital_status}` === "1"}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="accounts-input-radio">
                                                                                            <Radio
                                                                                                label="Married"
                                                                                                name="marital_status"
                                                                                                onChange={(event, { name, value }) => fr.setFieldValue("marital_status", value)}
                                                                                                value="2" // 2 for married
                                                                                                checked={`${fr.values.marital_status}` === "2"}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="accounts-input-radio">
                                                                                            <Radio
                                                                                                label="Dating"
                                                                                                name="marital_status"
                                                                                                onChange={(event, { name, value }) => fr.setFieldValue("marital_status", value)}
                                                                                                value="3" // 1 for dating
                                                                                                checked={`${fr.values.marital_status}` === "3"}
                                                                                            />
                                                                                        </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {isUpdateProfile &&
                                                                            <div className="submit-btn">
                                                                                <Button primary type="submit" loading={fr.isSubmitting}
                                                                                    disabled={fr.isSubmitting}>SAVE</Button>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            }
                                                        </Segment>
                                                    </Segment>
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                    <div className="col-lg-8 col-12 mb-4">
                                        <Tab
                                            menu={{
                                                pointing: true, className: "wrapped"
                                            }}
                                            menuPosition="left"
                                            panes={panes}
                                            defaultActiveIndex={
                                                target === "friend"
                                                    ? 1
                                                    : 0
                                            }
                                        />
                                    </div>
                                </div>
                            </Fragment>
                        ) : (
                            <Message size="large" negative>
                                <Message.Header>No user found!</Message.Header>
                                <p>
                                    The user you're looking for doesn't exist!
                                </p>
                            </Message>
                        )}
                    </Container>
                    <Footer />
                </Fragment>
            ) : (
                <Loader active size="massive" />
            )}
            {
                isAvatarImagesModal && avatarImagesData && avatarImagesData.length > 0 &&
                <AvatarImagesModal
                    toggle={handleAvatarImagesModal}
                    isOpen={isAvatarImagesModal}
                    data={avatarImagesData}
                />
            }
        </div>
    );
};

export default Profile;
