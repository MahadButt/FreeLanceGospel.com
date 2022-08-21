import React, { useEffect, useState, useContext, Fragment } from "react";
import { Icon, Loader } from "semantic-ui-react";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import moment from "moment";
import { toast } from "react-toastify";
import { Container, Collapse, Table } from 'reactstrap'
import Footer from "../../components/Footer/NewFooter/NewFooter";
import Pagination from '../../components/Pagination/Pagination'
import { AuthContext } from "../../shared/context/auth-context";
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal'
import "./Forum.scss";
import banner2 from "../../assets/Banner_2.png";

const Forum = (props) => {

    const item_per_page = 10;
    const auth = useContext(AuthContext);
    const history = useHistory();
    const [forumData, setForumData] = useState([]);
    const [topics, setTopics] = useState([]);
    const [posts, setPosts] = useState([]);
    // const [sections, setSections] = useState([]);
    // const [forumModalOpen, setForumModalOpen] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [isLoad, setLoad] = useState(false);
    const [topicPostLoad, setTopicPostLoad] = useState(false);
    const [isLatestTopics, setLatestTopics] = useState(false);
    const [isForumSection, setForumSection] = useState(false);
    const [currentSection, setCurrentSection] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [topicPage, setTopicPage] = useState(1);
    const [topicPages, setTopicPages] = useState(1);
    const [isConfirmation, setConfirmation] = useState(false)
    const [activePost, setActivePost] = useState(null)

    const handleConfirmationModal = () => {
        setConfirmation(!isConfirmation)
    }
    const handleDelete = (confirm_status) => {
        console.log(confirm_status)
        if(confirm_status) {
          setPageLoaded(false)
          deleteStoryRequest(activePost)
        } else {
          setActivePost(null)
        }
    }

    const deleteStoryRequest = async (post) => {
      try {
          const { data } = await axios.delete(`/forum/del-post/${post.id}`, {
              headers: { 
                  Authorization: `Bearer ${auth.user.token}` 
              }
          });
          if(data && data.success) {
              getPosts();
              toast.success("Forum has been deleted Successfully !");
              setPageLoaded(true)
          } else {
              toast.error("Something went wrong, Please try again.")
              setPageLoaded(true)
          }
      } catch (err) {   
          setPageLoaded(true)
      }
  }
  const getTopicPost = async (topic,pageIndex) => {
    try {
        const { data } = await axios.get(`/forum/get-posts/${topic.id}?page=${pageIndex}&per_page=${item_per_page}`, {
            headers: { 
                Authorization: `Bearer ${auth.user.token}` 
            }
        });
        if(data && data.success) {
            setTopicPages(Math.ceil(data.count/item_per_page));
            setPosts(data.posts);
            setTopicPostLoad(true)
        } else {
            toast.error("Something went wrong, Please try again.")
            setTopicPostLoad(true)
        }
    } catch (err) {   
      setTopicPostLoad(true)
    }
}
    const handleLatestTopics = () => {
      setTopicPage(1)
      setLatestTopics(!isLatestTopics)
      setForumSection(false)
    }
    const handleForumSection = (index,topic) => {
      setForumSection(currentSection === index ? !isForumSection : true)
      setCurrentSection(index)
      setTopicPage(1)
      getTopicPost(topic,1)
      setLatestTopics(false)
    };

    // const handleClose = () => setForumModalOpen(false);

    useEffect(() => {
      window.document.title = "Forum | The Church Book";
      window.scrollTo(0, 0);
      getPosts();
    }, [page]);

    async function getPosts() {
      try {
          const { data } = await axios.get(`/forum/get-forum-home?page=${page}&per_page=${item_per_page}`);
          const topics = data.topics.map(topic => {
              return {
                  key: topic.id,
                  value: topic.id,
                  text: topic.topic_name
              }
          });
          // let sections = [];
          // data.topics.forEach(topic => {
          //     topic.sections.forEach(section => {
          //         sections.push({
          //             topic_id: section.topic_id,
          //             id: section.id,
          //             section_name: section.section_name
          //         });
          //     });
          // });
          setPages(Math.ceil(data.count/item_per_page));
          setTopics(topics);
          // setSections(sections);
          setForumData(data);
          setPageLoaded(true);
          setTimeout(()=> {
              setLoad(true)
              setLatestTopics(true)
          }, 125) 
      } catch (err) {
          // console.log(err);   
      }
    }

    const fetchIdRef = React.useRef(0)
    const onPageChange = React.useCallback((pageIndex) => {
      const fetchId = ++fetchIdRef.current
      if (fetchId === fetchIdRef.current) {
        setPage(pageIndex)
        // console.log(pageIndex)
      }
    }, [])
    const onTopicPageChange = (pageIndex,topic) => {
      setTopicPostLoad(false)
      getTopicPost(topic,pageIndex)
      setTopicPage(pageIndex)
    };
    return (
        <div className="forum-container">
            {
                !pageLoaded ? <Loader size="huge" active /> :
                <div>
                    <Container className="boot-container">
                      <div className="forum-banner">
                        <img src={banner2} alt="banner" />
                      </div>
                      <div className={`title-btn-wrapper ${isLoad && 'loaded'}`}>
                          <div className="header-title">Forums</div>
                          <div 
                              className="create-btn"
                              onClick={
                                  auth.isLoggedIn ? 
                                  () => history.push('/create-post') :
                                  // () => setForumModalOpen(true) :
                                  () => auth.authModalControl(true) 
                                  
                              } 
                          >
                              <Icon name="plus" />
                              <div className="label">Create New Post</div>
                          </div>
                      </div>
                      <div className="forum-content-wrapper">
                        <div className="content-item">
                          <div 
                            className={`content-item-title ${isLatestTopics && 'selected'}`}
                            onClick={ handleLatestTopics }
                          >
                            <div className="title">Latest Topics</div>
                            <Icon name={`chevron ${isLatestTopics ? 'up' : 'down'}`} className="icon"/>
                          </div>
                          <Collapse isOpen={isLatestTopics} className="collapse-wrapper">
                            <div className="latest-topics-wrapper">
                              {
                                forumData && forumData.posts && forumData.posts.length > 0 &&
                                  forumData.posts.map((post, index) => (
                                    <div className="latest-topic" key={"post- " + index}>
                                      <div className="latest-topic-title">
                                        <NavLink 
                                          to={`/forum-post/?post_id=${post.id}`} 
                                        >
                                          {post.title}
                                        </NavLink>
                                      </div>
                                      <div className="latest-topics-detail">
                                        <div className="views">{post.views} Views</div>
                                        <div className="replies">{post.replies} Replies</div>
                                        {
                                          post.lastReply &&
                                          <div className="last-post">
                                            <div>
                                              <span>Last Reply By: {" "}</span>
                                              <NavLink 
                                                  to={`/profile/?u_id=${post.lastReply.user.u_id}`} 
                                                  className="topic-author"
                                              >
                                                {post.lastReply.user.church_title}{" "}
                                                {post.lastReply.user.first_name}
                                              </NavLink>
                                            </div>
                                              <div className="date">
                                                  {moment(post.lastReply.created_at).fromNow()}
                                              </div>
                                          </div>
                                        }
                                        {
                                          auth?.user?.u_id === post?.u_id &&
                                          <>
                                            <div className="action edit">
                                              <Icon name="edit" className="icon" onClick={() => props.history.push(`/create-post?forum_id=${post.id}`)}/>
                                            </div>
                                            <div className="action delete" onClick={() => {
                                              handleConfirmationModal();
                                              setActivePost(post);
                                            }}>
                                              <Icon name="trash" className="icon"/>
                                            </div>
                                          </>
                                        } 
                                      </div>
                                    </div> 
                                  ))
                              }
                              <div className="custom-pagination">
                                <Pagination 
                                  pages={pages}
                                  page={page}
                                  onChangePage={onPageChange}
                                />
                              </div>
                            </div>
                          </Collapse>
                        </div>
                        {
                            forumData.topics.map((topic, index) => (
                                <div key={topic.id} className="content-item">
                                  <div 
                                    className={`content-item-title ${currentSection === index && isForumSection && 'selected'}`}
                                    onClick={ () => handleForumSection(index,topic)}
                                  >
                                    <div className="title">Forum: {topic.topic_name}</div>
                                    <Icon 
                                      name={`chevron ${currentSection === index && isForumSection ? 'up' : 'down'}`} 
                                      className="icon"
                                    />
                                  </div>
                                  <Collapse 
                                    isOpen={currentSection === index && isForumSection ? true : false} 
                                    className="collapse-wrapper"
                                  >  
                                  {posts.length>0?                                 
                                    <div className="latest-topics-wrapper">
                                    <Table responsive borderless>
                                      <tbody>
                                        {
                                          !topicPostLoad ? <tr><Loader size="huge" active /></tr>:
                                          posts.map(post => (
                                            <tr key={post.id}>
                                              <td>
                                                <div>
                                                    <NavLink 
                                                        to={`/forum-post/?post_id=${post.id}`} 
                                                        className="section-topic-title"
                                                    >
                                                        {post.title}
                                                    </NavLink>
                                                </div>
                                              </td>
                                            </tr>
                                          ))
                                        }
                                      </tbody>
                                    </Table>
                                    <div className="custom-pagination">
                                <Pagination 
                                  pages={topicPages}
                                  page={topicPage}
                                  onChangePage={(i)=>onTopicPageChange(i,topic)}
                                />
                                  </div>
                                    </div>
                                    :<h4 className="text-center mt-4">Posts not found</h4>
                                  }
                                  </Collapse>
                                </div>
                            ))
                        }
                      </div>
                    </Container>
                    <Footer />
                </div>
            }

            {/* 
                (auth.isLoggedIn && forumModalOpen) && 
                <ForumModal 
                    topics={topics}
                    sections={sections}
                    open={forumModalOpen} 
                    handleClose={handleClose} 
                /> 
            */}
            {
                isConfirmation &&
                <ConfirmationModal
                    isOpen={isConfirmation}
                    toggle={handleConfirmationModal}
                    handleDelete={handleDelete}
                    text="Are you sure to delete this Post ?"
                />
            }
        </div>


    );
}

export default Forum;