import React, { useState, useEffect } from "react";
import { Icon } from "semantic-ui-react";
import { Collapse } from 'reactstrap';
import './CatFilterBar.scss';

const CatFilterBar = (props) => {

    const { categories, setFieldValue, submitForm, onSubCategoryClick } = props;

    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(0);
    const [isPageLoaded, setPageLoaded] = useState(false);

    const toggle = (current) => {
        setIsOpen(activeCategory === current ? !isOpen : true);
        setActiveCategory(current)
    }

    const setParentCategory = (id) => {
        setFieldValue("category", id);
        submitForm();
        // setIsOpen(!isOpen)
        onSubCategoryClick()
    }
    const setSubCategory = async (id, catID) => {
        setFieldValue("sub_category", id);
        setFieldValue("category", catID);
        submitForm();
        // setIsOpen(false)
        onSubCategoryClick()
    }

    useEffect(() => {
        setPageLoaded(true);
        if (categories && categories.length > 0) {
            setActiveCategory(0)
            setIsOpen(true)
        }
        return () => {
            setPageLoaded(false)
        }
    }, [])


    return (
        <div className="explore-catFilter-container">
            <div className={`title ${isPageLoaded && 'loaded'}`}>Categories</div>
            <div className={`custom-border ${isPageLoaded && 'loaded'}`}></div>
            <div className="menus-wrapper">
                {
                    categories && categories.length > 0 && categories.map((category, ind) => {
                        return (
                            <div key={category.category_name} className="category-box">
                                <div
                                    className={`category-name-wrapper ${activeCategory === ind && isOpen && 'selected'}`}
                                    onClick={() => toggle(ind)}
                                >
                                    <div className="category-name">{category.category_name}</div>
                                    <Icon name={activeCategory === ind && isOpen ? 'minus' : 'plus'} size="small" className="icon" />
                                </div>
                                <Collapse isOpen={activeCategory === ind && isOpen ? true : false} >
                                    <div className="subcategories">
                                        {
                                            category.subCats.map((subCat, index) => {
                                                return (
                                                    <div
                                                        onClick={() => setSubCategory(subCat.id, subCat.parent_id)}
                                                        key={subCat.id}
                                                        className="subcat-name"
                                                    >
                                                        {subCat.subcat_name}
                                                    </div>
                                                );
                                            })
                                        }
                                        <div
                                            onClick={() => setParentCategory(category.id)}
                                            className="subcat-name last-subcat"
                                        >
                                            Show All
                                        </div>
                                    </div>
                                </Collapse>
                            </div>
                        );
                    })
                }
                {/*
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
            */}
            </div>
        </div>
    );
}

export default CatFilterBar;