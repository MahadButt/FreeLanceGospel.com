import React from "react";
import { Header, Grid, Segment, Button, Icon, Image, Label, Tab } from "semantic-ui-react";
import { Form, Formik } from "formik";
import moment from "moment";
import Books from './Books'
import Movies from './Movies'
import Musics from './Musics'
import { friendReqStatus, maritalStatus } from "../../utils/consts";

import "./ProfileInfo.scss";

import CakeIcon from "../../assets/birthday-cake.svg";
import ChurchIcon from "../../assets/church.svg";

const ProfileInfo = (props) => {

    let profileAction = null;

    let maritalText = "Not Set";

    if (props.user.marital_status) {
        maritalText = props.user.marital_status === maritalStatus.UNMARRIED ? "Unmarried" : "Married";
    }
    let panes = [
        {
            menuItem: { key: "info", icon: "info", content: "Basic Info" },
            render: () => (
                <Tab.Pane attached={false}>
                    <Grid.Column>
                        <Segment>
                            <Header size="medium">
                                <Icon name="user outline" />
                                Personal Information
                            </Header>
                            <div className="ProfileInfo--info--container" style={{ marginTop: "20px" }}>

                                <div className="ProfileInfo--info--container--info">
                                    <Image src={ChurchIcon} />
                                    <p>
                                        Church Denomination: <span>{props.user.denomination}</span>
                                    </p>
                                </div>

                                <div className="ProfileInfo--info--container--info">
                                    <Image src={CakeIcon} />
                                    <p>
                                        BirthDay: <span>{props.user.date_of_birth ? moment(props.user.date_of_birth).format("Do MMMM") : "Not Set"}</span>
                                    </p>
                                </div>

                                {/* <div className="ProfileInfo--info--container--info">
                                    <Image src={RingIcon} />
                                    <p>
                                        Marital Status: <span>{maritalText}</span>
                                    </p>
                                </div> */}
                            </div>
                        </Segment>

                    </Grid.Column>

                    <Grid.Column>
                        <Segment>
                            <Header size="medium">
                                <Icon name="address book outline" />
                                Basic Information
                            </Header>
                            <div className="ProfileInfo--info--container">

                                <div className="ProfileInfo--info--container--info">
                                    <p>
                                        {/* Age: <span>{props?.user?.age ?? 'Not Set'}</span> */}
                                        Country: <span>{props?.user?.country?.country_name ?? 'Not Set'}</span>
                                    </p>
                                </div>

                                <div className="ProfileInfo--info--container--info">
                                    <p>
                                        Ethnicity <span>{props?.user?.ethnicity ?? "Not Set"}</span>
                                    </p>
                                </div>

                            </div>
                        </Segment>
                    </Grid.Column>

                    <Grid.Column>
                        <Segment>
                            <Header size="medium">
                                <Icon name="address book outline" />
                                Contact Information
                            </Header>
                            <div className="ProfileInfo--info--container">

                                <div className="ProfileInfo--info--container--info">
                                    <p>
                                        Email: <span>{props.user.email}</span>
                                    </p>
                                </div>

                                {/* <div className="ProfileInfo--info--container--info">
                                    <p>
                                        Address: <span>{props.user.address ? props.user.address : "Not Set"}</span>
                                    </p>
                                </div> */}

                                <div className="ProfileInfo--info--container--info">
                                    <p>
                                        Contact No: <span>{props.user.contact_no ? props.user.contact_no : "Not Set"}</span>
                                    </p>
                                </div>

                                <div className="ProfileInfo--info--container--info">
                                    <p>
                                        State/Region: <span>{props?.user?.region ?? "Not Set"}</span>
                                    </p>
                                </div>

                            </div>
                        </Segment>
                    </Grid.Column>

                    <Grid.Column>
                        <Segment>
                            <Header size="medium">
                                <Icon name="graduation cap" />
                                Education Information
                            </Header>
                            <div className="ProfileInfo--info--container">

                                <div className="ProfileInfo--info--container--info">
                                    <p>
                                        Education: <span>{props?.user?.education ?? 'Not Set'}</span>
                                    </p>
                                </div>

                            </div>
                        </Segment>
                    </Grid.Column>

                    <Grid.Column>
                        <Segment>
                            <Header size="medium">
                                <Icon name="info" />
                                Extra Information
                            </Header>
                            <div className="ProfileInfo--info--container">

                                <div className="ProfileInfo--info--container--info">
                                    <p>
                                        Relationship Status: {" "}
                                        <span>
                                            {
                                                props?.user?.marital_status === 1 ?
                                                    'Single'
                                                    : props?.user?.marital_status === 2 ?
                                                        'Married'
                                                        : props?.user?.marital_status === 3 ?
                                                            'Dating'
                                                            : ''
                                            }
                                        </span>
                                    </p>
                                </div>

                                <div className="ProfileInfo--info--container--info">
                                    <p>
                                        Sign: <span>{props?.user?.sign ?? 'Not Set'}</span>
                                    </p>
                                </div>

                                <div className="ProfileInfo--info--container--info">
                                    <p>
                                        Hobbies: <span>{props?.user?.hobbies ?? 'Not Set'}</span>
                                    </p>
                                </div>

                            </div>
                        </Segment>
                    </Grid.Column>

                </Tab.Pane>
            ),
        },
        {
            menuItem: { key: "books", icon: "book", content: "Books" },
            render: () => (
                <Tab.Pane attached={false}>
                    <Books isOwnProfile={props.isOwnProfile} />
                </Tab.Pane>
            ),
        },
        {
            menuItem: { key: "movies", icon: "film", content: "Movies" },
            render: () => (
                <Tab.Pane attached={false}>
                    <Movies isOwnProfile={props.isOwnProfile} />
                </Tab.Pane>
            ),
        },
        {
            menuItem: { key: "musics", icon: "music", content: "Musics" },
            render: () => (
                <Tab.Pane attached={false}>
                    <Musics isOwnProfile={props.isOwnProfile} />
                </Tab.Pane>
            ),
        }
    ];

    if (!props.isOwnProfile) {

        profileAction = (
            <div className="ProfileInfo--action">
                {
                    props.friendData.friendStatus === friendReqStatus.ACCEPTED ? <Label color="blue">Friends</Label> :
                        <Formik
                            initialValues={{ friend_id: props.u_id }}
                            onSubmit={(values, fr) => props.sendFriendRequest(fr.setSubmitting)}
                        >
                            {(fr) => (
                                <Form>
                                    <input name="friend_id"
                                        hidden
                                        value={fr.values.friend_id}
                                        onBlur={fr.handleBlur}
                                        onChange={fr.handleChange}
                                    />
                                    <Button loading={fr.isSubmitting} disabled={fr.isSubmitting || props.friendData.friendStatus === friendReqStatus.PENDING || props.friendData.friendStatus === friendReqStatus.SENDER} icon labelPosition="left" type="submit">
                                        <Icon name="add user" />
                                        {!props.friendData.isFriend ? "Add Friend" : props.friendData.friendStatus === friendReqStatus.PENDING ? "Pending Request" : props.friendData.friendStatus === friendReqStatus.SENDER ? "Pending Request" : null}
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                }
            </div>
        );
    }
    return (
        <div className="ProfileInfo">
            {profileAction}
            <div className="ProfileInfo--info">
                <div className="row">
                    <div className="col-12">
                        <Tab
                            menu={{
                                fluid: true, pointing: true, className: "wrapped"
                            }}
                            menuPosition="left"
                            panes={panes}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileInfo;