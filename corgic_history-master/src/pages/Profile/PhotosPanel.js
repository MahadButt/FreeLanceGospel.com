import React, { useState, useContext, Fragment } from "react";
import { useEffect } from "react";
import { Grid, Message, Loader, Icon, Header, Placeholder } from "semantic-ui-react";
import { Spinner } from 'reactstrap'
import axios from "../../utils/axiosInstance";
import AvatarImagesModal from './AvatarImagesModal'
import LazyLoad from "react-lazyload";
import { AuthContext } from "../../shared/context/auth-context";
import { ThemeContext } from "../../shared/context/theme-context";
import { API_ROOT } from "../../utils/consts";
import "./PhotoPanel.scss";
const UserPhotos = (props) => {

    const auth = useContext(AuthContext);
    const themeContext = useContext(ThemeContext);

    const [photos, setPhotos] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState([]);
    const [total, setTotal] = useState(null);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [showLoader, setLoader] = useState(false);
    const [isBottom, setIsBottom] = useState(false);
    const [isAvatarImagesModal, setAvatarImagesModal] = useState(false);
    useEffect(() => {

        async function loadPhotos() {

            let url = '';
            if (props && !props.isOwnProfile && props.userId) {
                url = `/user/get-all-images?limit=5&offset=0&u_id=${props.userId}`
            } else {
                url = `/user/get-all-images?limit=5&offset=0`
            }

            const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${auth.user.token}` } }
            );
            if (data.successResponse) {
                setPhotos(data.successResponse.images);
                setTotal(data.successResponse.count)
            }
            setPageLoaded(true);
        }

        loadPhotos();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    useEffect(() => {
        if (isBottom) {
            handleLoadMore();
        }
    }, [isBottom]);
    const handleAvatarImagesModal = (index) => {
        let data = photos.find((obj) => {
            return obj.id == index
        })
        let array = [];
        array.push(data);
        setSelectedPhoto(array)
        setAvatarImagesModal(!isAvatarImagesModal)
    }
    const handleLoadMore = () => {
        if ((photos && photos.length > 0) && (total > photos.length)) {
            async function loadPhotos() {

                let url = '';
                if (props && !props.isOwnProfile && props.userId) {
                    url = `/user/get-all-images?limit=5&offset=${photos.length}&u_id=${props.userId}`
                } else {
                    url = `/user/get-all-images?limit=5&offset=${photos.length}`
                }

                const { data } = await axios.get(url,
                    { headers: { Authorization: `Bearer ${auth.user.token} ` } }
                );
                setPhotos(photos.concat(data.successResponse.images));
                setLoader(false)
                setIsBottom(false);
            }
            loadPhotos();
            setLoader(true)
        }
    }
    function handleScroll() {
        const scrollTop = (document.documentElement
            && document.documentElement.scrollTop)
            || document.body.scrollTop;
        const scrollHeight = (document.documentElement
            && document.documentElement.scrollHeight)
            || document.body.scrollHeight;
        if (scrollTop + window.innerHeight + 50 >= scrollHeight) {
            setIsBottom(true);
        }
    }
    let photoJSX = null;
    let errorJSX = null;

    if (pageLoaded && photos && photos.length > 0) {

        photoJSX = photos.map(photo => {
            return (
                <div className="col-md-3 col-sm-4 col-6" onClick={() => {
                    handleAvatarImagesModal(photo.id)
                }} style={{ marginBottom: 10, height: 150 }} key={photo.id}>
                    <div className="photo-panel-card">
                        <div className="overlay">
                            <div className="detail">
                                <Icon name="eye" className="icon" />
                            </div>
                        </div>
                        <LazyLoad
                            once
                            height={themeContext.theme.isMobile ? 180 : 120}
                            debounce={200}
                            offset={[-120, 0]}
                            placeholder={
                                <Placeholder style={{ height: themeContext.theme.isMobile ? "180px" : "120px" }}>
                                    <Placeholder.Image square />
                                </Placeholder>
                            }
                        >
                            <img className="feed-card-img" src={API_ROOT + photo.image_url} />
                        </LazyLoad>
                    </div>
                </div>
            );
        });

    } else {

        errorJSX = (
            <Message>
                <Message.Header>No Images found!</Message.Header>
                <p>You haven't posted any Images yet.</p>
            </Message>
        );
    }

    return (
        <div className="profile-padded">
            {
                !pageLoaded ? <Loader size="medium" active /> :
                    <Fragment>
                        <Header size="medium" dividing>
                            {
                                props && props.userDetails ?
                                    <span>{props?.userDetails?.first_name} {props?.userDetails?.last_name}'s Photos</span>
                                    :
                                    'Your Photos'
                            }
                        </Header>
                        {
                            errorJSX ? errorJSX :
                                <Grid>
                                    <div className="row" style={{ marginLeft: 0, marginRight: 0 }}>
                                        {photoJSX}
                                    </div>
                                    <div className="load-more-container">
                                        <Grid.Row >
                                            {(total > photos.length) &&
                                                <div className="load-more-btn" onClick={handleLoadMore}>
                                                    {
                                                        showLoader ?
                                                            <>
                                                                Load More
                                                                <Spinner
                                                                    color="seconday"
                                                                    className="ml-3"
                                                                    style={{ width: '22px', height: '22px' }}
                                                                />
                                                            </>
                                                            :
                                                            'Load More'
                                                    }
                                                </div>
                                            }
                                        </Grid.Row>
                                    </div>
                                </Grid>
                        }
                        {
                            isAvatarImagesModal && selectedPhoto && selectedPhoto.length > 0 &&
                            <AvatarImagesModal
                                toggle={handleAvatarImagesModal}
                                isOpen={isAvatarImagesModal}
                                data={selectedPhoto}
                            />
                        }
                    </Fragment>
            }
        </div>
    );
}

export default UserPhotos;