import React, { useState, useEffect, Fragment } from "react";
import { Header, Label, Button, Table, Modal, Pagination, Loader } from "semantic-ui-react";
import axios from "../../utils/axiosInstance";
import moment from "moment";

import { msgStatus } from "../../utils/consts";

const ContactMsg = (props) => {

    const MSG_LIMIT = 15;

    const { token } = props;

    const [msgs, setMsgs] = useState(null);
    const [msgType, setMsgType] = useState(msgStatus.UNREAD);
    const [contactType, setContactType] = useState("contact");
    const [selectedMsg, setSelectedMsg] = useState(null);
    const [msgModalOpen, setMsgModalOpen] = useState(false);
    const [msgLoaded, setMsgLoaded] = useState(false);

    const [activePage, setActivePage] = useState(1);
    const [pageCount, setPageCount] = useState(null);

    useEffect(() => {

        loadMessages();

    }, [msgType, activePage, contactType]);

    async function loadMessages() {
        try {
            let offset = (activePage * MSG_LIMIT) - MSG_LIMIT;
            const { data } = await axios.get(
                `/admin/contact/?status=${msgType}&type=${contactType}&limit=${MSG_LIMIT}&offset=${offset}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data && data.success && data.successResponse && data.successResponse.length > 0) {
                setMsgs(data.successResponse);
                setPageCount(Math.round(data.count / MSG_LIMIT));
            } else {
                setMsgs([])
                setPageCount(null);
            }
            setMsgLoaded(true);
        } catch (err) {
            console.log(err);
        }
    }

    const handlePageChange = (event, { activePage }) => {
        setActivePage(activePage);
    }

    const openMessage = async (index) => {

        try {

            setSelectedMsg(msgs[index]);
            setMsgModalOpen(true);
            loadMessages();

            const result = await axios.patch(
                `/admin/contact-status/${msgs[index].id}`,
                { status: msgStatus.READ },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (result) {

                const updatedMsgs = [...msgs];
                updatedMsgs[index].status = msgStatus.READ;

                setMsgs(updatedMsgs);
            }

        } catch (err) {
            console.log(err);
        }
    }

    const handleCloseModal = () => {
        setSelectedMsg(null);
        setMsgModalOpen(false);
    }

    return (
        <>
            {
                !msgs ? <Loader active inline size="large" /> :
                    <div className="ContactMsg">
                        {
                            selectedMsg &&
                            <Modal open={msgModalOpen} onClose={handleCloseModal}>
                                <Modal.Header>
                                    {selectedMsg.name} ({selectedMsg.email})
                                </Modal.Header>

                                <Modal.Content>
                                    <Modal.Description>
                                        <p
                                            style={{
                                                fontSize: "18px",
                                                lineHeight: "1.7"
                                            }}
                                        >
                                            {selectedMsg.message}
                                        </p>
                                    </Modal.Description>
                                </Modal.Content>

                                <Modal.Actions>
                                    <span className="util-bold">
                                        Received: {moment(selectedMsg.created_at).fromNow()}
                                    </span>
                                </Modal.Actions>
                            </Modal>
                        }
                        <Header size="huge" dividing>
                            Messages
                        </Header>
                        <div className="d-flex justify-content-center">

                            <Button.Group>
                                <Button  {...(contactType == "contact") && { active: true }} onClick={() => setContactType("contact")}>Messages</Button>
                                <Button.Or />
                                <Button {...(contactType == "feedback") && { active: true }} onClick={() => setContactType("feedback")}>Feedback</Button>
                            </Button.Group>
                            <Button.Group style={{ marginBottom: "20px" }} floated="right">
                                <Button {...(msgType == msgStatus.UNREAD) && { active: true }} onClick={() => setMsgType(msgStatus.UNREAD)}>Unread</Button>
                                <Button.Or />
                                <Button {...(msgType == msgStatus.READ) && { active: true }} onClick={() => setMsgType(msgStatus.READ)}>Read</Button>
                            </Button.Group>
                        </div>
                        <div>
                            <Table celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Date Submission</Table.HeaderCell>
                                        <Table.HeaderCell>Name</Table.HeaderCell>
                                        <Table.HeaderCell>Email</Table.HeaderCell>
                                        <Table.HeaderCell>Status</Table.HeaderCell>
                                        <Table.HeaderCell>Action</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                {!msgLoaded ? <Loader size="medium" active /> :
                                    <Table.Body>
                                        {
                                            msgs.length > 0 ?
                                                msgs.map((msg, index) => (
                                                    <Table.Row key={msg.id}>
                                                        <Table.Cell>{moment(msg.created_at).local().format('YYYY-MM-DD HH:mm')}</Table.Cell>
                                                        <Table.Cell>{msg.name}</Table.Cell>
                                                        <Table.Cell>{msg.email}</Table.Cell>
                                                        <Table.Cell>
                                                            {
                                                                msg.status === msgStatus.UNREAD ?
                                                                    <Label color="red">Unread</Label> :
                                                                    <Label color="green">Read</Label>
                                                            }
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <Button
                                                                primary
                                                                compact
                                                                onClick={() => openMessage(index)}
                                                            >
                                                                Open
                                                            </Button>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                )) :
                                                <Table.Row>
                                                    <Table.Cell>
                                                        No Unread Messages!
                                                    </Table.Cell>
                                                </Table.Row>
                                        }
                                    </Table.Body>
                                }
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
                        </div>
                    </div>
            }
        </>
    );
}

export default ContactMsg;