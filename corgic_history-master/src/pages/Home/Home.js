import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router";
import { Grid, Icon } from "semantic-ui-react";
import axios from "../../utils/axiosInstance";
import moment from "moment";
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import { Container, Row, Col, Collapse } from 'reactstrap'
import BgAudio from '../../assets/audio/home-page.mp3'
import FeedCard from "../../components/FeedCard/FeedCard";
import NewFooter from "../../components/Footer/NewFooter/NewFooter";
import NewContactUs from "../NewContactUs/NewContactUs";
import { API_ROOT } from "../../utils/consts";
import Stories from './Stories/Stories'
import Forum from './Forum/Forum'
import CongratsModal from "./CongratsModal/CongratsModal";
import AddDescriptionModal from "./AddDescriptionModal/AddDescriptionModal";
import { AuthContext } from "../../shared/context/auth-context";
import "./Home.scss";
import church from "../../assets/architecture-and-city.svg";
import cup from "../../assets/cup.svg";
import verified from "../../assets/verified.svg";
import united from "../../assets/united.svg";
import Banner_Video from '../../assets/THE CHUTCH.mp4'
import { toast } from "react-toastify";

const Home = (props) => {

    const history = useHistory();
    const auth = useContext(AuthContext);
    const { width, height } = useWindowSize()

    const [featured, setFeatured] = useState([]);
    const [forumData, setForumData] = useState([]);
    const [memberOfTheWeek, setMemberOfTheWeek] = useState(null);
    const [memberOfTheMonth, setMemberOfTheMonth] = useState(null);
    const [isMemberOfMonthToggle, setIsMemberOfMonthToggle] = useState(null);
    const [isMemberOfWeekToggle, setIsMemberOfWeekToggle] = useState(null);
    const [isCongratsModal, setIsCongratsModal] = useState(false);
    const [isAddDescriptionModal, setIsAddDescriptionModal] = useState(false);
    const [activeMember, setActiveMember] = useState(null);
    const [isConfetti, setIsConfetti] = useState(false);
    const [selectionOfMember, setSelectionOfMember] = useState(null);

    useEffect(() => {
        window.document.title = "Home | The Church Book";
        initShowcase();
    }, []);

    useEffect(() => {
        if (auth && auth.user && auth.user && auth.user.u_id && auth.user.token) {
            getMemberStatus(auth.user.u_id, auth.user.token)
        }
    }, [auth?.user])

    async function initShowcase() {
        const [blogs, memberOfTheWeek, memberOfTheMonth, forums] = await Promise.all([
            axios.get("/blog/get-blogs/50"),
            axios.get("/user/member-week"),
            axios.get("/user/member-month"),
            axios.get("/forum/get-forum-home")
        ]);
        setFeatured(blogs?.data);
        setMemberOfTheWeek(memberOfTheWeek?.data);
        setMemberOfTheMonth(memberOfTheMonth?.data);
        setForumData(forums?.data)
    }

    async function getMemberStatus(id, token) {
        try {
            const { data } = await axios.get(`/user/check_member/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (data && data.success && data.successResponse && data.successResponse.isRead === 0) {
                setSelectionOfMember(data.successResponse)
                window.scrollTo({ top: 0, behavior: 'smooth' })
                setIsCongratsModal(true)
                setIsConfetti(true)
            }
        } catch (err) {
            setIsCongratsModal(false)
            setIsConfetti(false)
        }
    }

    async function updateMemberStatus(payload, id) {
        try {
            const { data } = await axios({
                method: 'post',
                url: `/user/update-msg_read/${id}`,
                data: payload,
                headers: {
                    Authorization: `Bearer ${auth?.user?.token}`
                }
            });
            if (data && data.success) {
                setIsCongratsModal(false)
                setIsConfetti(false)
                setSelectionOfMember(null)
                initShowcase();
                if (auth && auth.user && auth.user && auth.user.u_id && auth.user.token) {
                    getMemberStatus(auth.user.u_id, auth.user.token)
                }
            } else {
                toast.error("Something went wrong, Please try again.")
                setIsCongratsModal(false)
                setIsConfetti(false)
                setSelectionOfMember(null)
            }
        } catch (err) {
            toast.error("Something went wrong, Please try again.")
            setIsCongratsModal(false)
            setIsConfetti(false)
            setSelectionOfMember(null)
        }
    }

    async function updateDescription(payload, member) {
        try {
            const { data } = await axios({
                method: 'post',
                url: `/user/update-msg_read/${member?.id}`,
                data: payload,
                headers: {
                    Authorization: `Bearer ${auth?.user?.token}`
                }
            });
            if (data && data.success) {
                toast.success("Description added successfully.")
                initShowcase();
                if (member.member_type === "month") {
                    setIsMemberOfMonthToggle(true)
                } else if (member.member_type === "week") {
                    setIsMemberOfWeekToggle(true)
                }
                setActiveMember(null)
            } else {
                toast.error("Something went wrong, Please try again.")
                setActiveMember(null)
            }
        } catch (err) {
            toast.error("Something went wrong, Please try again.")
            setActiveMember(null)
        }
    }

    let featuredJSX = null;
    if (featured.length > 0) {
        featuredJSX = featured.map(fe => {
            return (
                <Grid.Column key={fe.id}>
                    <FeedCard blog={fe} />
                </Grid.Column>
            );
        });
    }

    const handleDescriptionModal = (member) => {
        setIsAddDescriptionModal(true)
        setActiveMember(member)
    }

    const handleCloseModal = (data) => {
        if (selectionOfMember && selectionOfMember.id) {
            updateMemberStatus(data, selectionOfMember.id)
        }
    }

    const handleCloseDescriptionModal = (data, isUpdate, member) => {
        setIsAddDescriptionModal(!isAddDescriptionModal)
        if (data && isUpdate && member && member.id) {
            updateDescription(data, member)
        } else {
            setActiveMember(null)
        }
    }

    return (
        <div className="Home">
            {
                isConfetti &&
                <Confetti
                    width={width}
                    height={height}
                />
            }
            <div className="video-banner-container">
                <video muted autoPlay loop>
                    <source src={Banner_Video} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <audio autoPlay hidden>
                <source src={BgAudio} type="audio/mpeg" />
            </audio>

            <Container fluid className="home-new-layout-container">
                <Row className="new-layout-row">
                    <Col
                        xl={{ size: 3, order: 0 }}
                        lg={{ size: 12, order: 1 }}
                        xs={{ size: 12, order: 1 }}
                        className="new-layout-left-cols"
                    >
                        <Col xs="12" className="left-inner-layout-member-cols">
                            <div className="member-of-week-box">
                                <div className="title-wrapper">
                                    <img src={cup} alt="icon" />
                                    <div className="label">Member of the Week</div>
                                </div>
                                {/* <div className="custom-border"></div> */}
                                {
                                    memberOfTheWeek ?
                                        <>
                                            <div className="member-wrapper">
                                                <div className="member-pic">
                                                    <img src={API_ROOT + memberOfTheWeek?.user?.avatar_url} alt="avatar" />
                                                </div>
                                                <div className="description-wrapper">
                                                    <div className="title">
                                                        {
                                                            `${memberOfTheWeek?.user?.church_title}
                                                    ${memberOfTheWeek?.user?.first_name}
                                                    ${memberOfTheWeek?.user?.last_name}`
                                                        }
                                                    </div>
                                                    <div className="date">
                                                        {moment(memberOfTheWeek?.created_at).format("Do MMM, YYYY")}
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                memberOfTheWeek?.description ?
                                                    <div className="collapse-container">
                                                        <div className="collapse-toggle" onClick={() => setIsMemberOfWeekToggle(!isMemberOfWeekToggle)}>
                                                            <div className="collapse-label">More Details</div>
                                                            <Icon name={`chevron ${isMemberOfWeekToggle ? 'up' : 'down'}`} className="icon" />
                                                        </div>
                                                        <Collapse isOpen={isMemberOfWeekToggle} className="collapse-wrapper">
                                                            <div className="inner-collapse-box">
                                                                {memberOfTheWeek?.description}
                                                            </div>
                                                        </Collapse>
                                                    </div>
                                                    : memberOfTheWeek?.u_id === auth?.user?.u_id ?
                                                        <div className="write-detail" onClick={() => handleDescriptionModal(memberOfTheWeek)}>
                                                            <div className="write-detail-label">Write Details</div>
                                                            <Icon name='edit' className="icon" />
                                                        </div>
                                                        :
                                                        null
                                            }
                                        </>
                                        :
                                        <div className="no-data">No Data Available</div>
                                }
                            </div>
                        </Col>
                        <Col xs="12" className="left-inner-layout-stories-cols">
                            <div className="home-stories-outer-container-desktop">
                                <div className="stories-title-wrapper">Top Stories</div>
                                {
                                    featured && featured.blogs && featured.blogs.length > 0 ?
                                        <>
                                            <Stories stories={featured.blogs.slice(0, 5)} />
                                            <div className="see-more" onClick={() => history.push('/explore')}>
                                                See More
                                            </div>
                                        </>
                                        :
                                        <div className="text-center text-secondary">No Stories Available</div>
                                }
                            </div>
                        </Col>
                    </Col>
                    <Col
                        xl={{ size: 6, order: 1 }}
                        lg={{ size: 12, order: 0 }}
                        xs={{ size: 12, order: 0 }}
                        className="new-layout-center-cols"
                    >
                        <Container className="inner-center-cols">
                            <div className="church-book-box">
                                <div className="what-church-book">
                                    What is Church Book ?
                                </div>
                                <div className="custom-border"></div>
                                <div className="Home-center-title">
                                    The Church Book is a community of like minded people under the guidance of God,
                                    where everyone can share their stories and have healthy discussions.
                                </div>
                            </div>
                            <Row className="church-specialization">
                                <Col sm="6" className="church-card-cols">
                                    <div className="church-card">
                                        <img alt="img" src={church} />
                                        <div className="card-heading">
                                            Connecting Communities
                                        </div>
                                        <p>
                                            The Church Book is a platform to connect communities and share their stories
                                        </p>
                                    </div>
                                </Col>
                                <Col sm="6" className="church-card-cols">
                                    <div className="church-card">
                                        <img alt="img" src={cup} />
                                        <div className="card-heading">
                                            Recognizing Contributions
                                        </div>
                                        <p>
                                            We recongize contributions by selecting members of the week and featuring them in the site
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="church-specialization">
                                <Col sm="6" className="church-card-cols">
                                    <div className="church-card">
                                        <img alt="img" src={united} />
                                        <div className="card-heading">
                                            Make Friends & Connect
                                        </div>
                                        <p>
                                            Send friend requests to other users and connect with them via instant chat
                                        </p>
                                    </div>
                                </Col>
                                <Col sm="6" className="church-card-cols">
                                    <div className="church-card">
                                        <img alt="img" src={verified} />
                                        <div className="card-heading">
                                            Ensured Security
                                        </div>
                                        <p>
                                            We ensure security of your personal data, we'll never reveal your personal information to anyone!
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </Col >
                    <Col
                        xl={{ size: 3, order: 2 }}
                        lg={{ size: 12, order: 2 }}
                        xs={{ size: 12, order: 2 }}
                        className="new-layout-right-cols"
                    >
                        <Col xs="12" className="right-inner-layout-member-cols">
                            <div className="member-of-week-box">
                                <div className="title-wrapper">
                                    <img src={cup} alt="icon" />
                                    <div className="label">Member of the Month</div>
                                </div>
                                {/* <div className="custom-border"></div> */}
                                {
                                    memberOfTheMonth ?
                                        <>
                                            <div className="member-wrapper">
                                                <div className="member-pic">
                                                    <img src={API_ROOT + memberOfTheMonth?.user?.avatar_url} alt="avatar" />
                                                </div>
                                                <div className="description-wrapper">
                                                    <div className="title">
                                                        {
                                                            `${memberOfTheMonth?.user?.church_title}
                                                            ${memberOfTheMonth?.user?.first_name}
                                                            ${memberOfTheMonth?.user?.last_name}`
                                                        }
                                                    </div>
                                                    <div className="date">
                                                        {moment(memberOfTheMonth?.created_at).format("Do MMM, YYYY")}
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                memberOfTheMonth.description ?
                                                    <div className="collapse-container">
                                                        <div className="collapse-toggle" onClick={() => setIsMemberOfMonthToggle(!isMemberOfMonthToggle)}>
                                                            <div className="collapse-label">More Details</div>
                                                            <Icon name={`chevron ${isMemberOfMonthToggle ? 'up' : 'down'}`} className="icon" />
                                                        </div>
                                                        <Collapse isOpen={isMemberOfMonthToggle} className="collapse-wrapper">
                                                            <div className="inner-collapse-box">
                                                                {memberOfTheMonth?.description}
                                                            </div>
                                                        </Collapse>
                                                    </div>
                                                    : memberOfTheMonth?.u_id === auth?.user?.u_id ?
                                                        <div className="write-detail" onClick={() => handleDescriptionModal(memberOfTheMonth)}>
                                                            <div className="write-detail-label">Write Details</div>
                                                            <Icon name='edit' className="icon" />
                                                        </div>
                                                        :
                                                        null
                                            }
                                        </>
                                        :
                                        <div className="no-data">No Data Available</div>
                                }
                            </div>
                        </Col>
                        <Col xs="12" className="right-inner-layout-forum-cols">
                            <div className="home-forum-outer-container-desktop">
                                <div className="forum-title-wrapper">Top Topics</div>
                                {
                                    forumData && forumData.posts && forumData.posts.length > 0 ?
                                        <>
                                            <Forum forums={forumData.posts} />
                                            <div className="see-more" onClick={() => history.push('/forum')}>
                                                See More
                                            </div>
                                        </>
                                        :
                                        <div className="text-center text-secondary">No Topics Available</div>
                                }
                            </div>
                        </Col>
                    </Col>
                </Row >
            </Container>

            <div className="home-stories-outer-container">
                <div className="stories-title-wrapper">Top Stories</div>
                <div className="custom-border"></div>
                {
                    featured && featured.blogs && featured.blogs.length > 0 ?
                        <>
                            <Stories stories={featured.blogs.slice(0, 5)} />
                            <div className="see-more" onClick={() => history.push('/explore')}>
                                See More Stories
                            </div>
                        </>
                        :
                        <div className="text-center text-secondary">No Stories Available</div>
                }
            </div>

            <div className="home-forum-outer-container">
                <div className="forum-title-wrapper">Top Topics</div>
                <div className="custom-border"></div>
                {
                    forumData && forumData.posts && forumData.posts.length > 0 ?
                        <>
                            <Forum forums={forumData.posts} />
                            <div className="see-more" onClick={() => history.push('/forum')}>
                                See More Topics
                            </div>
                        </>
                        :
                        <div className="text-center text-secondary">No Topics Available</div>
                }
            </div>

            {/* <div className="home-shop-now-section">
                <div className="show-now-title">
                    <div className="title">Buy Our Products</div>
                    <div className="custom-border"></div>
                </div>
                <div className="description">To Buy our valuable products, Pleaese visit our store</div>
                <div className="shop-btn">
                    <a href="https://jonathandesverney.com/" target="_blank">Shop Now</a>
                </div>
            </div> */}
            <div className="home-footer-wrapper">
                <div className="form-contact-wrapper">
                    <NewContactUs />
                </div>
                <NewFooter />
            </div>
            {
                isCongratsModal &&
                <CongratsModal
                    isOpen={isCongratsModal}
                    toggle={handleCloseModal}
                    selection={selectionOfMember}
                />
            }
            {
                isAddDescriptionModal && activeMember &&
                <AddDescriptionModal
                    isOpen={isAddDescriptionModal}
                    toggle={handleCloseDescriptionModal}
                    active={activeMember}
                />
            }
        </div >
    );
}

export default Home;