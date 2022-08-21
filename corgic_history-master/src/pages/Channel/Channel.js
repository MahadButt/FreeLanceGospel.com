import React, { useState, useEffect } from "react";
import {
    Loader,
    Embed
} from "semantic-ui-react";
import {
    Container,
    Row,
    Col
} from 'reactstrap';

import Footer from "../../components/Footer/NewFooter/NewFooter";
import Banner_Video from '../../assets/THE CHUTCH.mp4'
import youtube from "../../assets/youtube.svg";
import cogic from "../../assets/logo.png";
import "./Channel.scss";

const data = [
    {src: 'https://www.youtube.com/embed/ZYT_K1zBncE'},
    {src: 'https://www.youtube.com/embed/9nXcsQhiRV0'},
    {src: 'https://www.youtube.com/embed/G0qCejIrI4c'},
    {src: 'https://www.youtube.com/embed/bqZZZ0OrjuU'},
    {src: 'https://www.youtube.com/embed/vDHtXy9ivsY'},
    {src: 'https://www.youtube.com/embed/lI-PnuQOg0k'},
]

const Channel = (props) => {

    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        window.document.title = "Gospel Channel | The Church Book";
        setPageLoaded(true);
    }, []);

    return (
        <div className="gospel-channel-wrapper">
            {
                !pageLoaded ? <Loader active size="large" /> :
                <>
                    <div className='channel-inner-wrapper'>
                        <div className="video-banner-container">
                            <iframe 
                                width="100%" 
                                className="ifram-item"
                                src="https://www.youtube.com/embed/qWsM2ZhHGK4" 
                                //title="YouTube video player" 
                                frameborder="0" 
                                //allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                //allowfullscreen
                            >
                            </iframe>
                        </div>
                        <div className="youtube-videos-wrapper">
                            <div className="youtube-title">
                                <img src={youtube} alt="icon" />
                                <div className="title">Gospel Youtube Channel</div>
                            </div>
                            <div className="custom-border"></div>
                            <Container className="videos-container">
                                <Row className="videos-row">
                                    {
                                        data.map((item, index) => (
                                            <Col md="6" className="videos-cols" key={item.src}>
                                                <iframe 
                                                    width="100%"
                                                    className="ifram-item"
                                                    src={item.src} 
                                                    //title="YouTube video player" 
                                                    frameborder="0" 
                                                    //allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                    //allowfullscreen
                                                >
                                                </iframe>
                                            </Col>
                                        ))
                                    }
                                </Row>
                            </Container>
                        </div>
                    </div>
                    <Footer />
                </>
            }
        </div>
    );
}

export default Channel;