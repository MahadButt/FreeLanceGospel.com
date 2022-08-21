import React from "react";
import { Link } from "react-router-dom";
import { Grid, Segment, Header, Button, Icon, Container, List } from "semantic-ui-react";
import './Footer.scss'

const Footer = (props) => {

    return (
        <div className="footer-wrapper">
            <Segment inverted vertical style={{ padding: "3em 0em", background: '#23094a'}}>
                <Container>
                    <Grid divided inverted stackable>
                        <Grid.Row>
                            <Grid.Column width={5}>
                                <Header inverted as="h5" content="Contact" />
                                <List link inverted>
                                    {/* <List.Item>
                                        <List.Icon name="address card" />
                                        <List.Content>
                                            Los Angeles, California
                                        </List.Content>
                                    </List.Item> */}
                                    <List.Item>
                                        <List.Icon name="mail" />
                                        <List.Content style={{color: 'lightgray'}}>
                                            jonathandesverney@yahoo.com
                                        </List.Content>
                                    </List.Item>
                                    {/* <List.Item>
                                        <List.Icon name="phone" />
                                        <List.Content>
                                            01833975394
                                        </List.Content>
                                    </List.Item> */}
                                </List>
                            </Grid.Column>
                            {/* <Grid.Column width={3}>
                                <Header inverted as="h4" content="Quick Links" />
                                <List link inverted>
                                    <List.Item as={Link} to="/explore">Explore</List.Item>
                                    <List.Item as={Link} to="/faq">FAQ</List.Item>
                                    <List.Item as={Link} to="/terms">Terms & Conditions</List.Item>
                                    <List.Item as={Link} to="/privacy">Privacy Policy</List.Item>
                                </List>
                            </Grid.Column> */}
                            <Grid.Column width={6}>
                                <Header as="h4" inverted>
                                    Contact Us
                                </Header>
                                <Button
                                    as={Link}
                                    to="/contact"
                                    style={{ fontWeight: "normal" }}
                                    primary
                                    icon labelPosition="right"
                                    size="medium"
                                >
                                    Contact Us
                                <Icon name="phone" />
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Segment>
        </div>
    );
}

export default Footer;