import React from "react";
import { Table, Message, Header, Image, Popup, Button } from "semantic-ui-react";
import moment from "moment";

import { API_ROOT, friendReqStatus } from "../../utils/consts";

const FriendPendingList = (props) => {

    const { friends, respondFriendReq, reqButtonLoading } = props;

    let friendJSX = null;
    let errorJSX = null;

    if (friends.length > 0) {

        friendJSX = friends.map(({ friend }) => {

            return (
                <Table.Row key={friend.u_id}>
                    <Table.Cell>
                        <Header as="h4" image>
                            <Image src={API_ROOT + friend.avatar_url} rounded size="mini" />
                            <Header.Content as="a" href={`/profile/?u_id=${friend.u_id}`} target="_blank">
                                {`${friend.first_name} ${friend.last_name}`}
                                <Header.Subheader>
                                    <Popup
                                        position="bottom left"
                                        size="tiny"
                                        content={moment(friend.created_at).format("Do MMMM YYYY, h:mm a")}
                                        trigger={<p className="FeedCard--meta--name--date">{moment(friend.created_at).fromNow()}</p>}
                                    />
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </Table.Cell>
                    <Table.Cell>
                        <Button
                            disabled={reqButtonLoading}
                            type="button"
                            onClick={() => respondFriendReq(friendReqStatus.ACCEPTED, friend.u_id)}
                        >
                            Accept
                        </Button>
                        <Button
                            disabled={reqButtonLoading}
                            type="button"
                            negative
                            onClick={() => respondFriendReq(friendReqStatus.DECLINED, friend.u_id)}
                        >
                            Decline
                        </Button>
                    </Table.Cell>
                </Table.Row>
            );
        });

    } else {

        errorJSX = (
            <Message>
                <Message.Header>No requests found!</Message.Header>
                <p>You haven't received any new requests.</p>
            </Message>
        );
    }


    return (
        <div className="FriendPendingList">
            {
                errorJSX ? errorJSX :
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>User</Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {friendJSX}
                    </Table.Body>
                </Table>
            }
        </div>
    );
}

export default FriendPendingList;