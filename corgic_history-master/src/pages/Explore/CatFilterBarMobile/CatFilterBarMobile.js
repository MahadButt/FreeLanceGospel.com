import React from "react";
import { Segment, Header, Menu, Dropdown } from "semantic-ui-react";
import './CatFilterBarMobile.scss';

const CatFilterBarMobile = (props) => {

    const { categories, setFieldValue, submitForm } = props;

    const setParentCategory = (id) => {
        setFieldValue("category", id);
        submitForm();
    }

    const setSubCategory = (id) => {
        setFieldValue("sub_category", id);
        submitForm();
    }

    return (
        <Segment className="explore-catFilter-mobile">
            <Menu vertical>
            {
                categories.map(category => {
                    return (
                        <Dropdown scrolling key={category.category_name} item text={category.category_name}>
                            <Dropdown.Menu>
                                {
                                    category.subCats.map((subCat, index) => {

                                        if (index === 0) {
                                            return (
                                                <Dropdown.Item 
                                                    onClick={() => setParentCategory(category.id)} 
                                                    key={index}
                                                >
                                                    Show All
                                                </Dropdown.Item>
                                            );
                                        } else {
                                            return (
                                                <Dropdown.Item 
                                                    onClick={() => setSubCategory(subCat.id)} 
                                                    key={subCat.id}
                                                >
                                                    {subCat.subcat_name}
                                                </Dropdown.Item>
                                            );
                                        }
                                    })
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    );
                })
            }
            </Menu>
        </Segment>
    );
}

export default CatFilterBarMobile;