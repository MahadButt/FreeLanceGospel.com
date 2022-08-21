import React, { useState, useContext, useEffect } from "react";
import { Button, Modal } from "semantic-ui-react";

import Login from "./Login";
import Register from "./Register/Register";
import ForgotPassword from "./ForgotPassword";
import { AuthContext } from "../../shared/context/auth-context";

import "./AccountsModal.scss";

const AccountsModal = (props) => {

    const auth = useContext(AuthContext);
    const [switchMethod, setSwitchMethod] = useState("login");

    useEffect(() => {
        if (auth && auth.switchMethod) {
            setSwitchMethod(auth.switchMethod)
        }
    })
    let modalContent = null;

    const handleOpen = () => {
        auth.authModalControl(true);
    }

    const handleClose = () => {
        setSwitchMethod("login");
        auth.authModalControl(false);
    }

    if (switchMethod === "login") {
        modalContent = <Login closeModal={handleClose} switchMethod={setSwitchMethod} />;
    } else if (switchMethod === "register") {
        modalContent = <Register switchMethod={setSwitchMethod} />;
    } else {
        modalContent = <ForgotPassword switchMethod={setSwitchMethod} />;
    }

    return (
        <div className="AccountsModal">
            <Modal 
                onClose={handleClose} 
                closeIcon open={auth.authModalOpen} 
                size="small"
            >
                {modalContent}
            </Modal>
        </div>
    );
}

export default AccountsModal;