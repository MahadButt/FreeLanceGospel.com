import React, { useState, useEffect, useContext } from "react";
import { Icon, Menu, Sidebar, Accordion, Header } from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { AuthContext } from "../../shared/context/auth-context";

import "./SideNavBar.scss";

const SideNavBar = (props) => {

    const { setFilterUrl } = useContext(AuthContext);

    const [categories, setCategories] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {

        async function loadCats() {
            
            const { data } = await axios.get("/blog/categories");

            data.forEach(cat => cat.subCats.unshift({}));

            setCategories(data);
        }

        loadCats();

    }, []);

    const filterParentCat = (id) => {

        let url = new URL("http://localhost:5000/blog/get-blogs/50/");
        let params = url.searchParams;

        params.append("cat_id", id);

        const filteredUrl = url.href.substring("http://localhost:5000".length);
        setFilterUrl(filteredUrl);

        props.history.push("/explore");
        closeSideBar();

    }

    const filterSubCat = (id) => {

        let url = new URL("http://localhost:5000/blog/get-blog/50/");
        let params = url.searchParams;

        params.append("subcat_id", id);

        const filteredUrl = url.href.substring("http://localhost:5000".length);
        setFilterUrl(filteredUrl);

        props.history.push("/explore");
        closeSideBar();
    }

    const closeSideBar = () => props.setVisible(false);

    const handleClick = (event, titleProps) => {

        const { index } = titleProps;
        const newIndex = activeIndex === index ? -1 : index;

        setActiveIndex(newIndex);
    }

    return (
        <Sidebar
            as={Menu}
            animation="overlay"
            onHide={closeSideBar}
            vertical
            visible={props.visible}
            width="wide"
        >
            <div className="SideNavBar">
                <div onClick={closeSideBar} className="menu-close-icon">
                    <Icon name="close" size="large" />
                </div>
                <div className="SideNavBar--header">
                    <Header size="large" dividing>Categories</Header>
                </div>
                <Accordion styled>
                    {
                        categories.map((category, index) => {
                            return (
                                <div key={category.category_name}>
                                    <Accordion.Title
                                        active={activeIndex === index}
                                        index={index}
                                        onClick={handleClick}
                                    >
                                        <Icon name="dropdown" />
                                        {category.category_name}
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === index}>
                                        {
                                            category.subCats.map((subCat, index) => {
                                                if (index === 0) {
                                                    return (
                                                        <div onClick={() => filterParentCat(category.id)} key={index} className="SideNavBar--link">
                                                            <Link to="/explore">Show All</Link>
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <div onClick={() => filterSubCat(subCat.id)} key={`${subCat.id}-${index}`} className="SideNavBar--link">
                                                            <Link to="/explore">{subCat.subcat_name}</Link>
                                                        </div>
                                                    );
                                                }
                                            })
                                        }
                                    </Accordion.Content>
                                </div>
                            );
                        })  
                    }
                </Accordion>
            </div>
        </Sidebar>
    );
}

export default withRouter(SideNavBar);