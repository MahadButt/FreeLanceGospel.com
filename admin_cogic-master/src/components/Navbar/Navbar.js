import React, { useContext } from "react";
import { Menu, Button, Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../shared/context/auth-context";

import "./Navbar.scss";

const Navbar = () => {

    const auth = useContext(AuthContext);

    return (
        <div className="fixed-menu">
            <div style={{ flex: 1, overflowY: "scroll" }}>
                <Menu 
                    style={{ borderRadius: "0px", height: "100%" }} 
                    fluid 
                    inverted 
                    vertical 
                    borderless 
                    compact
                >
                    <Menu.Item>
                        <Menu.Header>
                            The Church Book Admin Panel
                        </Menu.Header>
                    </Menu.Item>
                    <Menu.Item 
                        as={Link}
                        to="/"
                        icon="chart bar"
                        content="Statistics"
                    />
                    <Menu.Item 
                        as={Link}
                        to="/users"
                        icon="users"
                        content="Users"
                    />
                    <Dropdown item text='Stories' icon='book'>
                        <Dropdown.Menu>
                            <Dropdown.Item text='Stories' as={Link} to="/blogs" />
                            <Dropdown.Item text='Categories' as={Link} to="/blogs-categories" />
                            <Dropdown.Item text='SubCategories' as={Link} to="/blogs-subCategories" />
                        </Dropdown.Menu>
                    </Dropdown>
                    {/* <Menu.Item 
                        as={Link}
                        to="/blogs"
                        icon="book"
                        content="Stories"
                    /> */}
                    <Menu.Item
                        as={Link}
                        to="/library"
                        icon="book"
                        content="Library"
                    />
                    <Menu.Item 
                        as={Link}
                        to="/settings"
                        icon="settings"
                        content="Settings"
                    />
                    <Dropdown item text='Quiz' icon='trophy'>
                        <Dropdown.Menu>
                            <Dropdown.Item text='Categories' as={Link} to="/categories" />
                            <Dropdown.Item text='Questions' as={Link} to="/questions" />
                        </Dropdown.Menu>
                    </Dropdown>
                    <Menu.Item 
                        as={Link}
                        to="/gallery"
                        icon="images"
                        content="Gallery"
                    />
                     <Menu.Item 
                        as={Link}
                        to="/videos"
                        icon="camera"
                        content="Videos"
                    />
                    <Dropdown item text='Forum' icon='discussions'>
                        <Dropdown.Menu>
                            <Dropdown.Item text='Posts' as={Link} to="/forum-posts" />
                            <Dropdown.Item text='Topics' as={Link} to="/forum-topics" />
                            <Dropdown.Item text='Forum Sections' as={Link} to="/forum-sections" />
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu>
            </div>
            <div style={{ flex: "0 0 auto", padding: "20px" }}>
                <Button fluid negative onClick={auth.logout}>LOGOUT</Button>
            </div>
        </div>
    );
}

export default Navbar;