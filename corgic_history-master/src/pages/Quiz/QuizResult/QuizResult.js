import React, { useEffect, useState, useContext } from "react";
import { NavLink } from 'react-router-dom'
import Footer from "../../../components/Footer/NewFooter/NewFooter";
import "./QuizResult.scss";
import QuizLogo from '../../../assets/quiz/The-Godpel-Logo-copy.png'
import { Question_Per_Page } from '../../../utils/quiz';
import ChallengeFriendsModal from '../ChallangeFriendsModal/ChallangeFriendsModal'
import CongratulationsModal from './CongratulationsModal/CongratulationsModal'
import { AuthContext } from "../../../shared/context/auth-context";
import axios from "../../../utils/axiosInstance";
import { friendReqStatus } from "../../../utils/consts";
import Coin from '../../../assets/quiz/coin.png'
import CoinsFalling from '../../../assets/audio/coins-falling.wav'

const QuizResult = (props) => {
    const { location } = props;
    const [isChallengeFriendsModal, setChallengeFriendsModal] = useState(false);
    const [isCongratsModal, setCongratsModal] = useState(false);
    const [isCoinsFall, setIsCoinsSound] = useState(false);
    const [isCoinsDropped, setIsCoinsDropped] = useState(true);
    const [friendsList, setFriendsList] = useState([]);
    // const history = useHistory();
    const auth = useContext(AuthContext);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!props.noHeader) window.document.title = "Quiz Result | The Church Book";
        // if (location && location.score === undefined) {
        //     history.push('/gospel-trivia-game')
        // }
        const success = location && location.success ? location.success : false;
        const titleObj = location && location.titleObj ? location.titleObj : null;
        async function fetchFriendsList() {
            if (auth && auth.user && auth.user.token) {
                const { data } = await axios.get("/user/friends", {
                    headers: {
                        'Authorization': `Bearer ${auth.user.token}`
                    }
                });
                const accepted = [];
                data.forEach(friend => {
                    if (friend.status === friendReqStatus.ACCEPTED) {
                        accepted.push(friend);
                    }
                });

                setFriendsList(accepted);
            }
        }
        fetchFriendsList()
        if (success && titleObj && titleObj.image_url) {
            setCongratsModal(true)
        }
        if (success) {
            moveCoinsToBucket()
        }
    }, []);

    const moveCoinsToBucket = () => {
        let elem = document.getElementById("coins");
        let destination = document.getElementById("coins-bucket");
        let diffX = destination.getBoundingClientRect().left - elem.getBoundingClientRect().left;
        let diffY = destination.getBoundingClientRect().top - elem.getBoundingClientRect().top;
        let dx = (diffX / 10) - 3;
        let dy = diffY / 10;
        let pos = 0;
        let id = setInterval(frame, 50);
        function frame() {
            if (pos === 10) {
                clearInterval(id);
            } else {
                pos++;
                elem.style.opacity = 1;
                elem.style.top = (parseFloat(elem.style.top) || 0) + dy + 'px';
                elem.style.left = (parseFloat(elem.style.left) || 0) + dx + 'px';
            }
        }
        setTimeout(() => {
            setIsCoinsSound(true)
        }, 1300)
        setTimeout(() => {
            setIsCoinsDropped(false)
            if (auth && auth.loadCoins) {
                auth.loadCoins(auth?.user?.u_id)
            }
        }, 1500)
    }

    const handleChallengeFriendsModal = () => {
        setChallengeFriendsModal(!isChallengeFriendsModal)
    }
    const hideCongratsModal = () => {
        setCongratsModal(false)
    }

    let score = location && location.score ? location.score : 0;
    let success = location && location.success ? location.success : false;
    let titleObj = location && location.titleObj ? location.titleObj : null;
    return (
        <div className="quiz-result-page-container">
            {
                isCoinsFall &&
                <audio autoPlay hidden>
                    <source src={CoinsFalling} type="audio/mpeg" />
                </audio>
            }
            <div className="quiz-result-inner-container">
                <div className="result-wrapper">
                    <div className="logo-wrapper">
                        <img src={QuizLogo} alt="game_logo" />
                    </div>
                    <div className="result-inner-wrapper">
                        <div className="result-title">
                            {success ? 'Good Job !!!' : 'Oops !'}
                        </div>
                        {
                            !success &&
                            <div className="result-subtitle">
                                You must score min. 60 points to unlock the next level. Please Try again.
                            </div>
                        }
                        <div className="score-wrapper">
                            <div className="score">
                                Your Score: {score * 10}
                                {
                                    isCoinsDropped &&
                                    <div className="object" id="coins">
                                        <img src={Coin} className="coin-icon" alt="coin1" />
                                        <img src={Coin} className="coin-icon" alt="coin2" />
                                        <img src={Coin} className="coin-icon" alt="coin3" />
                                    </div>
                                }
                            </div>
                            <div className="score">Total Questions: {Question_Per_Page}</div>
                            {/*<div className="score">Attempted: {Question_Per_Page}</div>*/}
                        </div>
                        <div className="buttons-wrapper">
                            <div className="button-item">
                                <NavLink to="gospel-trivia-game">
                                    <button className={`go-to-quiz`}>
                                        {success ? 'See Your Rank' : 'Try Again'}
                                    </button>
                                </NavLink>
                            </div>
                            {
                                success &&
                                <div className="button-item challenge" onClick={handleChallengeFriendsModal}>
                                    <button className="challenge-btn">
                                        Challenge Friends
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            {
                isChallengeFriendsModal &&
                <ChallengeFriendsModal
                    isOpen={isChallengeFriendsModal}
                    toggle={handleChallengeFriendsModal}
                    friendsList={friendsList.length > 0 ? friendsList : []}
                />
            }
            {
                isCongratsModal &&
                <CongratulationsModal
                    isOpen={isCongratsModal}
                    toggle={hideCongratsModal}
                    titleObj={titleObj}
                />
            }
        </div>
    );
}

export default QuizResult;