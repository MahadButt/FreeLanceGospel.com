import React, { useState, useContext, Fragment } from "react";
import { useEffect } from "react";
import { Grid, Button, Loader, Icon, Header, Image, Input, List } from "semantic-ui-react";
import { Spinner } from 'reactstrap'
import qs from "query-string";
import { useHistory } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { Form, Formik } from "formik";
import plusSvg from '../../assets/plus-svg.svg'
import { AuthContext } from "../../shared/context/auth-context";
import { ThemeContext } from "../../shared/context/theme-context";
import { toast } from "react-toastify";
import "./Books.scss";
const Books = (props) => {
    const history = useHistory();
    const query = qs.parse(history.location.search);
    const auth = useContext(AuthContext);
    const themeContext = useContext(ThemeContext);

    const [books, setBooks] = useState([]);
    const [isAddBook, setAddBook] = useState(false);
    const [isIndex, setIndex] = useState(null);
    const [total, setTotal] = useState(null);
    const [saveLoader, setSaveLoader] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [showLoader, setLoader] = useState(false);
    async function loadBooksStart() {
        const { data } = await axios.get(
            `/user/get-all-books/${query.u_id}?limit=5&offset=0`,
            { headers: { Authorization: `Bearer ${auth.user.token}` } }
        );
        if (data.successResponse) {
            setBooks(data.successResponse.books);
            setTotal(data.successResponse.count)
        }
        setPageLoaded(true);
    }
    useEffect(() => {
        loadBooksStart();
    }, []);
    async function loadBooks() {
        const { data } = await axios.get(
            `/user/get-all-books/${query.u_id}?&limit=5&offset=${books.length}`,
            { headers: { Authorization: `Bearer ${auth.user.token} ` } }
        );
        setBooks(books.concat(data.successResponse.books));
        setLoader(false)
        setSaveLoader(false)
    }
    async function handleDelete(id) {
        const { data } = await axios.delete(
            `/user/delete-book/${id}`,
            { headers: { Authorization: `Bearer ${auth.user.token} ` } }
        );
        var filtered = books.filter((element, index) => {
            return element.id !== id;
        })
        setBooks(filtered);
        setTotal(data.count)
        setLoader(false)
        setSaveLoader(false)
    }
    const handleLoadMore = () => {
        if ((books && books.length > 0) && (total > books.length)) {
            loadBooks();
        }
    }
    const handleAddBooks = async (index) => {
        setIndex(index)
        setAddBook(!isAddBook)
    }
    const handleSubmit = async (values, fr) => {
        const { data } = await axios({
            method: "post",
            url: "user/add-book",
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
            loadBooksStart();
            setAddBook();
        } else {
            fr.setSubmitting(false);
            toast.error(data.msg);
        }
    }
    const handleUpdate = async (values, fr) => {
        const { data } = await axios({
            method: "post",
            url: `user/update-book/${isIndex}`,
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
            loadBooksStart();
            setLoader(false)
            setSaveLoader(false)
            setAddBook();
        } else {
            fr.setSubmitting(false);
            toast.error(data.msg);
        }
    }
    let bookJSX = null;
    let errorJSX = null;

    if (pageLoaded && books && books.length > 0) {
        let bookRows = books.map((book, index) => {
            return (
                <>
                    {(isAddBook && isIndex == book.id) ?
                        <List.Item key={index}>
                            <List.Content>
                                <div className="col-12 create-book-container">
                                    <div className="create-book-form">
                                        <Formik
                                            initialValues={{
                                                title: book.title
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
                                                            placeholder="Enter Book Title"
                                                            type="text"
                                                        />
                                                        <p className="input-field-error">
                                                            {fr.errors.title && fr.touched.title && fr.errors.title}
                                                        </p>
                                                    </div>
                                                    <div className="submit-btn">
                                                        <Button
                                                            onClick={() => { handleAddBooks(null) }}
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
                        : <List.Item key={index} className="book-item">
                            {props.isOwnProfile &&
                                <List.Content className="mt-1" floated='right'>
                                    <div>
                                        <Button
                                            icon
                                            onClick={() => { handleDelete(book.id) }}
                                            className="add-friend"
                                            title={"Delete Book"}
                                        >
                                            <Icon name="trash" />
                                        </Button>
                                        <Button
                                            onClick={() => handleAddBooks(book.id)}
                                            icon
                                            className="add-friend"
                                            title={"Edit Book"}
                                        >
                                            <Icon name="pencil alternate" />
                                        </Button>
                                    </div>
                                </List.Content>
                            }
                            {/* <Image className="avatar" avatar src={API_ROOT + user.avatar_url} /> */}
                            {/* <List.Content as={Link} to={`/profile/?u_id=${user.u_id}`}> */}
                            <List.Content>
                                <List.Header className="book-title p-2" title={book.title}>{book.title}</List.Header>
                                {/* <List.Description className="book-description">
                                    {book.description ? book.description : ''}
                                </List.Description> */}
                            </List.Content>
                        </List.Item>
                    }
                </>
            );
        });
        bookJSX = (
            <div className="row addBook mx-1" >
                {(isAddBook && isIndex == null) ?
                    <div className="col-12 create-book-container">
                        <div className="create-book-form">
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
                                                placeholder="Enter Book Title"
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
                                                placeholder="Enter Book description"
                                                rows={2}
                                            />
                                            <p className="input-field-error">
                                                {fr.errors.description && fr.touched.description && fr.errors.description}
                                            </p>
                                        </div> */}
                                        <div className="submit-btn">
                                            <Button
                                                onClick={() => { handleAddBooks() }}
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
                        <div className="col-2 addImage" onClick={() => { handleAddBooks(null) }}>
                            <Image src={plusSvg} style={{ width: 33 }} />
                        </div>
                        <div className="col-10 addText" onClick={() => { handleAddBooks(null) }}>
                            <b>Add your favourite books</b>
                        </div>
                    </>
                }
                <div className="col-12 book-content-wrapper">
                    <div className="book-list-wrapper">
                        <List>
                            {bookRows}
                        </List>
                    </div>
                    {(total > books.length) &&
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
            <div className="row addBook mx-1">
                {!isAddBook ?
                    props.isOwnProfile ? <>
                        <div className="col-2 addImage" onClick={() => { handleAddBooks(null) }}>
                            <Image src={plusSvg} style={{ width: 33 }} />
                        </div>
                        <div className="col-10 addText" onClick={() => { handleAddBooks(null) }}>
                            <b>Add your favourite books</b>
                        </div>
                    </> :
                        <div className="col-10 addText">
                            <b>No Records Found</b>
                        </div>
                    :
                    <div className="col-12 create-book-container">
                        <div className="create-book-form">
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
                                                placeholder="Enter Book Title"
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
                                                placeholder="Enter Book description"
                                                rows={2}
                                            />
                                            <p className="input-field-error">
                                                {fr.errors.description && fr.touched.description && fr.errors.description}
                                            </p>
                                        </div> */}
                                        <div className="submit-btn">
                                            <Button
                                                onClick={() => handleAddBooks(null)}
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
        <div className="books">
            {
                !pageLoaded ? <Loader size="medium" active /> :
                    <Fragment>
                        <Header size="medium" dividing>Favourite Books</Header>
                        {
                            errorJSX ? errorJSX :
                                <Grid>
                                    {bookJSX}
                                </Grid>
                        }
                    </Fragment>
            }
        </div>
    );
}

export default Books;