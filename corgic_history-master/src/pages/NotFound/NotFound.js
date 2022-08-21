import React from "react";
import { Container, Message } from "semantic-ui-react";

const NotFound = (props) => {

    return (
        <Container style={{ marginTop: "50px" }}>
            <Message
                error
                size="large"
                icon="warning sign"
                header="404 Page Not Found!"
                content="Lost? try navigating from the top navigation bar. "
            />
        </Container>
    );
}

export default NotFound;