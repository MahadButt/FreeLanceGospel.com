import React, { useState, useContext, useEffect } from "react";
import { Header, Button, Icon, Pagination, Loader, Table, Label, Confirm } from "semantic-ui-react";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";
import UploadVideosModal from "./UploadVideosModal/UploadVideosModal";

import { AuthContext } from "../../shared/context/auth-context";

const Video = (props) => {

    const auth = useContext(AuthContext);
    const [video, setVideo] = useState([]);
    const [isAddVideoModal, setIsAddVideoModal] = useState(false);
    const [activePage, setActivePage] = useState(1);
    const [pageCount, setPageCount] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);
    const [activeVideo, setActiveVideo] = useState(null);

    useEffect(() => {
        loadVideos();
    }, [activePage]);
    async function loadVideos() {
        try {
            let offset = (activePage * 15) - 15;

            const { data } = await axios.get(
                `/admin/videos/?limit=15&offset=${offset}`,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );
            if (data && data.success && data.videos && data.videos.length>0) {
                setVideo(data.videos);
                setPageCount(Math.ceil(data.count / 15));
            }else{
                setVideo([]);
                setPageCount(Math.ceil(data.count / 15));
            }
            setLoaded(true);
            setLoading(false)

        } catch (err) {
            console.log(err);
        }
    }
    const handlePageChange = (event, { activePage }) => setActivePage(activePage);

    let videosJSX = null;

    if (!loaded && !video) {

        videosJSX = <Loader size="medium" active />;

    } else if (video && video.length > 0) {

        let videoRows = video.map((vid, index) => {

            return (
                <Table.Row key={vid.id}>
                    <Table.Cell width="2">
                        {index + 1}
                    </Table.Cell>
                    <Table.Cell width="3">
                        <span style={{ fontWeight: "bold" }}>
                            {vid.title}
                        </span>
                    </Table.Cell>
                    <Table.Cell width="5">
                        <span style={{ fontWeight: "bold" }} title={vid.description}>
                            {vid.description.length > 30 ? `${vid.description.slice(0, 30)}......` : vid.description}
                        </span>
                    </Table.Cell>
                    <Table.Cell width="5">
                        <Button
                            title="Open Link in New Tab"
                            style={{ marginRight: "10px" }}
                            color="teal"
                            circular
                            as="a"
                            href={vid.video_url}
                            rel="noopener noreferrer"
                            target="_blank"
                            icon="external alternate"
                        />
                        <Button
                            title="Delete Video"
                            negative
                            circular
                            icon="trash"
                            onClick={() => handleDeleteVideo(vid)}
                        />
                    </Table.Cell>
                </Table.Row>
            );
        });

        videosJSX = (
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
                    {videoRows}
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
        videosJSX = (
            <Header size="medium" textAlign="center">
                No Video has been created yet!
            </Header>
        )
    }
    const handleVideoModal = () => {
        setIsAddVideoModal(true)
    }
    const hideVideosModal = () => {
        setIsAddVideoModal(false)
        setActiveVideo(null)
    }
    const handleConfirm = () => {
        setIsDeleteConfirmation(false);
        setLoading(true)
        deleteVideosRequest();
    }
    const handleCancel = () => {
        setIsDeleteConfirmation(false)
        setActiveVideo(null)
    }

    const handleDeleteVideo = (video) => {
        setActiveVideo(video)
        setIsDeleteConfirmation(true)
    }

    const deleteVideosRequest = async () => {
        try {
            const { data } = await axios.delete(
                `/admin/del-video/${activeVideo?.id}`,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );
            if (data && data.success) {
                toast.success("Video has been deleted successfully")
                loadVideos();
            } else {
                toast.error("Something went wrong, try again later!");
                setLoading(false)
            }
            setActiveVideo(null)
        } catch (err) {
            setLoading(false)
            setActiveVideo(null)
        }
    }

    const handleActionStatus = () => {
        loadVideos();
    }
    return (
        <div className="padded-content">
            <>
                {
                    isLoading &&
                    <Loader size="large" active />
                }
                <Header size="huge" dividing>
                    Videos
                </Header>
                <Button
                    style={{ fontWeight: "normal" }}
                    size="small"
                    primary
                    as="span"
                    icon
                    labelPosition="right"
                    onClick={handleVideoModal}
                >
                    Add Video
                    <Icon name="plus" />
                </Button>
                {videosJSX}
            </>
            {
                isDeleteConfirmation &&
                <Confirm
                    header='Confirmation is Required'
                    content='Are you sure to delete this video'
                    cancelButton='No'
                    confirmButton="Yes, Delete it."
                    open={isDeleteConfirmation}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                />
            }
            {
                isAddVideoModal &&
                <UploadVideosModal
                    isOpen={isAddVideoModal}
                    toggle={hideVideosModal}
                    isSuccessAction={handleActionStatus}
                />
            }
        </div>
    );
}

export default Video;