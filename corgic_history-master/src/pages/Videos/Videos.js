import React, { useEffect, useState, useRef } from 'react';
import { Col, Container, Row } from 'reactstrap';
import moment from 'moment';
import axios from "../../utils/axiosInstance";
import { API_ROOT } from '../../utils/consts';
import './Videos.scss';

const GospelVideos = (props) => {

    const [videosList, setVideosList] = useState([])
    const [selectedVideo, setSelectedVideo] = useState(null)
    const vidRef = useRef(null)

    useEffect(() => {
        fetchVideos();
    }, [])

    const fetchVideos = async () => {
        try {
            const { data } = await axios.get(`/user/get-all-videos`);
            if (data && data.success && data.successResponse && data.successResponse.length) {
                setVideosList(data.successResponse)
                setSelectedVideo(data.successResponse[0])
            } else {
                setVideosList([])
            }
        } catch (err) {
            setVideosList([])
        }
    }

    const fetchVideoById = async (id) => {
        try {
            const { data } = await axios.get(`/user/video/${id}`);
            if (data && data.success && data.successResponse) {
                setSelectedVideo(data?.successResponse)
                vidRef.current.src = data?.successResponse?.video_url;
                vidRef.current.load()
                vidRef.current.play()
            }
        } catch (err) {
        }
    }

    const handleSelectVideo = (item) => {
        if (item.id !== selectedVideo.id) {
            fetchVideoById(item?.id)
        }
    }

    return (
        <div className="gospel-videos-wrapper">
            <Container>
                <Row>
                    <Col lg="8" className="play-video-cols">
                        {
                            selectedVideo ?
                                <>
                                    <div className="video-wrapper">
                                        {
                                            selectedVideo?.video_url &&
                                            <video
                                                controls
                                                controlsList="nodownload"
                                                preload="metadata"
                                                muted
                                                ref={vidRef}
                                            >
                                                <source src={selectedVideo.video_url} type='video/mp4' />
                                            </video>
                                        }
                                    </div>
                                    <div className="video-detial">
                                        <div className="description">
                                            {selectedVideo?.description}
                                        </div>
                                        <div className="date">
                                            {
                                                selectedVideo && selectedVideo.created_at &&
                                                moment(selectedVideo.created_at).fromNow()
                                            }
                                        </div>
                                    </div>
                                </>
                                :
                                <></>
                        }

                    </Col>
                    <Col lg="4" className="videos-list-cols">
                        {
                            videosList?.map((item) => (
                                <div
                                    className="item-wrapper"
                                    onClick={() => handleSelectVideo(item)}
                                    key={item?.id}
                                >
                                    <div className="thumbnail">
                                        <img src={`${API_ROOT}/${item?.thumbnail}`} alt="thumbnail" />
                                    </div>
                                    <div className="detail-wrapper">
                                        <div className="title">{item?.title}</div>
                                        <div className="time">
                                            {
                                                moment(item?.created_at).fromNow()
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default GospelVideos;