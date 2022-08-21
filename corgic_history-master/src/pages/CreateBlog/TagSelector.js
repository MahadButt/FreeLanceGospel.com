import React, { useState } from "react";
import { Search } from "semantic-ui-react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const TagSelector = (props) => {

    const { placeholder, setFieldValue, tag_name, tag_list } = props;

    const [tagsList, setTagsList] = useState([]);

    const handleSearchChange = async (value, setFieldValue, name) => {

        setFieldValue(name, value);

        const { data } = await axios.get(`/blog/tags/?search_key=${value}`);

        const result = data.map(d => {

            return {
                id: d.id,
                title: `${d["tag_name"]}` // title is the format for Semantic SEARCH
            };
        });

        result.unshift({
            id: "new", // for new tag
            title: value // title is the format for Semantic SEARCH
        });

        setTagsList(result);
    }

    const handleSearchSelect = async (result, setFieldValue, list, name) => {
        
        const updatedTagList = [...tag_list];

        if (updatedTagList.length === 4) {
            toast.error("Can't add more than 4 tags");
            return;
        }

        updatedTagList.push(result);

        setFieldValue(list, updatedTagList);
        setFieldValue(name, "");
    }

    return (
        <Search
            fluid
            input={{ icon: "tags" }}
            placeholder={placeholder}
            onSearchChange={(e, { value }) => handleSearchChange(value, setFieldValue, "tag_name")}
            onResultSelect={(e, { result }) => handleSearchSelect(result, setFieldValue, "tag_list", "tag_name")}
            results={tagsList}
            value={tag_name}
        />
    );
}

export default TagSelector;