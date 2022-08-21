import React from "react";
import { Popup, Grid, Segment } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";

import { API_ROOT } from "../../utils/consts";

import "./ForumCard.scss";

const ForumCard = (props) => {

    let { user } = props.forum;

    return (
        <div className="ForumCard">
            <Segment style={{ border: "1px solid rgba(34,36,38,.15)", padding: "0px" }}>
                <div className="ForumCard--info">
                    <Link className="ForumCard--info--title" to={`/forum/?forum_id=${props.forum.id}`}>{props.forum.title}</Link>
                    <div>
                        <Grid verticalAlign="middle">
                            <Grid.Column width={10} floated="left">
                                <div className="FeedCard--meta--name">
                                    <img style={{ width: "20px", height: "20px", borderRadius: "50%", marginRight: "10px" }} src={API_ROOT + user.avatar_url} />
                                    <Link style={{ fontSize: "12px" }} to={`/profile/?u_id=${user.u_id}`}>{`${user.first_name} ${user.last_name}`}</Link>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={6} floated="right">
                                <Popup
                                    position="bottom left"
                                    size="tiny"
                                    content={moment(props.forum.created_at).format("Do MMMM YYYY, h:mm a")}
                                    trigger={<p className="FeedCard--meta--name--date">{moment(props.forum.created_at).fromNow()}</p>}
                                />
                            </Grid.Column>
                        </Grid>
                    </div>
                </div>
            </Segment>
        </div>
    );
}

export default ForumCard;