import React, { useEffect, useContext, useState } from "react";
import { Segment, Grid, Header, Icon, Loader } from "semantic-ui-react";
import axios from "../../utils/axiosInstance";

import { AuthContext } from "../../shared/context/auth-context";

import ContactMsg from "./ContactMsg";

import "./Stats.scss";

const Stats = (props) => {

    const auth = useContext(AuthContext);

    const [stats, setStats] = useState([]);
    const [pageLoaded, setPageLoaded] = useState([]);

    useEffect(() => {

        async function loadStats() {
            
            try {

                const { data } = await axios.get(
                    "/admin/stats", 
                    { headers: { Authorization: `Bearer ${auth.admin.token}` } }
                );

                setStats(data);
                setPageLoaded(true);
                
            } catch (err) {
                console.log(err);
            }
        }

        loadStats();

    }, []);

    return (
        <div className="Stats padded-content">
            <Header size="huge" dividing>
                Site Stats
            </Header>
            {
                !pageLoaded ? <Loader size="medium" active /> :
                <Grid stackable columns="3">
                    <Grid.Column>
                        <Segment>
                            <Header as="h2" size="medium">
                                <Icon name="users" />
                                <Header.Content>{stats.userCount} Users</Header.Content>
                            </Header>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Segment>
                            <Header as="h2" size="medium">
                                <Icon name="book" />
                                <Header.Content>{stats.storyCount} Stories</Header.Content>
                            </Header>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Segment>
                            <Header as="h2" size="medium">
                                <Icon name="discussions icon" />
                                <Header.Content>{stats.forumCount} Forum Posts</Header.Content>
                            </Header>
                        </Segment>
                    </Grid.Column>
                </Grid>
            }

            <div className="Stats--msg">
                <ContactMsg token={auth.admin.token} />
            </div>
        </div>
    );
}

export default Stats;