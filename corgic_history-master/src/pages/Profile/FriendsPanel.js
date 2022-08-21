import React, { useState, useEffect, Fragment, useContext } from "react";
import { Header, Loader, Tab } from "semantic-ui-react";
import axios from "../../utils/axiosInstance";

import FriendsList from "./FriendsList";
import FriendPendingList from "./FriendPendingList";

import { AuthContext } from "../../shared/context/auth-context";
import { friendReqStatus } from "../../utils/consts";

import "./FriendsPanel.scss";

const FriendsPanel = (props) => {

    const auth = useContext(AuthContext);

    const [friends, setFriends] = useState([]);
    const [reqButtonLoading, setReqButtonLoading] = useState(false);
    const [updatePass, setUpdatePass] = useState(0);
    const [pendings, setPendings] = useState([]);
    const [friendsOfFriends, setFriendsOfFriends] = useState([]);

    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {

        async function fetchFriends() {

            let url = '';
            if (props && !props.isOwnProfile && props.userId) {
                url = `/user/friends?u_id=${props.userId}`
            } else {
                url = `/user/friends`
            }

            const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${auth.user.token}` } });

            const accepted = [];
            const pending = [];
            const allFriends = [];
            if (data && data.length) {
                data.forEach(friend => {

                    if (props && !props.isOwnProfile && props.userId) {
                        allFriends.push(friend)
                    } else {
                        if (friend.status === friendReqStatus.ACCEPTED) {
                            accepted.push(friend);
                        } else if (friend.status === friendReqStatus.PENDING) {
                            pending.push(friend);
                        }
                    }
                });
            }

            setFriendsOfFriends(allFriends)
            setFriends(accepted);
            setPendings(pending);
            setPageLoaded(true);
        }
        fetchFriends();

    }, [updatePass]);

    const respondFriendReq = async (response, friend_id) => {
        setReqButtonLoading(true);
        try {
            await axios.patch("/user/respond-friend-req", { response, friend_id }, { headers: { Authorization: `Bearer ${auth.user.token}` } });

            setReqButtonLoading(false);
            setUpdatePass(updatePass + 1);

        } catch (err) {
            setReqButtonLoading(false);
        }
    }

    const panes = [
        {
            menuItem: "Friends",
            render: () => <Tab.Pane attached={false}><FriendsList friends={friends} /></Tab.Pane>,
        },
        {
            menuItem: "Pending Requests",
            render: () => <Tab.Pane attached={false}>
                <FriendPendingList
                    reqButtonLoading={reqButtonLoading}
                    respondFriendReq={respondFriendReq}
                    friends={pendings}
                />
            </Tab.Pane>,
        }
    ];

    const friendsTab = (
        <Fragment>
            {
                props?.userId && !props.isOwnProfile && props.userDetails && friendsOfFriends?.length ?
                    <>
                        <Header as="h2" className="mb-4">
                            Friends List
                            <Header.Subheader>
                                {props.userDetails?.first_name} {props.userDetails?.last_name} has {friendsOfFriends.length} friends.
                            </Header.Subheader>
                        </Header>
                        <FriendsList friends={friendsOfFriends} />
                    </>
                    :
                    <>
                        <div className="FriendsPanel--title">
                            <Header as="h2">
                                Friends List
                                <Header.Subheader>
                                    Manage your friends from here
                                </Header.Subheader>
                            </Header>
                        </div>
                        <Tab
                            menu={{ secondary: true, pointing: true, fluid: true }}
                            panes={panes}
                            defaultActiveIndex={props.sub_target === "pending" ? 1 : 0}
                        />
                    </>
            }
        </Fragment>
    );

    return (
        <div className="FriendsPanel profile-padded">
            {!pageLoaded ? <Loader active /> : friendsTab}
        </div>
    );
}

export default FriendsPanel;