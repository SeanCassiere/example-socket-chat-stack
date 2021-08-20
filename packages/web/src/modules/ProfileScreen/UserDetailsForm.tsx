import React, { useState } from "react";
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

import { selectAuthUserState } from "#root/shared/redux/store";

const UserDetailsForm = () => {
	const {
		user: { firstName, lastName, username },
	} = useSelector(selectAuthUserState);

	const [profileFirstName, setProfileFirstName] = useState(firstName as string);
	const [profileLastName, setProfileLastName] = useState(lastName as string);

	function handleSubmit(e: React.SyntheticEvent) {
		e.preventDefault();
	}

	return (
		<>
			<Row className='justify-content-md-center align-items-md-center mb-3 mt-3'>
				<Col xs lg='6'>
					<h5>Update profile details</h5>
				</Col>
			</Row>
			<Row className='justify-content-md-center align-items-md-center'>
				<Col xs lg='6'>
					<Form onSubmit={handleSubmit}>
						<Form.Group className='mb-3' controlId='formBasicEmail'>
							<FloatingLabel controlId='floatingUsername' label='Username' className='mb-3'>
								<Form.Control type='text' placeholder='Your username' value={username as string} readOnly />
							</FloatingLabel>
						</Form.Group>

						<Form.Group className='mb-3' controlId='formBasicFirstName'>
							<FloatingLabel controlId='floatingFirstName' label='First Name' className='mb-3'>
								<Form.Control
									type='text'
									placeholder='John'
									value={profileFirstName}
									onChange={(e) => setProfileFirstName(e.target.value)}
									required
								/>
							</FloatingLabel>
						</Form.Group>

						<Form.Group className='mb-3' controlId='formBasicLastName'>
							<FloatingLabel controlId='floatingLastName' label='Last Name' className='mb-3'>
								<Form.Control
									type='text'
									placeholder='Doe'
									value={profileLastName}
									onChange={(e) => setProfileLastName(e.target.value)}
									required
								/>
							</FloatingLabel>
						</Form.Group>

						<Button variant='primary' type='submit'>
							Update
						</Button>
					</Form>
				</Col>
			</Row>
		</>
	);
};

export default UserDetailsForm;
