import React from "react";
import { Button, Form, Container, FloatingLabel, Row, Col } from "react-bootstrap";

export const LoginScreen = () => {
	function handleSubmit(e: React.SyntheticEvent) {
		e.preventDefault();
	}

	return (
		<Container className='mt-5'>
			<Row className='justify-content-md-center align-items-md-center'>
				<Col xs lg='6'>
					<h2>Login</h2>
				</Col>
			</Row>
			<Row className='justify-content-md-center align-items-md-center'>
				<Col xs lg='6'>
					<Form onSubmit={handleSubmit}>
						<Form.Group className='mb-3' controlId='formBasicEmail'>
							<FloatingLabel controlId='floatingUsername' label='Username' className='mb-3'>
								<Form.Control type='text' placeholder='Your username' />
							</FloatingLabel>
						</Form.Group>

						<Form.Group className='mb-3' controlId='formBasicPassword'>
							<FloatingLabel controlId='floatingPassword' label='Password' className='mb-3'>
								<Form.Control type='password' placeholder='Password' />
							</FloatingLabel>
						</Form.Group>

						<Button variant='primary' type='submit'>
							Login
						</Button>
					</Form>
				</Col>
			</Row>
		</Container>
	);
};

export default LoginScreen;
