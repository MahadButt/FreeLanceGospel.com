import React, { useState, useContext, useEffect } from "react";
import { Loader, Input, Dropdown, Button, Grid, Segment, Icon, Label } from "semantic-ui-react";
import { Formik, Form } from "formik";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import axios from "../../utils/axiosInstance";
import qs from "query-string";
import { AuthContext } from "../../shared/context/auth-context";
import { toast } from "react-toastify";

import TagSelector from "./TagSelector";
import NewFooter from "../../components/Footer/NewFooter/NewFooter";

import "./editor.scss";
import "./CreateBlog.scss";

const CreateBlog = (props) => {

    const query = qs.parse(props.location.search);
    const auth = useContext(AuthContext);

    const [blog, setBlog] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        window.document.title = "Create | The Church Book";
        getCategories();
        getChapters();
        if(query && query.story_id) {
            loadBlog();
        } else {
            setPageLoaded(true)
        }
    }, []);

    const loadBlog = async () => {
        const { data } = await axios.get(`/blog/get-blog/${query.story_id}`);
        // console.log(data)
        setBlog(data);
        if(data && data.category && data.category.id) {
            getSubCategories(data.category.id)
        }
        setPageLoaded(true);
    }
    const getChapters = async () => {
        if (chapters.length === 0) {
            const { data } = await axios.get("/chapter/get-chapters", {
                headers: {
                    'Authorization': `Bearer ${auth.user.token}` 
                }
            });
            // console.log(data)
            if (data && data.successResponse && data.successResponse.length > 0) {
                const chaptersOption = data.successResponse.map(chapter => {
                    return {
                        key: chapter.id,
                        value: chapter.id,
                        text: chapter.title
                    };
                });
                setChapters(chaptersOption);
            } else {
                setChapters([])
            }
        }
    }
    const getCategories = async () => {
        if (categories.length === 0) {
            const { data } = await axios.get("/blog/categories");
            const categoriesOption = data.map(category => {
                return {
                    key: category.id,
                    value: category.id,
                    text: category.category_name
                };
            });
            setCategories(categoriesOption);
        }
    }

    const getSubCategories = async (parentId) => {
        if (parentId) {
            const { data } = await axios.get(`/blog/sub-categories/${parentId}`);
            const categoriesOption = data.map(category => {
                return {
                    key: category.id,
                    value: category.id,
                    text: category.subcat_name
                };
            });
            setSubCategories(categoriesOption);
        }
    }

    const handleImage = (event, setFieldValue) => {
        event.target.files[0].preview = URL.createObjectURL(event.target.files[0]);
        setFieldValue("banner_img", event.target.files[0]);
    }

	const removeTag = (index, tags, setFieldValue) => {

		const updatedTags = [...tags];
		updatedTags.splice(index, 1);
		setFieldValue("tag_list", updatedTags);
    }
    
    let editorState = null;
    
    if (query?.story_id && blog && blog.description) {

        const blocksFromHtml = htmlToDraft(blog.description);
        const contentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks, blocksFromHtml.entityMap);

        editorState = EditorState.createWithContent(contentState);
    }
    const initialValues = {
        title: blog && blog.title ? blog.title :  "",
        sub_title: blog && blog.sub_title ? blog.sub_title : "",
        // description: editorState ? editorState : EditorState.createEmpty(),
        description: editorState ? editorState : EditorState.createEmpty(),
        chapter: blog?.chapter?.id ?? "",
        category: blog?.category?.id ?? "",
        sub_category: blog?.sub_category?.id ?? "",
        banner_img: "",
        tag_name: "",
        tag_list: [],
        // chapter_id: 1
    };

    const handleSubmit = async (values, fr) => {

        // console.log(values)

        const formData = new FormData();
		
        formData.append("disk", values.banner_img);
        formData.append("title", values.title);
        formData.append("sub_title", values.sub_title);
		formData.append("description", draftToHtml(convertToRaw(values.description.getCurrentContent())));
		formData.append("tag_list", JSON.stringify(values.tag_list));
		formData.append("cat_id", values.category);
        formData.append("subcat_id", values.sub_category);
        if (values.chapter) {
            formData.append("chapter_id", values.chapter);
        }
        if(query && query.story_id) {
            // console.log(values)
            const payload = {
                title: values.title, 
                sub_title: values.sub_title, 
                description: draftToHtml(convertToRaw(values.description.getCurrentContent())), 
                cat_id: values.category, 
                subcat_id: values.sub_category, 
                ...values.chapter && {chapter_id: values.chapter} 
            }
            // console.log(payload)
            const { data } = await axios({
                method: "patch",
                url: `/blog/update/${query?.story_id}`,
                data: payload,
                headers: {
                    Authorization: `Bearer ${auth.user.token}` 
                },
            });
            // console.log(data)
            if (data.success) {
                window.location.href = `/story/?story_id=${query?.story_id}`;
            } else {
                fr.setSubmitting(false);
                toast.error("Blog Update Failed! Try Again");
            }
        } else {
            const { data } = await axios({
                method: "post",
                url: "/blog/new",
                data: formData,
                headers: {
                    "content-type": "multipart/form-data", 
                    Authorization: `Bearer ${auth.user.token}` 
                },
                onUploadProgress: progressEvent => console.log(progressEvent.loaded)
            });
            if (data.success) {
                window.location.href = `/story/?story_id=${data.blog_id}`;
            } else {
                fr.setSubmitting(false);
                toast.error("Blog Creation Failed! Try Again");
            }
        }
    }

    return (
        <div className="create-new-blog-container">
            {
                !pageLoaded ? <Loader size="massive" active /> :
                <>
                <div className="new-blog-inner-container">
                    <div className="title-wrapper">
                        <div className="title">
                            {query?.story_id ? "Edit Your Story" : "Create New Story"}
                        </div>
                        <div className="custom-border"></div>
                    </div>
                    <div className="sub-title">
                        {query?.story_id ? "Edit" : "Write"} your story below, let everyone know what's on your mind
                    </div>
                    <div className="create-blog-form-wrapper">
                        <Segment>
                            <Formik
                                initialValues={initialValues}
                                onSubmit={handleSubmit}
                            >
                                {(fr) => (
                                    <Form> 
                                        {
                                            query?.story_id ? null :
                                            <>
                                                {
                                                    fr.values.banner_img &&
                                                    <div className="preview-image-wrapper">
                                                        <div className="preview-remove-button">
                                                            <Button
                                                                negative
                                                                icon
                                                                type="button"
                                                                onClick={() => fr.setFieldValue("banner_img", null)}
                                                                labelPosition="right"
                                                            >
                                                                Remove
                                                                <Icon name="trash" />
                                                            </Button>
                                                        </div>
                                                        <img src={fr.values.banner_img.preview} />
                                                    </div>
                                                }
                                                <div className="upload-image-button">
                                                    <input
                                                        accept="image/*"
                                                        hidden
                                                        id="banner_img_upload"
                                                        type="file"
                                                        onChange={(event => handleImage(event, fr.setFieldValue))}
                                                    />
                                                    <label htmlFor="banner_img_upload">
                                                        <Button type="button" as="span">
                                                            Upload Banner Image
                                                            <Icon name="upload" className="icon"/>
                                                        </Button>
                                                    </label>
                                                </div>
                                            </>
                                        }
                                        <Grid stackable columns="equal">
                                            <Grid.Column>
                                                <div className="input-field">
                                                    <label className="field-label">Title</label>
                                                    <Input
                                                        autoComplete="off"
                                                        fluid name="title"
                                                        value={fr.values.title}
                                                        onBlur={fr.handleBlur}
                                                        onChange={fr.handleChange}
                                                        placeholder="Enter Blog Title"
                                                        type="text"
                                                    />
                                                    <p className="input-field-error">
                                                        {fr.errors.title && fr.touched.title && fr.errors.title}
                                                    </p>
                                                </div>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <div className="input-field">
                                                    <label className="field-label">Sub Title</label>
                                                    <Input
                                                        autoComplete="off"
                                                        fluid name="sub_title"
                                                        value={fr.values.sub_title}
                                                        onBlur={fr.handleBlur}
                                                        onChange={fr.handleChange}
                                                        placeholder="Enter Sub Title"
                                                        type="text"
                                                    />
                                                    <p className="input-field-error">
                                                        {fr.errors.sub_title && fr.touched.sub_title && fr.errors.sub_title}
                                                    </p>
                                                </div>
                                            </Grid.Column>
                                        </Grid>
                                        <Grid stackable columns="equal">
                                            <Grid.Column>
                                                <div className="input-field">
                                                    <label className="field-label">Category</label>
                                                    <Dropdown
                                                        fluid
                                                        placeholder="Select a Category"
                                                        selection
                                                        search
                                                        scrolling
                                                        name="category"
                                                        onClick={getCategories}
                                                        onChange={(event, { name, value }) => fr.setFieldValue(name, value)}
                                                        value={fr.values.category}
                                                        options={categories}
                                                    />
                                                </div>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <div className="input-field">
                                                    <label className="field-label">Sub Category</label>
                                                    <Dropdown
                                                        fluid
                                                        placeholder="Select a Sub Category"
                                                        selection
                                                        search
                                                        scrolling
                                                        name="sub_category"
                                                        onClick={() => getSubCategories(fr.values.category)}
                                                        onChange={(event, { name, value }) => fr.setFieldValue(name, value)}
                                                        value={fr.values.sub_category}
                                                        options={subCategories}
                                                    />
                                                </div>
                                            </Grid.Column>
                                        </Grid>
                                        <Grid stackable columns="equal">
                                            <Grid.Column>
                                                <div className="input-field">
                                                    <label className="field-label">Chapter</label>
                                                    <Dropdown
                                                        fluid
                                                        placeholder="Select a Chapter"
                                                        selection
                                                        search
                                                        scrolling
                                                        name="chapter"
                                                        onClick={getChapters}
                                                        onChange={(event, { name, value }) => fr.setFieldValue(name, value)}
                                                        value={fr.values.chapter}
                                                        options={chapters}
                                                    />
                                                </div>
                                            </Grid.Column>
                                            {
                                                query?.story_id ? null :
                                                <Grid.Column>
                                                    <div className="input-field">
                                                        <label className="field-label">Story Tags</label>
                                                        <TagSelector 
                                                            placeholder="Select Tags (Max. 4)"
                                                            setFieldValue={fr.setFieldValue}
                                                            tag_name={fr.values.tag_name}
                                                            tag_list={fr.values.tag_list}
                                                        />
                                                        <div className="tags-list">
                                                            {
                                                                fr.values.tag_list.map((tag, index) => (
                                                                    <Label color="black">
                                                                        {tag.title}
                                                                        <Icon name="delete" 
                                                                            onClick={() => removeTag(index, fr.values.tag_list, fr.setFieldValue)} 
                                                                        />
                                                                    </Label>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </Grid.Column>
                                            }
                                        </Grid>
                                        <div className="input-field editor-wrapper">
                                            <label className="field-label">Description</label>
                                            <Editor 
                                                editorState={fr.values.description}
                                                wrapperClassName="draft-wrapper" 
                                                editorClassName="draft-editor" 
                                                onEditorStateChange={(editorState) => fr.setFieldValue("description", editorState)}
                                            />
                                        </div>
                                        {
                                            query && query.story_id ?
                                            <div className="submit-btn">
                                                <Button 
                                                    loading={fr.isSubmitting}
                                                    disabled={
                                                        fr.isSubmitting || 
                                                        !fr.values.title ||
                                                        !fr.values.sub_title ||
                                                        !fr.values.description ||
                                                        !fr.values.category ||
                                                        !fr.values.sub_category
                                                    }
                                                >
                                                    Edit Story
                                                </Button>
                                            </div>
                                            :
                                            <div className="submit-btn">
                                                <Button 
                                                    loading={fr.isSubmitting}
                                                    disabled={
                                                        fr.isSubmitting || 
                                                        !fr.values.title ||
                                                        !fr.values.sub_title ||
                                                        !fr.values.description ||
                                                        !fr.values.category ||
                                                        !fr.values.sub_category ||
                                                        !fr.values.banner_img
                                                    }
                                                >
                                                    Create Story
                                                </Button>
                                            </div>    
                                        }
                                    </Form>
                                )}
                            </Formik>
                        </Segment>
                    </div>
                </div>
                <NewFooter />
                </>
            }
        </div>
    );
}

export default CreateBlog;