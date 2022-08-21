import React, { useEffect, useState, useContext } from "react";
import { useHistory } from 'react-router-dom'
import { toast } from "react-toastify";
import { Container, Row, Col } from 'reactstrap'
import { Icon, Popup } from "semantic-ui-react";
import Footer from "../../components/Footer/NewFooter/NewFooter";
import "./Quiz.scss";
import Avatar from "../../assets/avatar.svg";
import axios from "../../utils/axiosInstance";
import QuizLogo from '../../assets/quiz/The-Godpel-Logo-copy.png'
import Coin from '../../assets/quiz/coin.png'
import { AuthContext } from "../../shared/context/auth-context";
import { API_ROOT } from '../../utils/consts'

const Quiz = (props) => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const [isLoaded, setLoaded] = useState(false)
    const [ranking, setRanking] = useState([])
    const [categories, setCategories] = useState('')
    const [category, setActiveCategory] = useState(null);
    const [quizLevels, setQuizLevels] = useState(null);

    const levels = category ? category : '';

    useEffect(() => {
        if (!props.noHeader) window.document.title = "Gospel Trivia Game | The Church Book";
        window.scrollTo(0, 0);

        if (history?.location?.challengeStatus) {
            if (history.location.challengeStatus.success) {
                toast.success("Challenge sent Successfully.")
            } else {
                toast.error("Something went wrong, Challenge not sent.")
            }
        }

        // if (localStorage.getItem('quiz-level')) {
        //     let quiz_level = JSON.parse(localStorage.getItem('quiz-level'))
        //     if (quiz_level && quiz_level.active > 0 && quiz_level.level ) {
        //         history.push(`/game-questions?level=${quiz_level.level}`)
        //     }
        // }
        async function loadRanking() {
            const { data } = await axios.post(`quiz/get-quiz-ranking/1/10`)
            if (data && data.success && data.successResponse && data.successResponse.length > 0) {
                setRanking(data.successResponse)
            } else {
                setRanking([])
            }
        }
        async function loadCategories() {
            // const { data } = await axios.get(`quiz/get-unlock-level/${auth.user.u_id}`)
            const { data } = await axios.get(`quiz/get_categories`, {
                headers: {
                    Authorization: `Bearer ${auth.user.token}`
                }
            })
            if (data && data.success && data.successResponse) {
                setCategories(data.successResponse)
            }
        }
        loadRanking();
        loadCategories();
        setLoaded(true)
    }, []);

    const handleLevelPath = (index) => {
        if ((levels.quiz_level === index + 1) && levels.level_unlock === 0) {
            history.push(`game-questions?level=${index + 1}&category=${category.category_id}`)
        }
        else if (index <= levels.quiz_level && levels.level_unlock) {
            history.push(`game-questions?level=${index + 1}&category=${category.category_id}`)
        } else {
            return;
        }
    }

    const handleActiveCategory = (category) => {
        let activeCatLevels = Math.ceil(category.no_of_questions / 10);
        setQuizLevels(activeCatLevels)
        setActiveCategory(category)
    }


    return (
        <div className="quiz-page-container">
            <div className="quiz-inner-container">
                <Container fluid>
                    <Row>
                        <Col md="6" lg="6" xl="5" className="ranking-list-wrapper">
                            <div className="ranking-title">
                                Ranking
                            </div>
                            <div className="list-wrapper">
                                {
                                    ranking && ranking.length > 0 &&
                                    ranking.map((item, index) => (
                                        <div className="list-item" key={'rank-key' + index}>
                                            <div className="profile-wrapper">
                                                {
                                                    item.user && item.user.avatar_url ?
                                                        <img src={API_ROOT + item.user.avatar_url} alt="avatar" className="avatar" />
                                                        :
                                                        <img src={Avatar} alt="avatar" className="avatar" />
                                                }
                                            </div>
                                            <div className="detail-wrapper">
                                                <div className="name-coins-wrapper">
                                                    <div className="name">
                                                        {item && item.user && item.user.first_name && item.user.first_name} {" "}
                                                        {item && item.user && item.user.last_name && item.user.last_name}
                                                    </div>
                                                    <div className="coins">
                                                        <div className="label">{item.totalCoins && item.totalCoins}</div>
                                                        <img src={Coin} className="coin-icon" alt="coin" />
                                                    </div>
                                                </div>
                                                {
                                                    item && item.titles && item.titles.length > 0 &&
                                                    item.titles.map((obj, index) => (
                                                        <div className="category-rank-wrapper" key={'title-index- ' + index}>
                                                            <div className="name">
                                                                {obj?.category?.name ?? ""}
                                                            </div>
                                                            <div className="rank">
                                                                {
                                                                    obj?.title?.image_url &&
                                                                    <Popup
                                                                        content={obj?.title?.name ?? "Your Badge"}
                                                                        trigger={
                                                                            <img
                                                                                src={API_ROOT + obj.title.image_url}
                                                                                className="rank-icon"
                                                                                alt="rank"
                                                                            />
                                                                        }
                                                                    />
                                                                }
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </Col>
                        <Col md="1" lg="1" xl="1" className={`vertical-line ${isLoaded && 'loaded'}`}>
                            <div className="line"></div>
                        </Col>
                        <Col md="5" lg="5" xl="6" className="get-started-wrapper">
                            <div className="title-wrapper">
                                <div className="title">Gospel Trivia Game</div>
                                <div className={`custom-border ${isLoaded && 'loaded'}`}></div>
                            </div>
                            {/* <div className="sub-title">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.
                            </div> */}
                            <div className="quiz-logo">
                                <img src={QuizLogo} alt="quiz-logo" />
                            </div>
                            <div className="quiz-categories-wrapper">
                                {
                                    categories && categories.length > 0 && category === null &&
                                    categories.map((item, index) => {
                                        return (
                                            <div
                                                onClick={() => handleActiveCategory(item)}
                                                key={'ind -' + index}
                                                className={`category-block`}
                                            >
                                                <div className="category-label">{item?.category_name}</div>
                                                <Icon
                                                    name={`caret down`}
                                                    className="icon"
                                                />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="quiz-levels-wrapper">
                                {
                                    levels && quizLevels &&
                                    <>
                                        <div className="levels-top-bar">
                                            <div className="cat-label">{category?.category_name ?? ''}</div>
                                            <Icon
                                                onClick={() => {
                                                    setActiveCategory(null)
                                                    setQuizLevels(null)
                                                }}
                                                name="times circle"
                                                className="icon"
                                            />
                                        </div>
                                        {
                                            [...Array(quizLevels)].map((item, index) => {
                                                return (
                                                    <div
                                                        onClick={() => handleLevelPath(index)}
                                                        key={'ind -' + index}
                                                        className={`level-block 
                                                            ${((levels.quiz_level === index + 1) && (levels.level_unlock === 0)) ?
                                                                'unlock' :
                                                                index === levels.quiz_level && levels.level_unlock > 0 ?
                                                                    'unlock' :
                                                                    index + 1 > levels.quiz_level ?
                                                                        'lock' :
                                                                        'unlock'
                                                            }
                                                        `}
                                                    >
                                                        <div className="level-label">Level {index + 1}</div>
                                                        <Icon
                                                            // name={`${index + 1 > levels.quiz_level ? 'lock' : 'unlock'}`}
                                                            name={`
                                                                ${((levels.quiz_level === index + 1) && (levels.level_unlock === 0))
                                                                    ?
                                                                    'lock' :
                                                                    index + 1 > levels.quiz_level ?
                                                                        'lock' :
                                                                        'unlock'
                                                                }
                                                            `}
                                                            className="icon"
                                                        />
                                                    </div>
                                                )
                                            })
                                        }
                                    </>
                                }
                            </div>
                            {/*<NavLink to="game-questions" className="quiz-link">
                                <button className="get-started-btn">GET STARTED</button>
                            </NavLink>*/}
                        </Col>

                    </Row>
                </Container>
            </div>
            <Footer />
        </div>
    );
}

export default Quiz;