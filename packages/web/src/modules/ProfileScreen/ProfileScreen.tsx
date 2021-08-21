import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import UserDetailsForm from "./UserDetailsForm";
import ChangePasswordForm from "./ChangePasswordForm";

export const ProfileScreen = () => {
	return (
		<Container className='mt-5 min-vh-75'>
			<Row className='justify-content-md-center align-items-md-center mb-3'>
				<Col xs lg='6'>
					<h2>Profile</h2>
				</Col>
			</Row>

			<UserDetailsForm />

			<ChangePasswordForm />
		</Container>
	);
};

export default ProfileScreen;
