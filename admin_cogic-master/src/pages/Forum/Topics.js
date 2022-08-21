import React, { useState, useContext, useEffect } from "react";
import { Header, Button, Pagination, Loader, Table, Icon, Checkbox, Confirm } from "semantic-ui-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import AddNewTopicModal from "./ForumModals/AddNewTopicModal";
import { AuthContext } from "../../shared/context/auth-context";

const ForumTopics = () => {

    const auth = useContext(AuthContext);

    const [topics, setTopics] = useState(null);
    const [activePage, setActivePage] = useState(1);
    const [pageCount, setPageCount] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isEditConfirmation, setIsEditConfirmation] = useState(false);
    const [isAddTopicModal, setIsAddTopicModal] = useState(false);
    const [activeTopic, setActiveTopic] = useState(null);

    useEffect(() => {
        loadTopics();
    }, [activePage]);

    async function loadTopics() {
        let offset = (activePage * 15) - 15;
        const { data } = await axios.get(`/admin/get-forum-topics?limit=${15}&offset=${offset}`,
            {
                headers: {
                    Authorization: `Bearer ${auth.admin.token}`
                }
            }
        );
        if (data && data.success && data.successResponse && data.successResponse.length) {
            setTopics(data.successResponse);
            setPageCount(Math.floor(data.count / 15));
        }
        setLoaded(true);
        setLoading(false)
    }
    const handlePageChange = (event, { activePage }) => setActivePage(activePage);

    const handleTopicModal = () => {
        setIsAddTopicModal(true)
    }
    const hideTopicModal = () => {
        setIsAddTopicModal(false)
        setActiveTopic(null)
    }
    const handleEditTopic = (topic) => {
        setActiveTopic(topic)
        handleTopicModal()
    }
    const editTopic = (topic) => {
        setActiveTopic(topic)
        setIsEditConfirmation(true)
    }

    const handleConfirm = () => {
        setIsEditConfirmation(false);
        setLoading(true)
        UpdateTopicRequest();
    }
    const handleCancel = () => {
        setIsEditConfirmation(false)
        setActiveTopic(null)
    }

    const handleActionStatus = () => {
        loadTopics();
    }
    const UpdateTopicRequest = async () => {
        const payload = {
            active: activeTopic?.active === 1 ? 0 : 1
        }
        try {
            const { data } = await axios.patch(
                `/admin/update-forum-topic/${activeTopic?.id}`,
                payload,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );
            if (data.success) {
                toast.success("Topic has been updated successfully");
            } else {
                toast.error("Something went wrong Please try again.");
            }
            loadTopics();
            setActiveTopic(null);
        } catch (err) {
            setActiveTopic(null);
            setLoading(false)
            toast.error("Something went wrong Please try again.");
        }
    }

    let topicJSX = null;

    if (!loaded && !topics) {

        topicJSX = <Loader size="medium" active />;

    } else if (topics?.length > 0) {

        let topicRows = topics.map((topic, index) => {

            return (
                <Table.Row key={topic.id}>
                    <Table.Cell width="11">
                        <Header as="h4" image>
                            <Header.Content>
                                {topic?.topic_name}
                            </Header.Content>
                        </Header>
                    </Table.Cell>
                    <Table.Cell width="3">
                        <Button
                            title="Edit topic"
                            style={{ marginRight: "10px" }}
                            primary
                            circular
                            icon="edit"
                            size="tiny"
                            onClick={() => handleEditTopic(topic)}
                        />
                        <Button
                            title="See Related Questions"
                            primary
                            size="tiny"
                            as={Link}
                            to={`/forum-sections/?edit=true&topic_id=${topic?.id}`}
                        >
                            Sections
                        </Button>

                    </Table.Cell>
                    <Table.Cell width="2">
                        <Checkbox
                            toggle
                            label=""
                            checked={topic?.active === 1 ? true : false}
                            onChange={() => editTopic(topic)}
                        />
                    </Table.Cell>
                </Table.Row>
            );
        });

        topicJSX = (
            <Table celled stackable={false}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Title</Table.HeaderCell>
                        <Table.HeaderCell>Action</Table.HeaderCell>
                        <Table.HeaderCell>Is Live</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {topicRows}
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

        topicJSX = (
            <Header size="large" textAlign="center">
                No Topic has been created yet!
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
                    Topics
                </Header>
                <Button
                    style={{ fontWeight: "normal" }}
                    size="small"
                    primary
                    as="span"
                    icon
                    labelPosition="right"
                    onClick={handleTopicModal}
                >
                    Add New Topic
                    <Icon name="plus" />
                </Button>
                {topicJSX}
            </>
            {
                isEditConfirmation &&
                <Confirm
                    header='Confirmation is Required'
                    content='Are you sure to update this topic'
                    cancelButton='No'
                    confirmButton="Yes, Do it."
                    open={isEditConfirmation}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                />
            }
            {
                isAddTopicModal &&
                <AddNewTopicModal
                    isOpen={isAddTopicModal}
                    toggle={hideTopicModal}
                    activeTopic={activeTopic}
                    isSuccessAction={handleActionStatus}
                />
            }
        </div>
    );
}

export default ForumTopics;