import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";

import UserDetailsForm from "./UserDetailsForm";
import ChangePasswordForm from "./ChangePasswordForm";

import { socketPostShowCurrentUserOnline } from "#root/shared/api/socket.service";
import { selectAuthUserState } from "#root/shared/redux/store";

export const ProfileScreen = () => {
	const {
		user: { userId },
	} = useSelector(selectAuthUserState);
	return (
		<Container className='mt-5 mb-5 min-vh-75'>
			<Row className='justify-content-md-center align-items-md-center mb-3'>
				<Col xs lg='6'>
					<h2>
						Profile{" "}
						<button onClick={() => socketPostShowCurrentUserOnline(userId as string)} style={{ marginLeft: "5px" }}>
							Show Online
						</button>
					</h2>
				</Col>
			</Row>

			<UserDetailsForm />

			<ChangePasswordForm />
		</Container>
	);
};

export default ProfileScreen;
