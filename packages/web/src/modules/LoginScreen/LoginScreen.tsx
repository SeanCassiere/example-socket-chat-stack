import React, { useCallback } from "react";
import { Button, Form, Container, FloatingLabel, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { AppDispatch } from "#root/shared/redux/store";
import { demoSetUserLoggedIn } from "#root/shared/redux/slices/authUser";
import { useHistory } from "react-router-dom";

export const LoginScreen = () => {
	const dispatch = useDispatch<AppDispatch>();
	const history = useHistory();

	const handleSubmit = useCallback(
		(e: React.SyntheticEvent) => {
			e.preventDefault();
			dispatch(demoSetUserLoggedIn());
			const {
				location: { state },
			} = history;
			const routeState = state as any;

			if (routeState && routeState.next) return history.push(routeState.next);

			history.push("/dashboard");
		},
		[dispatch, history]
	);

	return (
		<Container className='mt-5'>
			<Row className='justify-content-md-center align-items-md-center mb-3'>
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
