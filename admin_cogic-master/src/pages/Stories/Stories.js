import React from "react";
import { Header } from "semantic-ui-react";

import "./Stories.scss";

const Stories = (props) => {

    return (
        <div className="Stories">
            <Header size="large" dividing>
                Manage Stories
            </Header>
        </div>
    );
}

export default Stories;