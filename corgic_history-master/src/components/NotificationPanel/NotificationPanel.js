import React, { useContext } from "react";
import { Modal, Table, Header, Image, Button, Popup } from "semantic-ui-react";
import moment from "moment";

import { ThemeContext } from "../../shared/context/theme-context";
import FriendIcon from "../../assets/followers.svg";

const NotificationPanel = (props) => {

    const themeContext = useContext(ThemeContext);

    const {
        notifications,
        markAsRead
    } = props;

    let notificationRows = null;

    if (notifications.length > 0) {

        notificationRows = notifications.map(notification => {

            return (
                <Table.Row key={notification.id}>
                    <Table.Cell>
                        <Header as="h4" image>
                            <Image src={FriendIcon} rounded size="mini" />
                            <Header.Content as="a" href={notification.url} target="_blank">
                                {notification.body}
                                    <Header.Subheader>
                                    <Popup
                                        position="bottom left"
                                        size="tiny"
                                        content={moment(notification.created_at).format("Do MMMM YYYY, h:mm a")}
                                        trigger={<p className="FeedCard--meta--name--date">{moment(notification.created_at).fromNow()}</p>}
                                    />
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </Table.Cell>
                    <Table.Cell>
                        <Button onClick={() => markAsRead(notification.id)}>Mark as Read</Button>
                    </Table.Cell>
                </Table.Row>
            );
        });
    }

    return (
        <Modal
            onClose={() => themeContext.notificationModalControl(false)}
            closeIcon open={themeContext.notificationModalOpen}
            size="small"
            centered={false}
        >
            <Modal.Content>
                <Modal.Description>
                    <Header size="large">Notifications</Header>
                    {
                        notifications.length > 0 ?
                            <Table celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Notification</Table.HeaderCell>
                                        <Table.HeaderCell>Action</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {notificationRows}
                                </Table.Body>
                            </Table> : <Header>No Notifications to show!</Header>
                    }
                </Modal.Description>
            </Modal.Content>
        </Modal>
    );
}

export default NotificationPanel;