import React, { useState, useEffect, useContext } from "react";
import { useHistory } from 'react-router-dom';
import { Loader } from "semantic-ui-react";
import qs from "query-string";
import Footer from "../../../components/Footer/NewFooter/NewFooter";
import {
    // Quiz_Questions as AllQuestions, 
    Question_Per_Page
} from '../../../utils/quiz';
import QuizLogo from '../../../assets/quiz/The-Godpel-Logo-copy.png'
import { AuthContext } from "../../../shared/context/auth-context";
import { toast } from "react-toastify";
import axios from "../../../utils/axiosInstance";
//levels Background Audios
import BgAudio from '../../../assets/audio/God-Is-The-Answermixed.MP3'
import levelTwoBgAudio from '../../../assets/audio/level-2.mp3'
import levelFourBgAudio from '../../../assets/audio/level-4.mp3'
import levelFiveBgAudio from '../../../assets/audio/level-5.wav'
import levelOneNineBgAudio from '../../../assets/audio/level1-9.mp3'
import levelThreeBgAudio from '../../../assets/audio/level3.mp3'
import levelSevenBgAudio from '../../../assets/audio/level7.mp3'
import levelTenBgAudio from '../../../assets/audio/level-10.wav'
import "./QuizQuestions.scss";

const timeLimit = 10;

const QuizQuestions = (props) => {
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [error, setError] = useState(false);
    const [isCompleted, setCompleted] = useState(false);
    const [isLoaded, setLoaded] = useState(false);
    const [Quiz_Questions, setQuizQuestions] = useState([]);
    const [countDown, setCountDown] = useState(timeLimit);

    const history = useHistory();
    const auth = useContext(AuthContext);

    const level = qs.parse(props.location.search).level;
    const category_id = qs.parse(props.location.search).category;

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!props.noHeader) window.document.title = "Quiz Questions | The Church Book";
        fetchQuizQuestions()
    }, []);

    const fetchQuizQuestions = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.token && category_id) {
            const { data } = await axios.get(
                `/quiz/get_questions/${category_id}`,
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            if (data && data.success && data.successResponse.length) {
                setQuizQuestions(data.successResponse)
                if (level && level > 0) {
                    loadQuizQuestions(data.successResponse)
                }
                // let quiz_level;
                // if (localStorage.getItem('quiz-level')) {
                //     quiz_level = JSON.parse(localStorage.getItem('quiz-level'))
                // }
                // if (quiz_level) {
                //     setActiveQuestion(quiz_level.active)
                //     setScore(quiz_level.score)
                // } else {
                //     setActiveQuestion(0)
                //     setScore(0)
                // }
                setActiveQuestion(0)
                //     setScore(0)
                setLoaded(true)
            } else {
                // localStorage.removeItem('quiz-level')
                history.push('/gospel-trivia-game')
            }
        }
    }

    useEffect(() => {
        if (!isLoaded) return;
        let timer;
        if (countDown > 0) {
            timer = setTimeout(() => {
                setCountDown(countDown - 1)
            }, 1000)
        } else {
            if (activeQuestion + 1 < Quiz_Questions.length) {
                let quiz = {
                    active: activeQuestion + 1,
                    score: score,
                    level: Number(level)
                }
                // localStorage.setItem(`quiz-level`, JSON.stringify(quiz))
                setActiveQuestion(activeQuestion + 1)
                setCountDown(timeLimit)
            } else if (activeQuestion + 1 === Quiz_Questions.length) {
                setCompleted(true)
                // history.push({
                //     pathname:'quiz-result',
                //     score: selectedAnswer && selectedAnswer.is_correct ? score + 1 : score 
                // })
                // localStorage.removeItem('quiz')
            }
        }
        return () => clearInterval(timer);
    }, [countDown, isLoaded])

    // const countDownTimer = () => {
    // }


    const loadQuizQuestions = (data) => {
        let start = ((level - 1) * (Question_Per_Page)) // 1 => 1-1 * 10
        let end = (level * Question_Per_Page)      // 1 * 10 === (0,10)
        let split_questions = data.slice(start, end).map((item) => {
            return item;
        })
        setQuizQuestions(split_questions)
    }

    const handleChangeOption = (obj) => {
        setSelectedAnswer(obj)
        setError(false)
    }
    const handleNext = () => {
        setCountDown(timeLimit)
        if (selectedAnswer && selectedAnswer.is_correct === "true") {
            setScore(score + 1)
        }
        if (activeQuestion + 1 < Quiz_Questions.length) {
            if (selectedAnswer) {
                let quiz = {
                    active: activeQuestion + 1,
                    score: score,
                    level: Number(level)
                }
                // localStorage.setItem(`quiz-level`, JSON.stringify(quiz))
                // localStorage.setItem(`quiz-level-${level}`, JSON.stringify(quiz))
                setActiveQuestion(activeQuestion + 1)
                setSelectedAnswer('')
            } else {
                setError(true)
            }
        } else if (activeQuestion + 1 === Quiz_Questions.length) {
            if (!selectedAnswer) {
                setError(true)
            } else {
                setCompleted(true)
                // history.push({
                //     pathname:'quiz-result',
                //     score: selectedAnswer && selectedAnswer.is_correct ? score + 1 : score 
                // })
                // localStorage.removeItem('quiz')
            }
        }
    }

    const handleSubmit = async () => {
        let payload = {
            totalQuestions: Quiz_Questions.length,
            correctAnswers: score,
            quizId: 1,
            userId: auth.user.u_id,
            quizLevel: Number(level),
            totalCoins: score * 10,
            // levelUnlock: Number(level),
            levelUnlock: 1,
            categoryId: Number(category_id)
        }
        if (score && score >= 6) {
            const { data } = await axios({
                method: "post",
                url: "/quiz/submit-result",
                data: payload,
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${auth.user.token}`
                },
                // onUploadProgress: progressEvent => console.log(progressEvent.loaded)
            });
            if (data.success) {
                history.push({
                    pathname: 'game-result',
                    score: score,
                    success: true,
                    titleObj: data?.title ?? null
                })
                // localStorage.removeItem('quiz-level')
            } else {
                toast.error("Error Occured while submitting, Please try again");
            }
        } else {
            // localStorage.removeItem('quiz-level')
            history.push({
                pathname: 'game-result',
                score: score,
                success: false
            })
        }


    }
    return (
        <div className="quiz-questions-page-container">
            {
                !isLoaded ? <Loader size="massive" active /> :
                    <>
                        {level == 1 ?
                            <audio autoPlay hidden>
                                <source src={levelOneNineBgAudio} type="audio/mpeg" />
                            </audio>
                            :
                            level == 2 ?
                                <audio autoPlay hidden>
                                    <source src={levelTwoBgAudio} type="audio/mpeg" />
                                </audio>
                                : level == 3 ?
                                    <audio autoPlay hidden>
                                        <source src={levelThreeBgAudio} type="audio/mpeg" />
                                    </audio>
                                    : level == 4 ?
                                        <audio autoPlay hidden>
                                            <source src={levelFourBgAudio} type="audio/mpeg" />
                                        </audio>
                                        : level == 5 ?
                                            <audio autoPlay hidden>
                                                <source src={levelFiveBgAudio} type="audio/wav" />
                                            </audio>
                                            : level == 7 ?
                                                <audio autoPlay hidden>
                                                    <source src={levelSevenBgAudio} type="audio/mpeg" />
                                                </audio>
                                                : level == 9 ?
                                                    <audio autoPlay hidden>
                                                        <source src={levelOneNineBgAudio} type="audio/wav" />
                                                    </audio>
                                                    : level == 10 ?
                                                        <audio autoPlay loop hidden>
                                                            <source src={levelTenBgAudio} type="audio/wav" />
                                                        </audio>
                                                        :
                                                        <audio autoPlay hidden>
                                                            <source src={BgAudio} type="audio/mpeg" />
                                                        </audio>
                        }
                        <div className="quiz-questions-inner-container">
                            <div className="top-layer">
                                {
                                    !isCompleted &&
                                    <div className="count-down">
                                        {countDown} <span className="timer-label">Seconds Remaining</span>
                                    </div>
                                }
                            </div>
                            <div className={`questions-wrapper ${isCompleted && 'completed'}`}>
                                {
                                    !isCompleted ?
                                        <>
                                            <div className="logo-wrapper">
                                                <img src={QuizLogo} alt="game_logo" />
                                            </div>
                                            <div className="question">
                                                {
                                                    activeQuestion < Quiz_Questions.length &&
                                                    Quiz_Questions[activeQuestion].question
                                                }
                                            </div>
                                            <div className="choices-box">
                                                {
                                                    activeQuestion < Quiz_Questions.length &&
                                                    Quiz_Questions[activeQuestion].options.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className={`choice-item ${selectedAnswer && selectedAnswer.option === item.option && 'active'}`}
                                                            onClick={() => handleChangeOption(item, index)}
                                                        >
                                                            <div className="choice">{item.option}</div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            {
                                                error && <div className="error">Please Select an Answer.</div>
                                            }
                                            <div className="button-wrapper">
                                                <button
                                                    onClick={handleNext}
                                                    className={`next-btn ${selectedAnswer && 'selected'}`}
                                                >
                                                    Next
                                                </button>
                                            </div>
                                            <div className="question-number">
                                                Question {activeQuestion + 1}/{Quiz_Questions.length}
                                            </div>
                                        </>
                                        :
                                        <div className="completed-wrapper">
                                            <div className="completed-title">
                                                Completed Successfully !!!
                                            </div>
                                            <div className="completed-sub-title">
                                                Please click on the below button to submit your quiz.
                                            </div>
                                            <div className="quiz-banner">
                                                <img src={QuizLogo} alt="quiz-banner" />
                                            </div>
                                            <div className="submit-btn-wrapper">
                                                <button
                                                    onClick={handleSubmit}
                                                    className={`submit`}
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>
                        <Footer />
                    </>
            }
        </div>
    );
}

export default QuizQuestions;