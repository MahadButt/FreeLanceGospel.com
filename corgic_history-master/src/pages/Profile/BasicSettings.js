import React, { useContext, useRef, useState, useEffect } from "react";
import moment from "moment";
import { DateInput } from "semantic-ui-calendar-react";
import { Header, Grid, Input, Dropdown, Radio, Button, Icon } from "semantic-ui-react";
import { Form, Formik } from "formik";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";
import { AuthContext } from "../../shared/context/auth-context";
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import './tagsInput.css'

const BasicSettings = (props) => {

	const { countries,cities } = props;

	const auth = useContext(AuthContext);
	const fileRef = useRef(null);
	const headerRef = useRef(null);
	const [hobbies, setHobbies] = useState([])
	const initialValues = {
		password: "",
		re_password: "",
		marital_status: props.user.marital_status ? props.user.marital_status : "",
		date_of_birth: props.user.date_of_birth ? moment(props.user.date_of_birth).format("YYYY-MM-DD") : "",
		country_id: props.user.country ? props.user.country.id : "",
		city_id: props.user.city ? props.user.city.id : "",
		// address: props.user.address ? props.user.address : "",
		contact_no: props.user.contact_no ? props.user.contact_no : "",
		denomination: props.user.denomination ? props.user.denomination : "",
		age: props?.user?.age ??  "",
		ethnicity: props?.user?.ethnicity ??  "",
		region: props?.user?.region ??  "",
		education: props?.user?.education ??  "",
		sign: props?.user?.sign ??  "",
		profile_pic: null,
		header_pic: null
	};

	useEffect(() => {
		if(props && props.user && props.user.hobbies && props.user.hobbies.length) {
			let hobby = props.user.hobbies.split(", ")
			setHobbies(hobby)
		}
	}, [])

	const validatePassword = (values => {

		const errors = {};

		if ((values.password !== "" && values.re_password !== "") && (values.password !== values.re_password)) {
			errors.password = "Passwords do not match!";
		} else if ((values.password.length !== 0 && values.password.length < 6) || (values.re_password.length !== 0 && values.re_password.length < 6)) {
			errors.password = "Password must be at least 6 characters long";
		}

		return errors;
	});

	const handleProfilePic = (event, setFieldValue) => {
		if (event.target.files.length > 0) {
			for (var x = 0; x < event.target.files.length; x++) {
				event.target.files[x].preview = URL.createObjectURL(event.target.files[x]);
			}
		}
		setFieldValue("profile_pic", event.target.files);
	}
	const handleHeaderPic = (event, setFieldValue) => {
		if (event.target.files.length > 0) {
			for (var x = 0; x < event.target.files.length; x++) {
				event.target.files[x].preview = URL.createObjectURL(event.target.files[x]);
			}
		}
		setFieldValue("header_pic", event.target.files);
	}
	const handleSubmit = async (values, fr) => {

		if(hobbies && hobbies.length) {
			let hobb = hobbies.join(", ");
			values.hobbies = hobb;			
		}

		values.marital_status = parseInt(values.marital_status);

		const { data } = await axios.patch(`/user/patch-basic/${auth.user.u_id}`, values, { headers: { Authorization: `Bearer ${auth.user.token}` } });

		if (values.profile_pic) {

			const formData = new FormData();
			if (values.profile_pic.length > 0) {
				for (var x = 0; x < values.profile_pic.length; x++) {
					formData.append("disk", values.profile_pic[x]);
				}
			}

			const { data } = await axios({
				method: "patch",
				url: `/user/change-pp/${auth.user.u_id}`,
				data: formData,
				headers: {
					"content-type": "multipart/form-data",
					Authorization: `Bearer ${auth.user.token}`
				},
				onUploadProgress: progressEvent => console.log(progressEvent.loaded)
			});

			if (data.ppChange) {

				const user = JSON.parse(localStorage.getItem("user"));
				user.avatar_url = data.url;

				localStorage.setItem("user", JSON.stringify(user));
			}
		}
		if (values.header_pic) {
			const formData = new FormData();
			if (values.header_pic.length > 0) {
				for (var x = 0; x < values.header_pic.length; x++) {
					formData.append("disk", values.header_pic[x]);
				}
			}
			await axios({
				method: "post",
				url: `/user/add-headerImg/${auth.user.u_id}`,
				data: formData,
				headers: {
					"content-type": "multipart/form-data",
					Authorization: `Bearer ${auth.user.token}`
				},
				onUploadProgress: progressEvent => console.log(progressEvent.loaded)
			});
		}

		if (data.update) {
			window.location.href = `/profile/?u_id=${auth.user.u_id}&target=info`;
		} else {
			fr.setSubmitting(false);
			toast.error(data.msg);
		}
	}

	const handleHobbies = (data) => {
		setHobbies(data)
	}

	return (
		<div className="BasicSettings">
			<Formik
				initialValues={initialValues}
				validate={validatePassword}
				onSubmit={handleSubmit}
			>
				{(fr) => (
					<Form>
						<div className="row">
							<div className="col-12">
								<Header size="medium" dividing>Basic Information</Header>
								<div className="row">
									<div className="col-lg-6 col-md-6 col-sm-6 col-12">
										<div className="accounts-input">
											<Button
												content="Update profile picture"
												labelPosition="left"
												icon="images"
												type="button"
												onClick={() => fileRef.current.click()}
											/>
											<input
												type="file"
												ref={fileRef}
												hidden
												accept="image/*, image/heic, image/heif"
												onChange={(event) => handleProfilePic(event, fr.setFieldValue)}
											/>
											{
												!fr.values.profile_pic ? null :
													<div className="upload--file-container">
														{Object.keys(fr.values.profile_pic).map((item) => {
															return (
																<div className="upload--file-preview" style={{ marginTop: "10px" }}>
																	<img className="img-upload--preview preview-large" src={fr.values.profile_pic[item].preview} />
																	{/* <span
																onClick={(event) => fr.setFieldValue("profile_pic", delete fr.values.profile_pic[item])}
																className="upload--file-preview--cross"
															>
																<Icon name="close" size="large" />
															</span> */}
																</div>
															)
														})}
													</div>
											}
										</div>
									</div>
									<div className="col-lg-6 col-md-6 col-sm-6 col-12">
										<div className="accounts-input">
											<Button
												content="Upload Cover Photos"
												labelPosition="left"
												icon="upload"
												type="button"
												onClick={() => headerRef.current.click()}
											/>
											<input
												type="file"
												ref={headerRef}
												hidden
												accept="image/*, image/heic, image/heif"
												onChange={(event) => handleHeaderPic(event, fr.setFieldValue)}
											/>
											{
												!fr.values.header_pic ? null :
													<div className="upload--file-container">
														{Object.keys(fr.values.header_pic).map((item) => {
															return (
																<div className="upload--file-preview" style={{ marginTop: "10px" }}>
																	<img className="img-upload--preview preview-large" src={fr.values.header_pic[item].preview} />
																</div>
															)
														})}
													</div>
											}
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-lg-6 col-12">
										<div className="accounts-input">
											<label>Date of Birth</label>
											<DateInput
												fluid
												placeholder="Date of Birth"
												dateFormat="YYYY-MM-DD"
												value={fr.values.date_of_birth}
												iconPosition="left"
												onChange={(event, { name, value }) => fr.setFieldValue("date_of_birth", value)}
											/>
										</div>
									</div>
									<div className="col-lg-6 col-12">
										<div className="accounts-input">
											<label>Church Denomination</label>
											<Input
												name="denomination"
												fluid placeholder="Enter your church denomination"
												type="text"
												value={fr.values.denomination}
												onBlur={fr.handleBlur}
												onChange={fr.handleChange}
											/>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-lg-6 col-12">
										<div className="accounts-input">
											<label>Age</label>
											<Input
												name="age"
												fluid placeholder="Enter your Age"
												type="text"
												value={fr.values.age}
												onBlur={fr.handleBlur}
												onChange={fr.handleChange}
											/>
										</div>
									</div>
									<div className="col-lg-6 col-12">
										<div className="accounts-input">
											<label>Ethnicity</label>
											<Input
												name="ethnicity"
												fluid placeholder="Enter Ethnicity"
												type="text"
												value={fr.values.ethnicity}
												onBlur={fr.handleBlur}
												onChange={fr.handleChange}
											/>
										</div>
									</div>
								</div>
								{/* <div className="row">
									<div className="col-12">
										<div className="accounts-input">
											<label>Address</label>
											<Input
												name="address"
												fluid placeholder="Enter your Address"
												type="text"
												value={fr.values.address}
												onBlur={fr.handleBlur}
												onChange={fr.handleChange}
											/>
										</div>
									</div>
								</div> */}
								{/* <div className="row">
									<div className="col-12">
										<div className="accounts-input">
											<label>Marital Status</label>
											<div className="row">
												<div className="col-6">
													<div className="accounts-input-radio">
														<Radio
															label="Unmarried"
															name="marital_status"
															onChange={(event, { name, value }) => fr.setFieldValue("marital_status", value)}
															value="1" // 1 for unmarried
															checked={`${fr.values.marital_status}` === "1"}
														/>
													</div>
												</div>
												<div className="col-6">
													<div className="accounts-input-radio">
														<Radio
															label="Married"
															name="marital_status"
															onChange={(event, { name, value }) => fr.setFieldValue("marital_status", value)}
															value="2" // 1 for married
															checked={`${fr.values.marital_status}` === "2"}
														/>
													</div>
												</div>
											</div>
								</div>
								</div>
							</div> */}
							</div>
							<div className="col-12">
								<Header size="medium" dividing>Contact Information</Header>
								<div className="row">
									<div className="col-lg-6 col-12">
										<div className="accounts-input">
											<label>Country</label>
											<Dropdown
												fluid
												placeholder="Select Country"
												search
												selection
												name="country_id"
												value={fr.values.country_id}
												onChange={(event, { name, value }) => fr.setFieldValue(name, value)}
												options={countries}
											/>
										</div>
									</div>
									<div className="col-lg-6 col-12">
										<div className="accounts-input">
											<label>City</label>
											<Dropdown
												fluid
												placeholder="Select City"
												search
												selection
												name="city_id"
												value={fr.values.city_id}
												onChange={(event, { name, value }) => fr.setFieldValue(name, value)}
												options={cities}
											/>
										</div>
									</div>
        
									<div className="col-lg-6 col-12">
										<div className="accounts-input">
											<label>Contact No.</label>
											<Input
												name="contact_no"
												fluid placeholder="Enter your contact no."
												type="number"
												value={fr.values.contact_no}
												onBlur={fr.handleBlur}
												onChange={fr.handleChange}
											/>
										</div>
									</div>
									<div className="col-lg-6 col-12">
										<div className="accounts-input">
											<label>State/Region</label>
											<Input
												name="region"
												fluid placeholder="Enter your state/region"
												type="text"
												value={fr.values.region}
												onBlur={fr.handleBlur}
												onChange={fr.handleChange}
											/>
										</div>
									</div>
								</div>
							</div>
							
							<div className="col-12">
								<Header size="medium" dividing>Extra Information</Header>
								<div className="row">
									<div className="col-lg-6 col-12">
										<div className="accounts-input">
											<label>Sign</label>
											<Input
												name="sign"
												fluid placeholder="Enter your sign"
												type="text"
												value={fr.values.sign}
												onBlur={fr.handleBlur}
												onChange={fr.handleChange}
											/>
										</div>
									</div>
									<div className="col-lg-6 col-12">
										<div className="accounts-input">
											<div className="mb-3">Relation Status</div>
											<div className="accounts-input-radio">
												<Radio
													label="Single"
													name="marital_status"
													onChange={(event, { name, value }) => fr.setFieldValue("marital_status", value)}
													value="1" // 1 for single
													checked={`${fr.values.marital_status}` === "1"}
												/>
											</div>
											<div className="accounts-input-radio">
												<Radio
													label="Married"
													name="marital_status"
													onChange={(event, { name, value }) => fr.setFieldValue("marital_status", value)}
													value="2" // 2 for married
													checked={`${fr.values.marital_status}` === "2"}
												/>
											</div>
											<div className="accounts-input-radio">
												<Radio
													label="Dating"
													name="marital_status"
													onChange={(event, { name, value }) => fr.setFieldValue("marital_status", value)}
													value="3" // 1 for dating
													checked={`${fr.values.marital_status}` === "3"}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-12">
										<div className="accounts-input">
											<label>Hobbies</label>
											<TagsInput 
												value={hobbies} 
												onChange={handleHobbies} 
												addKeys={[188]}
												inputProps = {{
													placeholder: 'Write & Press Comma'
												}}
												
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="col-12">
								<Header size="medium" dividing>Education Information</Header>
								<div className="row">
									<div className="col-12">
										<div className="accounts-input">
											<label>Education</label>
											<Input
												name="education"
												fluid placeholder="Enter your education"
												type="text"
												value={fr.values.education}
												onBlur={fr.handleBlur}
												onChange={fr.handleChange}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="col-12">
								<Header color="red" size="medium">Security Settings</Header>
								<Header size="medium" dividing>Change Password</Header>
								<div className="row">
									<div className="col-12">
										<div className="accounts-input">
											<label>New Password</label>
											<Input
												name="password"
												fluid placeholder="Enter your new password"
												type="password"
												value={fr.values.password}
												onBlur={fr.handleBlur}
												onChange={fr.handleChange}
											/>
										</div>
									</div>
									<div className="col-12">
										<div className="accounts-input">
											<label>Re-type Password</label>
											<Input
												name="re_password"
												fluid placeholder="Re-type password"
												type="password"
												value={fr.values.re_password}
												onBlur={fr.handleBlur}
												onChange={fr.handleChange}
											/>
											<p className="input-field-error">{fr.errors.password && fr.touched.password && fr.errors.password}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div style={{ padding: "20px 0px" }}>
							<Button disabled={fr.isSubmitting} loading={fr.isSubmitting} fluid primary type="submit">SAVE</Button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default BasicSettings;