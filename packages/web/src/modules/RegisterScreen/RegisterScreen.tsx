import React, { useEffect, useState } from "react";
import { Form, Container, Row, Col, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, selectRegisterProcess } from "#root/shared/redux/store";
import { resetProcess } from "#root/shared/redux/slices/allProcess";
import { registerUserThunk } from "#root/shared/redux/thunks/allProcess/register.thunk";
import { Link } from "react-router-dom";
import SubmitButton from "#root/shared/components/Buttons/SubmitButton";
import FloatingInput from "#root/shared/components/Inputs/FloatingInputForm";

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
						<FloatingInput
							handleChange={handleChange}
							value={form.firstName}
							name='firstName'
							label='First Name'
							loading={loading}
							placeholder='John'
							required
						/>

						<FloatingInput
							handleChange={handleChange}
							value={form.lastName}
							name='lastName'
							label='Last Name'
							loading={loading}
							placeholder='Doe'
							required
						/>

						<FloatingInput
							handleChange={handleChange}
							value={form.username}
							name='username'
							label='Username'
							loading={loading}
							placeholder='Your unique username'
							required
						/>

						<FloatingInput
							handleChange={handleChange}
							value={form.password}
							name='password'
							label='Password'
							loading={loading}
							placeholder='Password'
							type='password'
							required
						/>

						<SubmitButton loading={loading} label='Register' />
					</Form>
				</Col>
			</Row>
		</Container>
	);
};

export default RegisterScreen;
