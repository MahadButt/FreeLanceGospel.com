import React, { useState, useContext, useEffect } from "react";
import { Header, Button, Pagination, Loader, Table, Icon, Checkbox, Confirm } from "semantic-ui-react";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";
import qs from "query-string";
import AddSectionModal from "./ForumModals/AddNewSectionModal";
import { AuthContext } from "../../shared/context/auth-context";

const ForumSections = (props) => {

    const auth = useContext(AuthContext);

    const topic_id = qs.parse(props.location.search).topic_id;
    const [sections, setSections] = useState(null);
    const [activePage, setActivePage] = useState(1);
    const [pageCount, setPageCount] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [topics, setTopics] = useState([]);
    const [isEditConfirmation, setIsEditConfirmation] = useState(false);
    const [isAddSectionModal, setIsAddSectionModal] = useState(false);
    const [activeSection, setActiveSection] = useState(null);

    useEffect(() => {
        loadSections();
        loadTopics();
    }, [topic_id, activePage]);

    async function loadSections() {
        let offset = (activePage * 15) - 15;
        let url = "";
        if (topic_id) {
            url = `/admin/get-forum-sections?limit=${15}&offset=${offset}&topic_id=${topic_id}`
        } else {
            url = `/admin/get-forum-sections?limit=${15}&offset=${offset}`
        }
        const { data } = await axios.get(`${url}`,
            {
                headers: {
                    Authorization: `Bearer ${auth.admin.token}`
                }
            }
        );
        if (data && data.success && data.successResponse && data.successResponse.length) {
            setSections(data.successResponse);
            setPageCount(Math.floor(data.count / 15));
        }
        setLoaded(true);
        setLoading(false)
    }

    async function loadTopics() {
        const { data } = await axios.get(`/admin/get-forum-topics`,
            {
                headers: {
                    Authorization: `Bearer ${auth.admin.token}`
                }
            }
        );
        if (data && data.success && data.successResponse && data.successResponse.length) {
            setTopics(data.successResponse);
        }
        setLoaded(true)
    }

    const handlePageChange = (event, { activePage }) => setActivePage(activePage);

    const handleSectionModal = () => {
        setIsAddSectionModal(true)
    }
    const hideSectionModal = () => {
        setIsAddSectionModal(false)
        setActiveSection(null)
    }
    const handleEditSection = (section) => {
        setActiveSection(section)
        handleSectionModal()
    }
    const editSection = (section) => {
        setActiveSection(section)
        setIsEditConfirmation(true)
    }

    const handleConfirm = () => {
        setIsEditConfirmation(false);
        setLoading(true)
        UpdateSectionRequest();
    }
    const handleCancel = () => {
        setIsEditConfirmation(false)
        setActiveSection(null)
    }

    const handleActionStatus = () => {
        loadSections();
    }
    const UpdateSectionRequest = async () => {
        const payload = {
            active: activeSection?.active === 1 ? 0 : 1
        }
        try {
            const { data } = await axios.patch(
                `/admin/update-forum-section/${activeSection?.id}`,
                payload,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );
            if (data.success) {
                toast.success("Section has been updated successfully");
            } else {
                toast.error("Something went wrong Please try again.");
            }
            loadSections();
            setActiveSection(null);
        } catch (err) {
            setActiveSection(null);
            setLoading(false)
            toast.error("Something went wrong Please try again.");
        }
    }

    let sectionJSX = null;

    if (!loaded && !sections) {

        sectionJSX = <Loader size="medium" active />;

    } else if (sections?.length > 0) {

        let sectionRows = sections.map((section, index) => {

            return (
                <Table.Row key={section.id}>
                    <Table.Cell width="11">
                        <Header as="h4" image>
                            <Header.Content>
                                {section?.section_name}
                            </Header.Content>
                        </Header>
                    </Table.Cell>
                    <Table.Cell width="3">
                        <Button
                            title="Edit section"
                            style={{ marginRight: "10px" }}
                            primary
                            circular
                            icon="edit"
                            size="tiny"
                            onClick={() => handleEditSection(section)}
                        />
                    </Table.Cell>
                    <Table.Cell width="2">
                        <Checkbox
                            toggle
                            label=""
                            checked={section?.active === 1 ? true : false}
                            onChange={() => editSection(section)}
                        />
                    </Table.Cell>
                </Table.Row>
            );
        });

        sectionJSX = (
            <Table celled stackable={false}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Title</Table.HeaderCell>
                        <Table.HeaderCell>Action</Table.HeaderCell>
                        <Table.HeaderCell>Is Live</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {sectionRows}
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

        sectionJSX = (
            <Header size="large" textAlign="center">
                No Section has been created yet!
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
                    Sections
                </Header>
                <Button
                    style={{ fontWeight: "normal" }}
                    size="small"
                    primary
                    as="span"
                    icon
                    labelPosition="right"
                    onClick={handleSectionModal}
                >
                    Add New Section
                    <Icon name="plus" />
                </Button>
                {sectionJSX}
            </>
            {
                isEditConfirmation &&
                <Confirm
                    header='Confirmation is Required'
                    content='Are you sure to update this section'
                    cancelButton='No'
                    confirmButton="Yes, Do it."
                    open={isEditConfirmation}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                />
            }
            {
                isAddSectionModal &&
                <AddSectionModal
                    isOpen={isAddSectionModal}
                    toggle={hideSectionModal}
                    topics={topics}
                    activeSection={activeSection}
                    activeTopicId={topic_id ? Number(topic_id) : null}
                    isSuccessAction={handleActionStatus}
                />
            }
        </div>
    );
}

export default ForumSections;