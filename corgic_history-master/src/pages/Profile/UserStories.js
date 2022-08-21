import React, { useState, useContext, Fragment } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Header, Message, Loader } from "semantic-ui-react";
import { Container, Row, Col } from "reactstrap";
import axios from "../../utils/axiosInstance";
import { AuthContext } from "../../shared/context/auth-context";

import FeedCard from "../../components/FeedCard/FeedCard";

const UserStories = (props) => {

    const auth = useContext(AuthContext);
    const [blogs, setBlogs] = useState(null);
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        loadBlogs();
    }, []);

    async function loadBlogs() {
        const { data } = await axios.get(
            `/blog/get-blog/none`,
            { headers: { Authorization: `Bearer ${auth.user.token}` } }
        );
        setBlogs(data);
        setPageLoaded(true);
    }

    const deleteStoryRequest = async (story) => {
        try {
            const { data } = await axios.delete(`/blog/del-blog/${story.id}`, {
                headers: { 
                    Authorization: `Bearer ${auth.user.token}` 
                }
            });
            if(data && data.success) {
                loadBlogs()
                setPageLoaded(true)
                toast.success("Story has been deleted Successfully !");
            } else {
                toast.error("Something went wrong, Please try again.")
                setPageLoaded(true)
            }
        } catch (err) {
            // console.log(err);  
            setPageLoaded(true) 
        }
    }

    const fetchIdRef = React.useRef(0)
    const onDeleteStory = React.useCallback((story) => {
      const fetchId = ++fetchIdRef.current
      if (fetchId === fetchIdRef.current) {
        deleteStoryRequest(story)
        setPageLoaded(false)
      }
    }, [])

    let blogJSX = null;
    let errorJSX = null;

    if (pageLoaded && blogs.length > 0) {

        blogJSX = blogs.map(blog => {
            return (
                
                <Col md="4" className="profile-stories-cols" key={blog.id}>
                    <FeedCard blog={blog} onDeleteStory={onDeleteStory}/>
                </Col>
                
            );
        });

    } else {

        errorJSX = (
            <Message>
                <Message.Header>No stories found!</Message.Header>
                <p>You haven't posted any stories yet.</p>
            </Message>
        );
    }

    return (
        <div className="profile-stories-wrapper">
            {
                !pageLoaded ? <Loader size="medium" active /> :
                    <Fragment>
                        <Header size="medium" dividing>Your Stories</Header>
                        {
                            errorJSX ? errorJSX :
                                <Container fluid>
                                    <Row>
                                        {blogJSX}
                                    </Row>
                                </Container>
                        }
                    </Fragment>
            }
        </div>
    );
}

export default UserStories;