import React from "react";
import { Button, Form, Container, FloatingLabel, Row, Col } from "react-bootstrap";

export const ProfileScreen = () => {
	function handleSubmit(e: React.SyntheticEvent) {
		e.preventDefault();
	}

	return (
		<Container className='mt-5'>
			<Row className='justify-content-md-center align-items-md-center mb-3'>
				<Col xs lg='6'>
					<h2>Profile</h2>
				</Col>
			</Row>
			<Row className='justify-content-md-center align-items-md-center'>
				<Col xs lg='6'>
					<Form onSubmit={handleSubmit}>
						<Form.Group className='mb-3' controlId='formBasicEmail'>
							<FloatingLabel controlId='floatingUsername' label='Username' className='mb-3'>
								<Form.Control type='text' placeholder='Your username' value={`My username`} readOnly />
							</FloatingLabel>
						</Form.Group>

						<Form.Group className='mb-3' controlId='formBasicFirstName'>
							<FloatingLabel controlId='floatingFirstName' label='First Name' className='mb-3'>
								<Form.Control type='text' placeholder='John' value={`John`} required />
							</FloatingLabel>
						</Form.Group>

						<Form.Group className='mb-3' controlId='formBasicLastName'>
							<FloatingLabel controlId='floatingLastName' label='Last Name' className='mb-3'>
								<Form.Control type='text' placeholder='Doe' value={`Doe`} required />
							</FloatingLabel>
						</Form.Group>

						<Form.Group className='mb-3' controlId='formBasicPassword'>
							<FloatingLabel controlId='floatingPassword' label='Password' className='mb-3'>
								<Form.Control type='password' placeholder='Password' value={`P@ssw0rD`} required />
							</FloatingLabel>
						</Form.Group>

						<Button variant='primary' type='submit'>
							Update
						</Button>
					</Form>
				</Col>
			</Row>
		</Container>
	);
};

export default ProfileScreen;
