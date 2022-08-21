import React, { useState, useContext, Fragment } from "react";
import { useEffect } from "react";
import { Grid, Button, Loader, Icon, Header, Image, Input, List } from "semantic-ui-react";
import { Spinner } from 'reactstrap'
import axios from "../../utils/axiosInstance";
import { Form, Formik } from "formik";
import plusSvg from '../../assets/plus-svg.svg'
import { AuthContext } from "../../shared/context/auth-context";
import { ThemeContext } from "../../shared/context/theme-context";
import { toast } from "react-toastify";
import qs from "query-string";
import { useHistory } from "react-router-dom";
import "./Movies.scss";
const Movies = (props) => {
    const history = useHistory();
    const query = qs.parse(history.location.search);
    const auth = useContext(AuthContext);
    const themeContext = useContext(ThemeContext);

    const [movies, setMovies] = useState([]);
    const [isAddMovie, setAddMovie] = useState(false);
    const [isIndex, setIndex] = useState(null);
    const [total, setTotal] = useState(null);
    const [saveLoader, setSaveLoader] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [showLoader, setLoader] = useState(false);
    async function loadMoviesStart() {
        const { data } = await axios.get(
            `/user/get-all-movies/${query.u_id}?limit=5&offset=0`,
            { headers: { Authorization: `Bearer ${auth.user.token}` } }
        );
        if (data.successResponse) {
            setMovies(data.successResponse.movies);
            setTotal(data.successResponse.count)
        }
        setPageLoaded(true);
    }
    useEffect(() => {
        loadMoviesStart();
    }, []);
    async function loadMovies() {
        const { data } = await axios.get(
            `/user/get-all-movies/${query.u_id}?&limit=5&offset=${movies.length}`,
            { headers: { Authorization: `Bearer ${auth.user.token} ` } }
        );
        setMovies(movies.concat(data.successResponse.movies));
        setLoader(false)
        setSaveLoader(false)
    }
    async function handleDelete(id) {
        const { data } = await axios.delete(
            `/user/delete-movie/${id}`,
            { headers: { Authorization: `Bearer ${auth.user.token} ` } }
        );
        var filtered = movies.filter((element, index) => {
            return element.id !== id;
        })
        setMovies(filtered);
        setTotal(data.count)
        setLoader(false)
        setSaveLoader(false)
    }
    const handleLoadMore = () => {
        if ((movies && movies.length > 0) && (total > movies.length)) {
            loadMovies();
        }
    }
    const handleAddMovies = async (index) => {
        setIndex(index)
        setAddMovie(!isAddMovie)
    }
    const handleSubmit = async (values, fr) => {
        const { data } = await axios({
            method: "post",
            url: "user/add-movie",
            data: {
                title: values.title,
                // description: values.description
            },
            headers: {
                Authorization: `Bearer ${auth.user.token}`
            },
        });
        if (data && data.success) {
            setSaveLoader(true)
            loadMoviesStart();
            setAddMovie();
        } else {
            fr.setSubmitting(false);
            toast.error(data.msg);
        }
    }
    const handleUpdate = async (values, fr) => {
        const { data } = await axios({
            method: "post",
            url: `user/update-movie/${isIndex}`,
            data: {
                title: values.title,
                // description: values.description
            },
            headers: {
                Authorization: `Bearer ${auth.user.token}`
            },
        });
        if (data && data.success) {
            setSaveLoader(true)
            loadMoviesStart();
            setLoader(false)
            setSaveLoader(false)
            setAddMovie();
        } else {
            fr.setSubmitting(false);
            toast.error(data.msg);
        }
    }
    let movieJSX = null;
    let errorJSX = null;

    if (pageLoaded && movies && movies.length > 0) {
        let movieRows = movies.map((movie, index) => {
            return (
                <>
                    {(isAddMovie && isIndex == movie.id) ?
                        <List.Item key={index}>
                            <List.Content>
                                <div className="col-12 create-movie-container">
                                    <div className="create-movie-form">
                                        <Formik
                                            initialValues={{
                                                title: movie.title
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
                                                            placeholder="Enter Movie Title"
                                                            type="text"
                                                        />
                                                        <p className="input-field-error">
                                                            {fr.errors.title && fr.touched.title && fr.errors.title}
                                                        </p>
                                                    </div>
                                                    <div className="submit-btn">
                                                        <Button
                                                            onClick={() => { handleAddMovies(null) }}
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
                        : <List.Item key={index} className="movie-item">
                            {props.isOwnProfile && <List.Content className="mt-1" floated='right'>
                                <div>
                                    <Button
                                        icon
                                        onClick={() => { handleDelete(movie.id) }}
                                        className="add-friend"
                                        title={"Delete Movie"}
                                    >
                                        <Icon name="trash" />
                                    </Button>
                                    <Button
                                        onClick={() => handleAddMovies(movie.id)}
                                        icon
                                        className="add-friend"
                                        title={"Edit Movie"}
                                    >
                                        <Icon name="pencil alternate" />
                                    </Button>
                                </div>
                            </List.Content>
                            }
                            {/* <Image className="avatar" avatar src={API_ROOT + user.avatar_url} /> */}
                            {/* <List.Content as={Link} to={`/profile/?u_id=${user.u_id}`}> */}
                            <List.Content>
                                <List.Header className="movie-title p-2" title={movie.title}>{movie.title}</List.Header>
                                {/* <List.Description className="movie-description">
                                    {movie.description ? movie.description : ''}
                                </List.Description> */}
                            </List.Content>
                        </List.Item>
                    }
                </>
            );
        });
        movieJSX = (
            <div className="row addMovie mx-1" >
                {(isAddMovie && isIndex == null) ?
                    <div className="col-12 create-movie-container">
                        <div className="create-movie-form">
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
                                                placeholder="Enter Movie Title"
                                                type="text"
                                            />
                                            <p className="input-field-error">
                                                {fr.errors.title && fr.touched.title && fr.errors.title}
                                            </p>
                                        </div>
                                        {/* <div className="input-field">
                                            <label className="field-label">Description</label>
                                            <TextArea
                                                fluid name="description"
                                                values={fr.values.description}
                                                onBlur={fr.handleBlur}
                                                onChange={fr.handleChange}
                                                placeholder="Enter movie description"
                                                rows={2}
                                            />
                                            <p className="input-field-error">
                                                {fr.errors.description && fr.touched.description && fr.errors.description}
                                            </p>
                                        </div> */}
                                        <div className="submit-btn">
                                            <Button
                                                onClick={() => { handleAddMovies() }}
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
                    : props.isOwnProfile && <>
                        <div className="col-2 addImage" onClick={() => { handleAddMovies(null) }}>
                            <Image src={plusSvg} style={{ width: 33 }} />
                        </div>
                        <div className="col-10 addText" onClick={() => { handleAddMovies(null) }}>
                            <b>Add your favourite movies</b>
                        </div>
                    </>
                }
                <div className="col-12 movie-content-wrapper">
                    <div className="movie-list-wrapper">
                        <List>
                            {movieRows}
                        </List>
                    </div>
                    {(total > movies.length) &&
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
            <div className="row addMovie mx-1">
                {!isAddMovie ?
                    props.isOwnProfile ? <>
                        <div className="col-2 addImage" onClick={() => { handleAddMovies(null) }}>
                            <Image src={plusSvg} style={{ width: 33 }} />
                        </div>
                        <div className="col-10 addText" onClick={() => { handleAddMovies(null) }}>
                            <b>Add your favourite movies</b>
                        </div>
                    </> :
                        <div className="col-10 addText">
                            <b>No Records Found</b>
                        </div>
                    :
                    <div className="col-12 create-movie-container">
                        <div className="create-movie-form">
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
                                                placeholder="Enter Movie Title"
                                                type="text"
                                            />
                                            <p className="input-field-error">
                                                {fr.errors.title && fr.touched.title && fr.errors.title}
                                            </p>
                                        </div>
                                        {/* <div className="input-field">
                                            <label className="field-label">Description</label>
                                            <TextArea
                                                fluid name="description"
                                                values={fr.values.description}
                                                onBlur={fr.handleBlur}
                                                onChange={fr.handleChange}
                                                placeholder="Enter movie description"
                                                rows={2}
                                            />
                                            <p className="input-field-error">
                                                {fr.errors.description && fr.touched.description && fr.errors.description}
                                            </p>
                                        </div> */}
                                        <div className="submit-btn">
                                            <Button
                                                onClick={() => handleAddMovies(null)}
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
        <div className="movies">
            {
                !pageLoaded ? <Loader size="medium" active /> :
                    <Fragment>
                        <Header size="medium" dividing>Favourite Movies</Header>
                        {
                            errorJSX ? errorJSX :
                                <Grid>
                                    {movieJSX}
                                </Grid>
                        }
                    </Fragment>
            }
        </div>
    );
}

export default Movies;