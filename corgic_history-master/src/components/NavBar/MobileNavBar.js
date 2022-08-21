import React, { useContext, Fragment } from "react";
import { Sidebar, Responsive, Menu, Header, Button, Label, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../shared/context/auth-context";
import { ThemeContext } from "../../shared/context/theme-context";

import SearchComponent from "../SearchComponent/SearchComponent";

const MobileNavBar = (props) => {

    const themeContext = useContext(ThemeContext);
    const auth = useContext(AuthContext);
    
    const handleClose = () => props.setMobileNav(false);

    const handleLogout = () => {
        auth.logout();
        handleClose();
    }

    return (
        <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
            <Sidebar
                as={Menu}
                animation="overlay"
                onHide={handleClose}
                vertical
                visible={props.mobileNav}
                direction="right"
                width="wide"
            >
                <div className="SideNavBar">
                    <div onClick={handleClose} className="menu-close-icon">
                        <Icon name="close" size="large" />
                    </div>
                    <div className="SideNavBar--header">
                        <Header size="large" dividing>Menu</Header>
                    </div>

                    <div style={{ margin: "20px 0px" }}>
                        <SearchComponent />
                    </div>

                    {
                        auth.isLoggedIn &&
                        <Fragment>
                            <Menu.Item onClick={() => themeContext.notificationModalControl(true)}>
                                Notifications
                                {
                                    auth.notifications && auth.notifications.length > 0 ?
                                    <Label color="red">
                                        {auth.notifications.length}
                                    </Label> : null
                                }
                            </Menu.Item>
                            <Menu.Item as={Link} to="/new" onClick={() => handleClose()} icon="pencil" content="Create Story" />
                            <Menu.Item onClick={() => themeContext.inviteModalControl(true)} icon="send" content="Invite" />
                            <Menu.Item onClick={handleClose} as={Link} to="/inbox" icon="mail" content="Inbox" />
                        </Fragment>
                    }

                    <Menu.Item onClick={handleClose} as={Link} to="/explore" icon="book" content="Stories" />
                    <Menu.Item onClick={handleClose} as={Link} to="/forum" icon="discussions" content="Forum" />
                    
                    {
                        auth.isLoggedIn &&
                        <Fragment>
                            <Menu.Item onClick={handleClose} as={Link} to="/users" icon="user" content="Users" />
                            <Menu.Item onClick={handleClose} as={Link} to={`/profile/?u_id=${auth.user.u_id}`}>Profile</Menu.Item>
                            <Menu.Item><Button onClick={handleLogout} type="button" negative>Logout</Button></Menu.Item>
                        </Fragment>
                    }
                </div>
            </Sidebar>
        </Responsive>
    );
}

export default MobileNavBar;