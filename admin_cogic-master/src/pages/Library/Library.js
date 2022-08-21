import React, { useState, useContext, useEffect } from "react";
import { Header, Button, Icon, Pagination, Loader, Table, Label, Confirm } from "semantic-ui-react";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";
import UploadLibDocumentsModal from "./UploadLibDocumentsModal/UploadLibDocumentsModal";
import { S3_BASE } from "../../utils/consts";
import { AuthContext } from "../../shared/context/auth-context";

const Library = () => {

    const auth = useContext(AuthContext);

    const [library, setLibrary] = useState(null);
    const [activePage, setActivePage] = useState(1);
    const [pageCount, setPageCount] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);
    const [isAddLibraryModal, setIsAddLibraryModal] = useState(false);
    const [activeLibrary, setActiveLibrary] = useState(null);

    useEffect(() => {
        loadLibrary();
    }, [activePage]);

    async function loadLibrary() {

        try {

            let offset = (activePage * 15) - 15;

            const { data } = await axios.get(
                `/admin/library/?type=all&limit=15&offset=${offset}`,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );

            setLibrary(data.library);
            setPageCount(Math.ceil(data.count / 15));
            setLoaded(true);
            setLoading(false)

        } catch (err) {
            console.log(err);
        }
    }
    const handlePageChange = (event, { activePage }) => setActivePage(activePage);

    const handleLibraryModal = () => {
        setIsAddLibraryModal(true)
    }
    const handleEditLibraryModal = (lib) => {
        setActiveLibrary(lib)
        handleLibraryModal();
    }
    const hideLibraryModal = () => {
        setIsAddLibraryModal(false)
        setActiveLibrary(null)
    }
    const handleConfirm = () => {
        setIsDeleteConfirmation(false);
        setLoading(true)
        deleteLibraryImageRequest();
    }
    const handleCancel = () => {
        setIsDeleteConfirmation(false)
        setActiveLibrary(null)
    }

    const handleDeleteLibraryImage = (image) => {
        setActiveLibrary(image)
        setIsDeleteConfirmation(true)
    }

    const deleteLibraryImageRequest = async () => {
        try {
            const { data } = await axios.delete(
                `/admin/del-library/${activeLibrary?.id}`,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );
            if (data && data.success) {
                toast.success("Library has been deleted successfully")
                loadLibrary();
            } else {
                toast.error("Something went wrong, try again later!");
                setLoading(false)
            }
            setActiveLibrary(null)
        } catch (err) {
            setLoading(false)
            setActiveLibrary(null)
        }
    }

    const handleActionStatus = () => {
        loadLibrary();
    }

    let libraryJSX = null;

    if (!loaded && !library) {

        libraryJSX = <Loader size="medium" active />;

    } else if (library.length > 0) {

        let libraryRows = library.map((lib, index) => {

            return (
                <Table.Row key={lib.id}>
                    <Table.Cell width="1">
                        {index + 1}
                    </Table.Cell>
                    <Table.Cell width="2">
                        <span style={{ fontWeight: "bold" }}>
                            {lib.title}
                        </span>
                    </Table.Cell>
                    <Table.Cell width="7">
                        <div
                            style={{ overflowWrap: "anywhere" }}
                            dangerouslySetInnerHTML={{ __html: lib.description }}
                        />
                    </Table.Cell>
                    <Table.Cell width="2">
                        <Button
                            title="Delete Library"
                            negative
                            circular
                            icon="trash"
                            onClick={() => handleDeleteLibraryImage(lib)}
                        />
                        <Button
                            title="Edit Library"
                            style={{ marginRight: "10px" }}
                            primary
                            circular
                            onClick={() => handleEditLibraryModal(lib)}
                            icon="edit"
                        />
                    </Table.Cell>
                </Table.Row>
            );
        });

        libraryJSX = (
            <Table celled stackable={false}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Index</Table.HeaderCell>
                        <Table.HeaderCell>Title</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Action</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {libraryRows}
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
        libraryJSX = (
            <Header size="medium" textAlign="center">
                Nothing has been added yet!
            </Header>
        )
    }

    return (
        <div className="padded-content">
            {
                isLoading &&
                <Loader size="large" active />
            }
            <Header size="huge" dividing>
                Library
            </Header>
            <Button
                style={{ fontWeight: "normal" }}
                size="small"
                primary
                as="span"
                icon
                labelPosition="right"
                onClick={handleLibraryModal}
            >
                Add
                <Icon name="plus" />
            </Button>
            {libraryJSX}
            {
                isDeleteConfirmation &&
                <Confirm
                    header='Confirmation is Required'
                    content='Are you sure to delete this library data'
                    cancelButton='No'
                    confirmButton="Yes, Delete it."
                    open={isDeleteConfirmation}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                />
            }
            {
                isAddLibraryModal &&
                <UploadLibDocumentsModal
                    isOpen={isAddLibraryModal}
                    activeLibrary={activeLibrary}
                    toggle={hideLibraryModal}
                    isSuccessAction={handleActionStatus}
                />
            }
        </div>
    );
}

export default Library;