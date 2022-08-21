import React, {useContext} from 'react';
import { Icon } from "semantic-ui-react";
import { 
    NavLink 
} from "react-router-dom";
import SearchComponent from "../../SearchComponent/SearchComponent";
import { AuthContext } from "../../../shared/context/auth-context";
import { ThemeContext } from "../../../shared/context/theme-context";
import './NewSideBar.scss';

const NewSideBar = (props) => {
	const auth = useContext(AuthContext);
    const themeContext = useContext(ThemeContext);
    const handleLogout = () => {
        auth.logout();
        props.onClose();
    }
    return (
        <div className={`new-sidebar-nav ${props.isOpen && 'open-sidebar'}`}>
        	<div className="header">
        		<div className="avatar" onClick={() => props.onClose()}>
              <NavLink to={`/profile/?u_id=${auth.user && auth.user.u_id}`}><Icon className="icon" name="user" size="large" /></NavLink>
        		</div>
        		<Icon className="icon" name="times" size="large" onClick={()=> props.onClose()}/>
        	</div>
        	<div className="search-component">
        		<SearchComponent />
        	</div>
        	<div className="links-wrapper">
                    <NavLink to="/explore">
                        <div className="link-item" onClick={()=> props.onClose()}>
                            <Icon className="icon" name="book" size="small" />
                            <div className="label">Stories</div>
                        </div>
                    </NavLink>
                    <NavLink to="/forum">
                        <div className="link-item" onClick={()=> props.onClose()}>
                            <Icon className="icon" name="discussions" size="small" />
                            <div className="label">Forum</div>
                        </div>
                    </NavLink>
                    {
                        auth.isLoggedIn &&
                        <>
                            {/*<div 
                                className="link-item" onClick={()=> props.onClose()}
                                onClick={() => themeContext.notificationModalControl(true)}
                            >
                                <Icon className="icon" name="bell" size="small" />
                                <div className="label">Notifications</div>
                            </div>*/}
                            <NavLink to="/users">
                                <div className="link-item" onClick={()=> props.onClose()}>
                                    <Icon className="icon" name="user" size="small" />
                                    <div className="label">Users</div>
                                </div>
                            </NavLink>
                            <NavLink to="/inbox">
                                <div className="link-item" onClick={()=> props.onClose()}>
                                    <Icon className="icon" name="mail" size="small" />
                                    <div className="label">Inbox</div>
                                </div>
                            </NavLink>
                            <div 
                                className="link-item" onClick={()=> props.onClose()}
                                onClick={() => themeContext.inviteModalControl(true)}
                            >
                                <Icon className="icon" name="send" size="small" />
                                <div className="label">Invite</div>
                            </div>
                            <NavLink to="/gospel-trivia-game">
                                <div className="link-item" onClick={()=> props.onClose()}>
                                    <Icon className="icon" name="trophy" size="small" />
                                    <div className="label">Gospel Trivia Game</div>
                                </div>
                            </NavLink>
                        </>
                    }
                    {/* <NavLink to="/gospel-channel">
                        <div className="link-item" onClick={()=> props.onClose()}>
                            <Icon className="icon" name="youtube play" size="small" />
                            <div className="label">Gospel Channel</div>
                        </div>
                    </NavLink> */}
                    <NavLink to="/gospel-gallery">
                        <div className="link-item" onClick={()=> props.onClose()}>
                            <Icon className="icon" name="images" size="small" />
                            <div className="label">The Lady Elsie Mason Collections</div>
                        </div>
                    </NavLink>
                    <NavLink to="/library">
                        <div className="link-item" onClick={()=> props.onClose()}>
                            <Icon className="icon" name="book" size="small" />
                            <div className="label">Library</div>
                        </div>
                    </NavLink>
                    <NavLink to="/gospel-videos">
                        <div className="link-item" onClick={()=> props.onClose()}>
                            <Icon className="icon" name="book" size="small" />
                            <div className="label">Gospel Videos</div>
                        </div>
                    </NavLink>
                </div>
                {
                    auth.isLoggedIn &&
                   	<div 
                        className="logout-btn" 
                        onClick={handleLogout}
                    >
                        Logout
                    </div>
                }
        </div>
    );
};

export default NewSideBar;
