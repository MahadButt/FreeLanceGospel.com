import React, { useState, useContext } from "react";
import moment from "moment";
import { Link, withRouter, NavLink } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { notificationType } from "../../utils/consts";
import { Dropdown as SemanticDropdown, Icon, Image } from "semantic-ui-react";
import { Dropdown, DropdownToggle, DropdownMenu, Spinner } from 'reactstrap';
import { AuthContext } from "../../shared/context/auth-context";
import { ThemeContext } from "../../shared/context/theme-context";
import SearchComponent from "../SearchComponent/SearchComponent";
import Logo from "../../assets/white_logo2.png";
import Avatar from '../../assets/avatar.svg';
import Coin from '../../assets/quiz/silver-coin.png'
import "./NewNavBar.scss";
import { API_ROOT } from "../../utils/consts";
import NewSideBarNav from './NewSideBar/NewSideBar'

const NewNavBar = (prop) => {
    const auth = useContext(AuthContext);
    const themeContext = useContext(ThemeContext);
    const [isSideBar, setSideBar] = useState(false)
    const [isNotifPanel, setNotifPanel] = useState(false);
    const [isExtraPanel, setExtraPanel] = useState(false);
    const [isNotiMobilefPanel, setNotifMobilePanel] = useState(false);

    const toggleNotifPanel = () => setNotifPanel(prevState => !prevState);
    const toggleExtraPanel = () => setExtraPanel(prevState => !prevState);
    const toggleNotifMobilePanel = () => setNotifMobilePanel(prevState => !prevState);
    const handleSideBar = () => {
        setSideBar(!isSideBar)
    }

    const markAsRead = async (notification_id) => {
        await axios.patch(
            `/user/mark-notification/${notification_id}`,
            { status: 1 },
            { headers: { Authorization: `Bearer ${auth.user.token}` } }
        );

        auth.updateNotificationType(notification_id, notificationType.DELETE);
    }

    const handleNotificationClick = (notif_id) => {
        markAsRead(notif_id)
    }

    return (
        <div className="new-navbar-wrapper">
            <div className="left-wrapper">
                <div className="logo-wrapper">
                    <NavLink to="/">
                        <img src={Logo} alt="logo" />
                    </NavLink>
                </div>
                <div className="search-wrapper">
                    <SearchComponent />
                </div>
            </div>
            <div className="right-wrapper">
                <div className={`links-wrapper ${auth.isLoggedIn && 'wrapped-links'}`}>
                    {
                        auth.isLoggedIn &&
                        <div
                            className="link-item"

                        >
                            <Dropdown isOpen={isNotifPanel} toggle={toggleNotifPanel}>
                                <DropdownToggle>
                                    <div className="icon-wrapper">
                                        <Icon className="icon" name="bell" size="small" />
                                        {
                                            auth && auth.notifications && auth.notifications.length > 0 &&
                                            <div className="notif-badge">
                                                {auth.notifications.length}
                                            </div>
                                        }
                                    </div>
                                </DropdownToggle>
                                <DropdownMenu className="drop-down-menu">
                                    <div className="drop-down-item-wrapper">
                                        {
                                            auth && auth.notifications && auth.notifications.length > 0 ?
                                                auth.notifications.map((item, index) => (
                                                    <NavLink to={item.url} key={item.id} onClick={() => {
                                                        handleNotificationClick(item.id)
                                                        toggleNotifPanel();
                                                    }}>
                                                        <div className="drop-down-item">
                                                            <div className="avatar">
                                                                <img src={Avatar} alt="avatar" />
                                                            </div>
                                                            <div className="content">
                                                                <div className="title">
                                                                    <span className="name"></span> {item.body}.
                                                                </div>
                                                                <div className="date">{moment(item.created_at).fromNow()}</div>
                                                            </div>
                                                        </div>
                                                        <div className="marked-as-read-icon">
                                                            <div className="inner-marked"></div>
                                                        </div>
                                                    </NavLink>
                                                )) :
                                                <div className="no-notif">
                                                    No Notifications
                                                </div>
                                        }
                                        {/*
                                        notif && notif.length > 0 &&
                                        notif.map((item, index) => (
                                            <div className="drop-down-item" key={index}>
                                                <div className="avatar">
                                                    <img src={Avatar} alt="avatar"/>
                                                </div>
                                                <div className="content">
                                                    <div className="title">
                                                        <span className="name">{item.name}</span> {item.message}.
                                                    </div>
                                                    <div className="date">{item.date}</div>
                                                </div>
                                            </div>
                                        ))
                                    */}
                                    </div>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    }
                    <NavLink to="/explore" activeClassName="active-link">
                        <div className="link-item">
                            <Icon className="icon" name="book" size="small" />
                            <div className="label">Stories</div>
                        </div>
                    </NavLink>
                    <NavLink to="/forum" activeClassName="active-link">
                        <div className="link-item">
                            <Icon className="icon" name="discussions" size="small" />
                            <div className="label">Forum</div>
                        </div>
                    </NavLink>
                    {
                        auth.isLoggedIn &&
                        <>
                            <NavLink to="/users" activeClassName="active-link">
                                <div className="link-item">
                                    <Icon className="icon" name="user" size="small" />
                                    <div className="label">Users</div>
                                </div>
                            </NavLink>
                            <NavLink to="/inbox" activeClassName="active-link">
                                <div className="link-item">
                                    <Icon className="icon" name="mail" size="small" />
                                    <div className="label">Inbox</div>
                                </div>
                            </NavLink>
                        </>
                    }
                    <div
                        className="extraDiv"
                    >
                        <Dropdown isOpen={isExtraPanel} toggle={toggleExtraPanel}>
                            <DropdownToggle>
                                <div activeClassName="active-link">
                                    <div className="link-item">
                                        <Icon className="icon" name="caret down" size="big" />
                                        <div className="label">More</div>
                                    </div>
                                </div>
                            </DropdownToggle>
                            <DropdownMenu className="drop-down-menu">
                                <div className="drop-down-item-wrapper">
                                    {auth.isLoggedIn &&
                                        <NavLink to="/gospel-trivia-game" onClick={toggleExtraPanel}>
                                            <div className="link-item py-2">
                                                <Icon className="dropdown-icon" name="trophy" size="small" />
                                                <div className="dropdown-label1">Gospel Trivia Game</div>
                                            </div>
                                        </NavLink>
                                    }
                                    {/* <NavLink to="/gospel-channel" onClick={toggleExtraPanel}>
                                        <div className="link-item py-2">
                                            <Icon className="dropdown-icon" name="youtube play" size="small" />
                                            <div className="dropdown-label2">Gospel Channel</div>
                                        </div>
                                    </NavLink> */}
                                    <NavLink to="/gospel-gallery" onClick={toggleExtraPanel}>
                                        <div className="link-item py-2">
                                            <Icon className="dropdown-icon" name="images" size="small" />
                                            <div className="dropdown-label3">The Lady Elsie Mason Collections</div>
                                        </div>
                                    </NavLink>
                                    <NavLink to="/library" onClick={toggleExtraPanel}>
                                        <div className="link-item py-2">
                                            <Icon className="dropdown-icon" name="book" size="small" />
                                            <div className="dropdown-label3">Library</div>
                                        </div>
                                    </NavLink>
                                    <NavLink to="/gospel-videos" onClick={toggleExtraPanel}>
                                        <div className="link-item py-2">
                                            <Icon className="dropdown-icon" name="book" size="small" />
                                            <div className="dropdown-label3">Gospel Videos</div>
                                        </div>
                                    </NavLink>
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    {
                        auth.isLoggedIn &&
                        <div
                            className="link-item"
                            onClick={() => themeContext.inviteModalControl(true)}
                        >
                            <Icon className="icon" name="send" size="small" />
                            <div className="label">Invite</div>
                        </div>
                    }
                </div>
                {
                    auth.isLoggedIn &&
                    <div
                        className="notification-menu-for-mobile"
                    // onClick={() => themeContext.notificationModalControl(true)}
                    >
                        <Dropdown isOpen={isNotiMobilefPanel} toggle={toggleNotifMobilePanel}>
                            <DropdownToggle>
                                <div className="icon-wrapper">
                                    <Icon className="icon" name="bell" size="small" />
                                    {
                                        auth && auth.notifications && auth.notifications.length > 0 &&
                                        <div className="notif-badge">{auth.notifications.length}</div>
                                    }
                                </div>
                            </DropdownToggle>
                            <DropdownMenu right={true} className="drop-down-menu" >
                                <div className="drop-down-item-wrapper">
                                    {
                                        auth && auth.notifications && auth.notifications.length > 0 ?
                                            auth.notifications.map((item, index) => (
                                                <NavLink to={item.url} key={item.id} onClick={() => {
                                                    handleNotificationClick(item.id)
                                                    toggleNotifMobilePanel()
                                                }}>
                                                    <div className="drop-down-item">
                                                        <div className="avatar">
                                                            <img src={Avatar} alt="avatar" />
                                                        </div>
                                                        <div className="content">
                                                            <div className="title">
                                                                <span className="name"></span> {item.body}.
                                                            </div>
                                                            <div className="date">{moment(item.created_at).fromNow()}</div>
                                                        </div>
                                                    </div>
                                                    <div className="marked-as-read-icon">
                                                        <div className="inner-marked"></div>
                                                    </div>
                                                </NavLink>
                                            )) :
                                            <div className="no-notif">
                                                No Notifications
                                            </div>
                                    }
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                }
                {
                    auth.isLoggedIn ?
                        <>
                            <div className="dropdown-wrapper">
                                <SemanticDropdown item trigger={<Image avatar src={API_ROOT + auth.user.avatar_url} />} simple>
                                    <SemanticDropdown.Menu>
                                        <SemanticDropdown.Item as={Link} to={`/profile/?u_id=${auth.user.u_id}`}>
                                            <Icon name="user" />    Profile
                                        </SemanticDropdown.Item>
                                        <SemanticDropdown.Item onClick={auth.logout}>
                                            <Icon name="log out" /> Logout
                                        </SemanticDropdown.Item>
                                    </SemanticDropdown.Menu>
                                </SemanticDropdown>
                            </div>
                            <div className="rank-wrapper" id="coins-bucket">
                                <img src={Coin} alt="coin" className="rank-img" />
                                <div className="rank-coins">
                                    <div className={`count ${auth.isCoinsLoading && 'loading'}`}>
                                        {auth?.totalCoins ?? 0}
                                    </div>
                                    <div className="loader-coins">
                                        {auth.isCoinsLoading && <Spinner className="coins-spinner"/>}
                                    </div>
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div
                                className="login-btn"
                                onClick={() => {
                                    auth.authModalControl(true)
                                    auth.handleSwitchMethod("register")
                                }
                                }
                            >
                                Sign up
                            </div>
                            <div
                                className="login-btn"
                                onClick={() => {
                                    auth.authModalControl(true)
                                    auth.handleSwitchMethod("login")
                                }
                                }
                            >
                                Login
                            </div>
                        </>
                }
                <div className="hamburger-icon" onClick={handleSideBar}>
                    <Icon className="icon" name="sidebar" size="big" />
                </div>
            </div>
            <NewSideBarNav
                onClose={handleSideBar}
                isOpen={isSideBar}
            />
        </div>
    )
}

export default withRouter(NewNavBar);
