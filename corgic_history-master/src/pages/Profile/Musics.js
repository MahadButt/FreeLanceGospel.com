import React, { useState, useContext, Fragment, useRef } from "react";
import { useEffect } from "react";
import { Grid, Button, Loader, Icon, Header, Image, Input, List, Radio } from "semantic-ui-react";
import { Spinner } from 'reactstrap'
import axios from "../../utils/axiosInstance";
import { Form, Formik } from "formik";
import plusSvg from '../../assets/plus-svg.svg'
import { AuthContext } from "../../shared/context/auth-context";
import { ThemeContext } from "../../shared/context/theme-context";
import { toast } from "react-toastify";
import { API_ROOT } from '../../utils/consts'
import qs from "query-string";
import { useHistory } from "react-router-dom";
import "./Musics.scss";
const Musics = (props) => {
    const history = useHistory();
    const query = qs.parse(history.location.search);
    const auth = useContext(AuthContext);
    const themeContext = useContext(ThemeContext);
    const audioRef = useRef(null)
    const [musics, setMusics] = useState([]);
    const [isAddMusics, setAddMusics] = useState(false);
    const [isIndex, setIndex] = useState(null);
    const [total, setTotal] = useState(null);
    const [saveLoader, setSaveLoader] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [showLoader, setLoader] = useState(false);
    const [selectedAudioFile, setSelectedAudioFile] = useState(null);
    const [selectedAudioPlay, setSelectedAudioPlay] = useState(null);
    const [activePlay, setActivePlay] = useState(null);
    const [isMusicLoader, setIsMusicLoader] = useState(false);
    const [musicFieldErr, setMusicFieldErr] = useState(null);
    async function loadMusicsStart() {
        const { data } = await axios.get(
            `/user/get-all-musics/${query.u_id}?limit=5&offset=0`,
            { headers: { Authorization: `Bearer ${auth.user.token}` } }
        );
        if (data && data.success && data.successResponse) {
            setMusics(data.successResponse);
            setTotal(data?.count)
        }
        setPageLoaded(true);
    }
    useEffect(() => {
        loadMusicsStart();
    }, []);
    async function loadMusics() {
        const { data } = await axios.get(
            `/user/get-all-musics/${query.u_id}?&limit=5&offset=${musics.length}`,
            { headers: { Authorization: `Bearer ${auth.user.token} ` } }
        );
        if (data && data.success && data.successResponse) {
            setMusics(musics.concat(data.successResponse));
        }
        setLoader(false)
        setSaveLoader(false)
    }
    async function handleDelete(id) {
        const { data } = await axios.delete(
            `/user/delete-music/${id}`,
            { headers: { Authorization: `Bearer ${auth.user.token} ` } }
        );
        var filtered = musics.filter((element, index) => {
            return element.id !== id;
        })
        setMusics(filtered);
        setTotal(data.count)
        setLoader(false)
        setSaveLoader(false)
    }
    const handleLoadMore = () => {
        if ((musics && musics.length > 0) && (total > musics.length)) {
            loadMusics();
        }
    }
    const handleAddMusics = async (index) => {
        setIndex(index)
        setAddMusics(!isAddMusics)
    }
    const handleDefaultMusics = async (index) => {
        const { data } = await axios({
            method: "put",
            url: `user/default-music/${index}`,
            headers: {
                Authorization: `Bearer ${auth.user.token}`
            },
        });
        if (data && data.success) {
            setSaveLoader(true)
            loadMusicsStart();
        } else {
            toast.error(data.msg);
        }
    }
    const handleSubmit = async (values, fr) => {

        const formData = new FormData();
        if (selectedAudioFile) {
            formData.append("disk", selectedAudioFile);
        }
        formData.append("title", values.title);
        const { data } = await axios({
            method: "post",
            url: "user/add-music",
            data: formData,
            headers: {
                Authorization: `Bearer ${auth.user.token}`
            },
        });
        if (data && data.success) {
            setSaveLoader(true)
            loadMusicsStart();
            setAddMusics();
            setSelectedAudioFile(null)
        } else {
            setSelectedAudioFile(null)
            fr.setSubmitting(false);
            toast.error(data.msg);
        }
    }
    const handleUpdate = async (values, fr) => {

        const formData = new FormData();
        if (selectedAudioFile) {
            formData.append("disk", selectedAudioFile);
        }
        formData.append("title", values.title);
        const { data } = await axios({
            method: "post",
            url: `user/update-music/${isIndex}`,
            data: formData,
            headers: {
                Authorization: `Bearer ${auth.user.token}`
            },
        });
        if (data && data.success) {
            setSaveLoader(true)
            loadMusicsStart();
            setLoader(false)
            setSaveLoader(false)
            setAddMusics();
        } else {
            fr.setSubmitting(false);
            toast.error(data.msg);
        }
    }

    const loadSingleMusic = async (item) => {

        const { data } = await axios({
            method: "get",
            url: `user/music/${item.id}/data`,
            headers: {
                Authorization: `Bearer ${auth.user.token}`
            },
        });
        if (data && data.success && data.successResponse && data.successResponse.file_path) {
            setSelectedAudioPlay(data.successResponse)
            setIsMusicLoader(false)
            setActivePlay(null)
            audioRef.current.src = `${API_ROOT}api/user/music/${getFilePath(data?.successResponse?.file_path)}`
            audioRef.current.play();
        } else {
            toast.error(data.msg);
            setIsMusicLoader(false)
            setSelectedAudioPlay(null)
            setActivePlay(null)
        }
    }

    let musicJSX = null;
    let errorJSX = null;

    const onAudioFileChange = (e) => {
        setSelectedAudioFile(e.target.files[0])
    }

    const activeAudioPlay = (item) => {
        if (item.file_path) {
            setIsMusicLoader(true)
            setSelectedAudioPlay(null)
            setActivePlay(item)
            loadSingleMusic(item)
        }
    }

    const getFilePath = (file) => {
        let x = file.split("audio/")[1]
        return x;
    }
    const getFileType = (file) => {
        let arr = file.split(".");
        let extension = arr[arr.length - 1];
        let type = "audio/mp3"
        if (extension === "mp3") {
            type = "audio/mpeg"
        } else if (extension === "wav") {
            type = "audio/wav"
        } else if (extension === "ogg") {
            type = "audio/ogg"
        }
        return type;
    }

    if (pageLoaded && musics && musics.length > 0) {
        let musicRows = musics.map((music, index) => {
            return (
                <React.Fragment key={index}>
                    {(isAddMusics && isIndex == music.id) ?
                        <List.Item key={index}>
                            <List.Content>
                                <div className="col-12 create-music-container">
                                    <div className="create-music-form">
                                        <Formik
                                            initialValues={{
                                                title: music?.title
                                            }}
                                            onSubmit={handleUpdate}
                                        >
                                            {(fr) => (
                                                <Form>
                                                    <div className="input-field">
                                                        <label className="field-label">Title</label>
                                                        <Input
                                                            autoComplete="off"
                                                            fluid name="title"
                                                            value={fr.values.title}
                                                            onBlur={fr.handleBlur}
                                                            onChange={fr.handleChange}
                                                            placeholder="Enter Music Title"
                                                            type="text"
                                                        />
                                                        <p className="input-field-error">
                                                            {fr.errors.title && fr.touched.title && fr.errors.title}
                                                        </p>
                                                    </div>
                                                    <div className="audio-file-upload">
                                                        <input type="file" name="file" accept=".mp3,.wav,.ogg" onChange={onAudioFileChange} />
                                                    </div>
                                                    <div className="submit-btn">
                                                        <Button
                                                            onClick={() => { handleAddMusics(null) }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            loading={fr.isSubmitting}
                                                            disabled={
                                                                fr.isSubmitting || !fr.values.title
                                                            }
                                                            className={`submit-btn`}
                                                        >
                                                            Save
                                                        </Button>
                                                    </div>
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                </div>
                            </List.Content>
                        </List.Item>
                        : <List.Item key={index} className="music-item">

                            {/* <Image className="avatar" avatar src={API_ROOT + user.avatar_url} /> */}
                            {/* <List.Content as={Link} to={`/profile/?u_id=${user.u_id}`}> */}
                            <List.Content className="music-title-wrapper">
                                <div className="title-wrapper">
                                    <List.Header className="music-title" title={music.title}>{music.title}</List.Header>
                                    {
                                        music.file_path &&
                                        <>
                                            {
                                                isMusicLoader && activePlay.id === music.id ?
                                                    <Spinner
                                                        color="seconday"
                                                        className="mt-2"
                                                        style={{ width: '22px', height: '22px' }}
                                                    />
                                                    :
                                                    (selectedAudioPlay && selectedAudioPlay.file_path && selectedAudioPlay.id === music.id) ?
                                                        <audio
                                                            controls
                                                            autoPlay
                                                            className="mt-2"
                                                            src={`${API_ROOT}api/user/music/${getFilePath(selectedAudioPlay.file_path)}`}
                                                            ref={audioRef}
                                                            preload="auto"
                                                        >
                                                            {/* <source 
                                                                src={`${API_ROOT}api/user/music/${getFilePath(selectedAudioPlay.file_path)}`} 
                                                                type={getFileType(selectedAudioPlay.file_path)} 
                                                            /> */}
                                                            Your browser does not support the HTML5 audio element.
                                                        </audio>
                                                        :
                                                        <div className="play-icon-wrap mt-2" onClick={() => activeAudioPlay(music)}>
                                                            <Icon name="play circle outline" className="play-icon" />
                                                        </div>
                                            }
                                        </>
                                    }
                                </div>
                                {
                                    props.isOwnProfile &&
                                    <div className="music-actions-btns d-flex">
                                        <Radio
                                            className="mr-3 mt-2"
                                            onClick={() => handleDefaultMusics(music.id)}
                                            toggle
                                            checked={`${music.is_default}` === "1"}
                                        />
                                        <Button
                                            icon
                                            onClick={() => { handleDelete(music.id) }}
                                            className="add-friend"
                                            title={"Delete Music"}
                                        >
                                            <Icon name="trash" />
                                        </Button>
                                        <Button
                                            onClick={() => handleAddMusics(music.id)}
                                            icon
                                            className="add-friend"
                                            title={"Edit Music"}
                                        >
                                            <Icon name="pencil alternate" />
                                        </Button>
                                    </div>
                                }

                                {/* <List.Description className="music-description">
                                    {music.description ? music.description : ''}
                                </List.Description> */}
                            </List.Content>
                        </List.Item>
                    }
                </React.Fragment >
            );
        });
        musicJSX = (
            <div className="row addMusic mx-1" >
                {(isAddMusics && isIndex == null) ?
                    <div className="col-12 create-music-container">
                        <div className="create-music-form">
                            <Formik
                                initialValues={{
                                    title: '',
                                    // description: ''
                                }}
                                onSubmit={handleSubmit}
                            >
                                {(fr) => (
                                    <Form>
                                        <div className="input-field">
                                            <label className="field-label">Title</label>
                                            <Input
                                                autoComplete="off"
                                                fluid name="title"
                                                value={fr.values.title}
                                                onBlur={fr.handleBlur}
                                                onChange={fr.handleChange}
                                                placeholder="Enter Music Title"
                                                type="text"
                                            />
                                            <p className="input-field-error">
                                                {fr.errors.title && fr.touched.title && fr.errors.title}
                                            </p>
                                        </div>
                                        <div className="audio-file-upload">
                                            <input type="file" name="file" accept=".mp3,.wav,.ogg" onChange={onAudioFileChange} required />
                                        </div>
                                        {/* <div className="input-field">
                                            <label className="field-label">Description</label>
                                            <TextArea
                                                fluid name="description"
                                                values={fr.values.description}
                                                onBlur={fr.handleBlur}
                                                onChange={fr.handleChange}
                                                placeholder="Enter music description"
                                                rows={2}
                                            />
                                            <p className="input-field-error">
                                                {fr.errors.description && fr.touched.description && fr.errors.description}
                                            </p>
                                        </div> */}
                                        <div className="submit-btn">
                                            <Button
                                                onClick={() => { handleAddMusics() }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                loading={fr.isSubmitting}
                                                disabled={
                                                    fr.isSubmitting || !fr.values.title
                                                }
                                                className={`submit-btn`}
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                    :
                    props.isOwnProfile && <>
                        <div className="col-2 addImage">
                            <Image src={plusSvg} style={{ width: 33 }} onClick={() => { handleAddMusics(null) }} />
                        </div>
                        <div className="col-10 addText" onClick={() => { handleAddMusics(null) }}>
                            <b>Add your favourite musics</b>
                        </div>
                    </>
                }
                <div className="col-12 music-content-wrapper">
                    <div className="music-list-wrapper">
                        <List>
                            {musicRows}
                        </List>
                    </div>
                    {(total > musics.length) &&
                        <div className="load-more-container">
                            <Button className="load-more-btn" onClick={handleLoadMore}>
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
                            </Button>
                        </div>
                    }
                </div>
            </div>
        );
    } else {
        errorJSX = (
            <div className="row addMusic mx-1">
                {!isAddMusics ?
                    props.isOwnProfile ? <>
                        <div className="col-2 addImage">
                            <Image src={plusSvg} style={{ width: 33 }} onClick={() => { handleAddMusics(null) }} />
                        </div>
                        <div className="col-10 addText" onClick={() => { handleAddMusics(null) }}>
                            <b>Add your favourite musics</b>
                        </div>
                    </> :
                        <div className="col-10 addText">
                            <b>No Records Found</b>
                        </div>
                    :
                    <div className="col-12 create-music-container">
                        <div className="create-music-form">
                            <Formik
                                initialValues={{
                                    title: '',
                                    // description: ''
                                }}
                                onSubmit={handleSubmit}
                            >
                                {(fr) => (
                                    <Form>
                                        <div className="input-field">
                                            <label className="field-label">Title</label>
                                            <Input
                                                autoComplete="off"
                                                fluid name="title"
                                                value={fr.values.title}
                                                onBlur={fr.handleBlur}
                                                onChange={fr.handleChange}
                                                placeholder="Enter Music Title"
                                                type="text"
                                            />
                                            <p className="input-field-error">
                                                {fr.errors.title && fr.touched.title && fr.errors.title}
                                            </p>
                                        </div>
                                        <div className="audio-file-upload">
                                            <input type="file" name="file" accept=".mp3,.wav,.ogg" onChange={onAudioFileChange} required />
                                        </div>
                                        {/* <div className="input-field">
                                            <label className="field-label">Description</label>
                                            <TextArea
                                                fluid name="description"
                                                values={fr.values.description}
                                                onBlur={fr.handleBlur}
                                                onChange={fr.handleChange}
                                                placeholder="Enter music description"
                                                rows={2}
                                            />
                                            <p className="input-field-error">
                                                {fr.errors.description && fr.touched.description && fr.errors.description}
                                            </p>
                                        </div> */}
                                        <div className="submit-btn">
                                            <Button
                                                onClick={() => handleAddMusics(null)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                loading={fr.isSubmitting}
                                                disabled={
                                                    fr.isSubmitting || !fr.values.title
                                                }
                                                className={`submit-btn`}
                                            >
                                                {
                                                    saveLoader ?
                                                        <>
                                                            Load More
                                                            <Spinner
                                                                color="seconday"
                                                                className="ml-3"
                                                                style={{ width: '22px', height: '22px' }}
                                                            />
                                                        </>
                                                        :
                                                        'Save'
                                                }
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                }
            </div>
        );
    }

    return (
        <div className="musics">
            {
                !pageLoaded ? <Loader size="medium" active /> :
                    <Fragment>
                        <Header size="medium" dividing>Favourite Musics</Header>
                        {
                            errorJSX ? errorJSX :
                                <Grid>
                                    {musicJSX}
                                </Grid>
                        }
                    </Fragment>
            }
        </div>
    );
}

export default Musics;