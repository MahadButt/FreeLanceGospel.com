import React, { useContext } from "react";
import { Card, Grid, Message, Header, Loader } from "semantic-ui-react";
import axios from "../../utils/axiosInstance";
import { Link } from "react-router-dom";

import { ThemeContext } from "../../shared/context/theme-context";
import { API_ROOT } from "../../utils/consts";

const FriendsList = (props) => {

    const themeContext = useContext(ThemeContext);

    const { friends } = props;

    let friendJSX = null;
    let errorJSX = null;

    if (friends.length > 0) {

        friendJSX = friends.map(({ friend }) => {
            return (
                <Grid.Column key={friend.u_id}>
                    <Card style={{ marginBottom: "20px" }} color="teal">
                        <Card.Content>
                            <div className="friends-tab">
                                <div>
                                    <img src={API_ROOT + friend.avatar_url} className="user-avatar" alt="user-avatar" />
                                </div>
                                <Link target="_blank" to={`/profile/?u_id=${friend.u_id}`} className="user-link">
                                    {`${friend.first_name} ${friend.last_name}`}
                                </Link>
                            </div>
                        </Card.Content>
                    </Card>
                </Grid.Column>
            );
        });

    } else {

        errorJSX = (
            <Message>
                <Message.Header>No friends found!</Message.Header>
                <p>You haven't made any friends yet.</p>
            </Message>
        );
    }

    return (
        <div className="FriendsList">
            {
                errorJSX ? errorJSX :
                <Grid>
                    <Grid.Row columns={themeContext.theme.isMobile ? 1 : 3}>
                        {friendJSX}
                    </Grid.Row>
                </Grid>
            }
        </div>
    );
}

export default FriendsList;