import React, { useState, useContext, useEffect } from "react";
import { Header, Button, Pagination, Loader, Table, Icon, Checkbox, Confirm } from "semantic-ui-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import UploadImagesModal from "./UploadImagesModal/UploadImagesModal";
import { AuthContext } from "../../shared/context/auth-context";
import {API_ROOT} from "../../utils/consts";

const Gallery = () => {

    const auth = useContext(AuthContext);

    const [gallery, setGallery] = useState(null);
    const [activePage, setActivePage] = useState(1);
    const [pageCount, setPageCount] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);
    const [isAddGalleryModal, setIsAddGalleryModal] = useState(false);
    const [activeGallery, setActiveGallery] = useState(null);

    useEffect(() => {
        loadGallery();
    }, [activePage]);

    async function loadGallery() {
        let offset = (activePage * 15) - 15;
        const { data } = await axios.get(`admin/get-images?limit=${15}&offset=${offset}`,
            {
                headers: {
                    Authorization: `Bearer ${auth.admin.token}`
                }
            }
        );
        if (data && data.success && data.successResponse && data.successResponse.length) {
            setGallery(data.successResponse);
            setPageCount(Math.floor(data.count / 15));
        }
        setLoaded(true);
        setLoading(false)
    }
    const handlePageChange = (event, { activePage }) => setActivePage(activePage);

    const handleGalleryModal = () => {
        setIsAddGalleryModal(true)
    }
    const hideGalleryModal = () => {
        setIsAddGalleryModal(false)
        setActiveGallery(null)
    }
    const handleConfirm = () => {
        setIsDeleteConfirmation(false);
        setLoading(true)
        deleteGalleryImageRequest();
    }
    const handleCancel = () => {
        setIsDeleteConfirmation(false)
        setActiveGallery(null)
    }

    const handleDeleteGalleryImage = (image) => {
        setActiveGallery(image)
        setIsDeleteConfirmation(true)
    }

    const deleteGalleryImageRequest = async () => {
        try {
            const { data } = await axios.delete(
                `/admin/del-image/${activeGallery?.id}`,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );
            if (data && data.success) {
                toast.success("Gallery has been deleted successfully")
                loadGallery();
            } else {
                toast.error("Something went wrong, try again later!");
                setLoading(false)
            }
            setActiveGallery(null)
        } catch (err) {
            setLoading(false)
            setActiveGallery(null)
        }
    }

    const handleActionStatus = () => {
        loadGallery();
    }

    let galleryJSX = null;

    if (!loaded && !gallery) {

        galleryJSX = <Loader size="medium" active />;

    } else if (gallery?.length > 0) {

        let galleryRows = gallery.map((image, index) => {

            return (
                <Table.Row key={image.id}>
                    <Table.Cell width="13">
                        <Header as="h4" image>
                            <Header.Content>
                                <img
                                    src={`${API_ROOT}${image?.image_url}`}
                                    alt="gallery"
                                    style={{ width: "100px", height: "100px" }}
                                />
                            </Header.Content>
                        </Header>
                    </Table.Cell>
                    <Table.Cell width="3">
                        <Button
                            title="Delete Question"
                            negative
                            circular
                            icon="trash"
                            onClick={() => handleDeleteGalleryImage(image)}
                        />
                    </Table.Cell>
                </Table.Row>
            );
        });

        galleryJSX = (
            <Table celled stackable={false}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Image</Table.HeaderCell>
                        <Table.HeaderCell>Action</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {galleryRows}
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

        galleryJSX = (
            <Header size="large" textAlign="center">
                No Gallery has been created yet!
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
                    Gallery
                </Header>
                <Button
                    style={{ fontWeight: "normal" }}
                    size="small"
                    primary
                    as="span"
                    icon
                    labelPosition="right"
                    onClick={handleGalleryModal}
                >
                    Add New Images
                    <Icon name="plus" />
                </Button>
                {galleryJSX}
            </>
            {
                isDeleteConfirmation &&
                <Confirm
                    header='Confirmation is Required'
                    content='Are you sure to delete this gallery image'
                    cancelButton='No'
                    confirmButton="Yes, Delete it."
                    open={isDeleteConfirmation}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                />
            }
            {
                isAddGalleryModal &&
                <UploadImagesModal
                    isOpen={isAddGalleryModal}
                    toggle={hideGalleryModal}
                    isSuccessAction={handleActionStatus}
                />
            }
        </div>
    );
}

export default Gallery;