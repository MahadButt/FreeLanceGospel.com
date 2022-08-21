import React from "react";
import { NavLink } from "react-router-dom";
import { Container, Row, Col } from 'reactstrap';
import { Icon } from "semantic-ui-react";
import './NewFooter.scss'

const NewFooter = (props) => {

    return (
        <div className="new-footer-wrapper">
            <Container>
                <Row>
                    <Col sm="4">
                        <div className="email-wrapper">
                            <div className="label">Contact Us</div>
                            <div className="email">jonathandesverney@yahoo.com</div>
                        </div>
                    </Col>
                    <Col sm="4">
                        <div className="links-wrapper">
                            <div className="label">Useful Links</div>
                            <div className="links">
                                <NavLink to="/explore">
                                    <div className="link-item">
                                        <Icon className="icon" name="book" />
                                        <div className="link">Stories</div>
                                    </div>
                                </NavLink>
                                <NavLink to="/forum">
                                    <div className="link-item">
                                        <Icon className="icon" name="discussions" />
                                        <div className="link">Forum</div>
                                    </div>
                                </NavLink>
                                <NavLink to="/contact">
                                    <div className="link-item">
                                        <Icon className="icon" name="send" />
                                        <div className="link">Contact</div>
                                    </div>
                                </NavLink>
                            </div>
                        </div>
                    </Col>
                    <Col sm="4">
                        <div className="social-icons-wrapper">
                            <div className="label">Social Links</div>
                            <div className="social-icons">
                                <Icon className="icon" name="facebook f" size="large"/>
                                <Icon className="icon" name="youtube play" size="large"/>
                                <Icon className="icon" name="whatsapp" size="large"v/>
                                <Icon className="icon" name="twitter" size="large"/>
                                <Icon className="icon" name="instagram" size="large"/>
                                <Icon className="icon" name="mail" size="large"/>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default NewFooter;