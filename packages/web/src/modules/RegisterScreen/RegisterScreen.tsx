import React, { useEffect, useState } from "react";
import { Form, Container, FloatingLabel, Row, Col, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, selectRegisterProcess } from "#root/shared/redux/store";
import { resetProcess } from "#root/shared/redux/slices/allProcess";
import { registerUserThunk } from "#root/shared/redux/thunks/allProcess/register.thunk";
import { Link } from "react-router-dom";
import SubmitButton from "#root/shared/components/Buttons/SubmitButton";

export const RegisterScreen = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { loading, success, error, errorMsg } = useSelector(selectRegisterProcess);

	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		username: "",
		password: "",
	});

	// clear registerProcess
	useEffect(() => {
		return () => {
			dispatch(resetProcess("register"));
		};
	}, [dispatch]);

	function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
		const value = evt.target.value;
		setForm({
			...form,
			[evt.target.name]: value,
		});
	}

	function handleSubmit(e: React.SyntheticEvent) {
		e.preventDefault();

		dispatch(registerUserThunk(form));
	}

	return (
		<Container className='mt-5 mb-5 min-vh-75'>
			<Row className='justify-content-md-center align-items-md-center mb-3'>
				<Col xs lg='6'>
					<h2>Register</h2>
				</Col>
			</Row>
			{success && (
				<Row className='justify-content-md-center align-items-md-center mb-3'>
					<Col xs lg='6'>
						<Alert variant='success'>
							User has been successfully registered.
							<br />
							Proceed to <Link to='/login'>login</Link>
						</Alert>
					</Col>
				</Row>
			)}
			{error && (
				<Row className='justify-content-md-center align-items-md-center mb-3'>
					<Col xs lg='6'>
						<Alert variant='danger'>{errorMsg}</Alert>
					</Col>
				</Row>
			)}

			<Row className='justify-content-md-center align-items-md-center'>
				<Col xs lg='6'>
					<Form onSubmit={handleSubmit}>
						<Form.Group className='mb-3' controlId='formBasicFirstName'>
							<FloatingLabel controlId='floatingFirstName' label='First Name' className='mb-3'>
								<Form.Control
									type='text'
									name='firstName'
									placeholder='John'
									onChange={handleChange}
									value={form.firstName}
									disabled={loading}
								/>
							</FloatingLabel>
						</Form.Group>

						<Form.Group className='mb-3' controlId='formBasicLastName'>
							<FloatingLabel controlId='floatingLastName' label='Last Name' className='mb-3'>
								<Form.Control
									type='text'
									placeholder='Doe'
									name='lastName'
									onChange={handleChange}
									value={form.lastName}
									disabled={loading}
								/>
							</FloatingLabel>
						</Form.Group>

						<Form.Group className='mb-3' controlId='formBasicEmail'>
							<FloatingLabel controlId='floatingUsername' label='Username' className='mb-3'>
								<Form.Control
									type='text'
									placeholder='Your username'
									name='username'
									onChange={handleChange}
									value={form.username}
									disabled={loading}
								/>
							</FloatingLabel>
						</Form.Group>

						<Form.Group className='mb-3' controlId='formBasicPassword'>
							<FloatingLabel controlId='floatingPassword' label='Password' className='mb-3'>
								<Form.Control
									type='password'
									placeholder='Password'
									name='password'
									onChange={handleChange}
									value={form.password}
									disabled={loading}
								/>
							</FloatingLabel>
						</Form.Group>

						<SubmitButton loading={loading} label='Register' />
					</Form>
				</Col>
			</Row>
		</Container>
	);
};

export default RegisterScreen;
