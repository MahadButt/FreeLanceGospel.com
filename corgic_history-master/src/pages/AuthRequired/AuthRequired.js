import React from "react";
import { Message, Container } from "semantic-ui-react";

const AuthRequired = (props) => {
    return (
        <div className="AuthRequired">
            <Container>
                <Message
                    error
                    size="large"
                    header="Authorization Required"
                    list={[
                        "You must be logged in to execute this action.",
                        "If you already have an account then login, or create an account here.",
                    ]}
                />
            </Container>
        </div>
    );
}

export default AuthRequired;