import React, { useState, useEffect, useCallback } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader, Responsive, Icon } from "semantic-ui-react";
import jwt from 'jsonwebtoken';
import axios from 'axios';
import axiosInstance from "./utils/axiosInstance";
import Layout from "./layout/Layout";
import { AuthContext } from "./shared/context/auth-context";
import { ThemeContext } from "./shared/context/theme-context";
import { notificationType, userRoles } from "./utils/consts";
import FeedBackModal from "./components/FeedBackModal/FeedBackModal";
import './App.scss';

const Home = React.lazy(() => import("./pages/Home/Home"));
const CreateBlog = React.lazy(() => import("./pages/CreateBlog/CreateBlog"));
const Profile = React.lazy(() => import("./pages/Profile/Profile"));
const Inbox = React.lazy(() => import("./pages/Inbox/Inbox"));
const RegisterDummy = React.lazy(() => import("./pages/RegisterDummy/RegisterDummy"));
const ResetPass = React.lazy(() => import("./pages/ResetPass/resetPassword"))
const AuthRequired = React.lazy(() => import("./pages/AuthRequired/AuthRequired"));
const Explore = React.lazy(() => import("./pages/Explore/Explore"));
const ExploreChapter = React.lazy(() => import("./pages/Explore/ExploreChapter"));
const Forum = React.lazy(() => import("./pages/Forum/Forum"));
const CreatePost = React.lazy(() => import("./pages/Forum/CreatePost"));
const SectionView = React.lazy(() => import("./pages/Forum/SectionView"));
const ForumView = React.lazy(() => import("./pages/Forum/ForumView"));
const BlogView = React.lazy(() => import("./pages/BlogView/BlogView"));
const SearchPage = React.lazy(() => import("./pages/SearchPage/SearchPage"));
const UserList = React.lazy(() => import("./pages/UserList/UserList"));
const ContactUs = React.lazy(() => import("./pages/ContactUs/ContactUs"));
const Quiz = React.lazy(() => import("./pages/Quiz/Quiz"));
const QuizQuestions = React.lazy(() => import("./pages/Quiz/QuizQuestions/QuizQuestions"));
const QuizResult = React.lazy(() => import("./pages/Quiz/QuizResult/QuizResult"));
// const GospelChannel = React.lazy(() => import("./pages/Channel/Channel"));
const Library = React.lazy(() => import("./pages/Library/Library"));
const Gallery = React.lazy(() => import("./pages/Gallery/Gallery"));
const LibraryDetail = React.lazy(() => import("./pages/Library/LibraryDetail/LibraryDetail"));
const NotFound = React.lazy(() => import("./pages/NotFound/NotFound"));
const GospelVideos = React.lazy(() => import("./pages/Videos/Videos"));

const App = (props) => {

	const [filterUrl, setFilterUrl] = useState("/blog/get-blogs/10");
	const [notifications, setNotifications] = useState([]);
	const [switchMethod, setSwitchMethod] = useState();
	const [user, setUser] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [inviteModalOpen, setInviteModalOpen] = useState(false);
	const [notificationModalOpen, setNotificationModalOpen] = useState(false);
	const [totalCoins, setTotalCoins] = useState(0);
	const [isCoinsLoading, setIsCoinsLoading] = useState(false);
	const [isFeedBackModal, setFeedBackModal] = useState(false);

	const [theme, setTheme] = useState({
		isMobile: window.innerWidth <= Responsive.onlyMobile.maxWidth && window.innerWidth >= Responsive.onlyMobile.minWidth,
		isTab: window.innerWidth <= Responsive.onlyTablet.maxWidth && window.innerWidth >= Responsive.onlyTablet.minWidth,
		isComputer: window.innerWidth >= Responsive.onlyComputer.minWidth,
	});

	const authModalControl = (isOpen) => setAuthModalOpen(isOpen);
	const handleSwitchMethod = (str) => setSwitchMethod(str);
	const inviteModalControl = (isOpen) => setInviteModalOpen(isOpen);
	const notificationModalControl = (isOpen) => setNotificationModalOpen(isOpen);

	const updateNotificationType = (notification_id, notification_type) => {

		let updatedNotification = [...notifications];

		if (notification_type === notificationType.DELETE) {

			updatedNotification = updatedNotification.filter(notification => {
				if (notification.id !== notification_id) {
					return true;
				}
			});

			setNotifications(updatedNotification);

		} else {

			updatedNotification.forEach(notification => {
				if (notification.id === notification_id) {
					notification.notification_type = notification_type;
				}
			});

			setNotifications(updatedNotification);
		}
	}

	const login = useCallback((user, redirect) => {
		localStorage.setItem("user", JSON.stringify(user));
		setUser(user);
		setIsLoggedIn(true);
		setIsAdmin(user.role_id === userRoles.ADMIN);

		if (redirect) {
			props.history.push("/");
		}

	}, []);
	if (localStorage.user) {
        let jwtData = JSON.parse(localStorage.user);
        let decodeData = jwt.decode(jwtData.token);
        const expirationTime = (decodeData.exp * 1000);
        if (Date.now() >= expirationTime) {
            localStorage.removeItem("user");

			setUser(null);
			setIsLoggedIn(false);
        }
    }
	const logout = useCallback(() => {

		localStorage.removeItem("user");

		setUser(null);
		setIsLoggedIn(false);
		setAuthModalOpen(false);
		setTotalCoins(0)
		toast.error("Logged Out!");
		props.history.push("/");

	}, []);

	useEffect(() => {

		const user = JSON.parse(localStorage.getItem("user"));

		if (user && user.token) {

			login(user, false);

		} else {

			localStorage.removeItem("user");

			setUser(null);
			setIsLoggedIn(false);
		}

		setPageLoaded(true);

	}, [login]);

	useEffect(() => {

		async function fetchNotifications() {

			if (isLoggedIn) {

				const { data } = await axios.get(
					"https://thegospelpage.com/api/user/notifications",
					{ headers: { Authorization: `Bearer ${user.token}` } }
				);
				setNotifications(data);
			}
		}

		const interval = setInterval(fetchNotifications, 2000);

		return () => clearInterval(interval);

	}, [notifications, isLoggedIn]);

	useEffect(() => {
		const loggedUser = JSON.parse(localStorage.getItem('user'))
		if (loggedUser && loggedUser.u_id) {
			loadCoins(loggedUser.u_id)
		}
	}, [user])

	async function loadCoins(id) {
		setIsCoinsLoading(true)
		const { data } = await axiosInstance({
			method: "post",
			url: `quiz/get-quiz-ranking/1/10`,
			data: {
				u_id: id
			}
		})
		if (data && data.success && data.successResponse && data.successResponse.totalCoins) {
			setTotalCoins(data.successResponse.totalCoins)
			setIsCoinsLoading(false)
		} else {
			setIsCoinsLoading(false)
		}
	}

	const handleFeedBackModal = () => {
		setFeedBackModal(!isFeedBackModal)
	}

	let allowedRoutes = (
		<Switch>
			<Route path="/" exact component={Home} />
			<Route path="/register" exact component={RegisterDummy} />
			<Route path="/reset-pass" exact component={ResetPass} />
			<Route path="/explore" exact component={Explore} />
			<Route path="/explore/chapter" exact component={ExploreChapter} />
			<Route path="/forum" exact component={Forum} />
			<Route path="/create-post" exact component={CreatePost} />
			<Route path="/forum-section" exact component={SectionView} />
			<Route path="/forum-post" exact component={ForumView} />
			<Route path="/story" exact component={BlogView} />
			<Route path="/new" exact component={AuthRequired} />
			<Route path="/profile" exact component={AuthRequired} />
			<Route path="/search" exact component={SearchPage} />
			<Route path="/contact" exact component={ContactUs} />
			<Route path="/quiz" exact component={Quiz} />
			<Route path="/quiz-questions" exact component={QuizQuestions} />
			<Route path="/quiz-result" exact component={QuizResult} />
			{/* <Route path="/gospel-channel" exact component={GospelChannel} /> */}
			<Route path="/library" exact component={Library} />
			<Route path="/library-detail" exact component={LibraryDetail} />
			<Route path="/gospel-gallery" exact component={Gallery} />
			<Route path="/gospel-videos" exact component={GospelVideos} />
			<Route path="*" exact component={NotFound} />
		</Switch>
	);

	if (isLoggedIn) {

		allowedRoutes = (
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/new" exact component={CreateBlog} />
				<Route path="/explore" exact component={Explore} />
				<Route path="/explore/chapter" exact component={ExploreChapter} />
				<Route path="/story" exact component={BlogView} />
				<Route path="/forum" exact component={Forum} />
				<Route path="/create-post" exact component={CreatePost} />
				<Route path="/forum-section" exact component={SectionView} />
				<Route path="/forum-post" exact component={ForumView} />
				<Route path="/inbox" component={Inbox} />
				<Route path="/profile" exact component={Profile} />
				<Route path="/search" exact component={SearchPage} />
				<Route path="/users" exact component={UserList} />
				<Route path="/contact" exact component={ContactUs} />
				<Route path="/gospel-trivia-game" exact component={Quiz} />
				<Route path="/game-questions" exact component={QuizQuestions} />
				<Route path="/game-result" exact component={QuizResult} />
				{/* <Route path="/gospel-channel" exact component={GospelChannel} /> */}
				<Route path="/library" exact component={Library} />
				<Route path="/library-detail" exact component={LibraryDetail} />
				<Route path="/gospel-gallery" exact component={Gallery} />
				<Route path="/gospel-videos" exact component={GospelVideos} />
				<Route path="*" exact component={NotFound} />
			</Switch>
		);
	}

	return (
		<AuthContext.Provider
			value={{
				filterUrl,
				setFilterUrl,
				authModalOpen,
				switchMethod,
				authModalControl,
				handleSwitchMethod,
				isLoggedIn,
				isAdmin,
				user,
				login,
				logout,
				notifications,
				updateNotificationType,
				totalCoins,
				loadCoins,
				isCoinsLoading
			}}
		>
			<ThemeContext.Provider
				value={{
					theme,
					inviteModalOpen,
					notificationModalOpen,
					inviteModalControl,
					notificationModalControl,
				}}
			>
				<Layout>
					<React.Suspense fallback={<Loader size="massive" active />}>
						{!pageLoaded ? <Loader active /> : allowedRoutes}
					</React.Suspense>
					<div className="feedback-panel-wrapper" onClick={handleFeedBackModal}>
						<Icon name="paper plane" className="icon" />
						<div className="label">Feedback</div>
					</div>
				</Layout>
				{
					isFeedBackModal &&
					<FeedBackModal
						isOpen={isFeedBackModal}
						toggle={handleFeedBackModal}
					/>
				}
			</ThemeContext.Provider>
		</AuthContext.Provider>
	);
}

export default withRouter(App);