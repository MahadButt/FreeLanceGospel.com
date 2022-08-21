import React from "react";
import { withRouter } from "react-router";
import { Input } from "semantic-ui-react";
import { Form, Formik } from "formik";
import './SearchComponent.scss'

const SearchComponent = (props) => {

    const handleSearch = (values, fr) => props.history.push(`/search/?search_key=${values.search}`);

    return (
        <div className="search-component-container">
            <Formik
                initialValues={{ search: "" }}
                onSubmit={handleSearch}
            >
                {(fr) => (
                    <Form className="form-container">
                        <Input 
                            autoComplete="off" 
                            name="search" 
                            value={fr.values.search} 
                            onChange={fr.handleChange} 
                            icon="search" 
                            placeholder="Search" 
                        />
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default withRouter(SearchComponent);