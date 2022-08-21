import React, { useState, useEffect, Fragment } from "react";
import { Header, Loader } from "semantic-ui-react";
import axios from "../../utils/axiosInstance";

import BasicSettings from "./BasicSettings";

import "./ProfileSettings.scss";

const ProfileSettings = (props) => {

	const [countries, setCountries] = useState([]);
	const [cities, setCities] = useState([]);
    const [pageLoaded, setPageLoaded] = useState(true);
    
	useEffect(() => {

		async function fetchCountries() {

			const { data } = await axios.get("/user/countries");
			const countriesOption = data.map(country => {
				return {
					key: country.country_code.toLowerCase(),
					value: country.id,
					flag: country.country_code.toLowerCase(),
					text: country.country_name
				};
			});
			setCountries(countriesOption);
			setPageLoaded(true);
		}
		async function fetchCities(){
			const { data } = await axios.get("/user/cities");
			const citiesOption = data.map(city => {
				return {
					key: city.id,
					value: city.id,
					text: city.name
				};
			});
			setCities(citiesOption);
			setPageLoaded(true);
		}

		fetchCountries();
		fetchCities();

    }, []);

    const settingsTab = (
        <Fragment>
            <div className="ProfileSettings--title">
				<Header as="h2">
					Account Settings
                    <Header.Subheader>
						Manage your account settings and set preferences
                    </Header.Subheader>
				</Header>
		    </div>
            <BasicSettings 
                countries={countries} 
				cities={cities} 
                user={props.user} 
            />
        </Fragment>
    );

	return (
		<div className="ProfileSettings profile-padded">
			{!pageLoaded ? <Loader active /> : settingsTab}
		</div>
	);
}

export default ProfileSettings;