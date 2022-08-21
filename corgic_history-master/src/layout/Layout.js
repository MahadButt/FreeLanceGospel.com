import React, { useContext, useState, Fragment } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NavBar from "../components/NavBar/NavBar";
import SideNavBar from "../components/NavBar/SideNavBar";
import MobileNavBar from "../components/NavBar/MobileNavBar";
import InviteModal from "../components/InviteModal/InviteModal";
import AccountsModal from "../components/AccountsModal/AccountsModal";

import NotificationCenter from "../components/NotificationPanel/NotificationCenter";

import { AuthContext } from "../shared/context/auth-context";
import { ThemeContext } from "../shared/context/theme-context";

import "./Layout.scss";

const Layout = (props) => {

    const auth = useContext(AuthContext);
    const themeContext = useContext(ThemeContext);

    const [visible, setVisible] = useState(false);
    const [mobileNav, setMobileNav] = useState(false);

    return (
        <div className="Layout">
            <ToastContainer  autoClose={1500} />

            {
                !auth.isLoggedIn &&
                <AccountsModal />
            }

            {
                themeContext.theme.isMobile &&
                <Fragment>
                    <SideNavBar visible={visible} setVisible={setVisible} />
                    <MobileNavBar mobileNav={mobileNav} setMobileNav={setMobileNav} />
                </Fragment>
            }

            {
                auth.isLoggedIn &&
                <Fragment>
                    <NotificationCenter />
                    <InviteModal />
                </Fragment>
            }

            <div className="Layout--navbar">
                <NavBar setVisible={setVisible} setMobileNav={setMobileNav} />
            </div>
            <main className="Layout--body">
                {props.children}
            </main>
        </div>
    );
}

export default Layout;