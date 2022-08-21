import React, { useContext } from "react";
import { Grid } from "semantic-ui-react";
import { ToastContainer } from "react-toastify";
import { withRouter } from "react-router";

import Navbar from "../components/Navbar/Navbar";

import { AuthContext } from "../shared/context/auth-context";

import "react-toastify/dist/ReactToastify.css";
import "./Layout.scss";

const Layout = (props) => {

    const auth = useContext(AuthContext);

    return (
        <div className="Layout">
            <ToastContainer  autoClose={1500} />

            <Grid>
                <Grid.Column width="3">
                    {
                        auth.isLoggedIn &&
                        <div className="Layout--navbar">
                            <Navbar />
                        </div>
                    }
                </Grid.Column>
                <Grid.Column width={auth.isLoggedIn ? "13" : "16"}>
                    <main className="Layout--body">
                        {props.children}
                    </main>
                </Grid.Column>
            </Grid>
            

        </div>
    );
}

export default withRouter(Layout);