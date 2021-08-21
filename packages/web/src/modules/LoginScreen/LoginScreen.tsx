import React, { useEffect, useState } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { AppDispatch, selectAuthUserState } from "#root/shared/redux/store";
import { userLoginThunk } from "#root/shared/redux/thunks/authUser.thunks";
import FloatingInput from "#root/shared/components/Inputs/FloatingInputForm";
import SubmitButton from "#root/shared/components/Buttons/SubmitButton";

export const LoginScreen = () => {
	const dispatch = useDispatch<AppDispatch>();
	const history = useHistory();
	const { isLoggedIn, isAuthenticating: loading } = useSelector(selectAuthUserState);

	const [form, setForm] = useState({
		username: "",
		password: "",
	});

	// if user is logged in, redirect to previous screen
	useEffect(() => {
		if (isLoggedIn) {
			const {
				location: { state },
			} = history;
			const routeState = state as any;

			if (routeState && routeState.next) return history.push(routeState.next);

			return history.push("/profile");
		}
	}, [history, isLoggedIn]);

	function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
		const value = evt.target.value;
		setForm({
			...form,
			[evt.target.name]: value,
		});
	}

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();

		await dispatch(userLoginThunk(form));
	};

	return (
		<Container className='mt-5 mb-5 min-vh-75'>
			<Row className='justify-content-md-center align-items-md-center mb-3'>
				<Col xs lg='6'>
					<h2>Login</h2>
				</Col>
			</Row>
			<Row className='justify-content-md-center align-items-md-center'>
				<Col xs lg='6'>
					<Form onSubmit={handleSubmit}>
						<FloatingInput
							handleChange={handleChange}
							value={form.username}
							name='username'
							label='Username'
							loading={loading}
							placeholder='Username'
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

						<SubmitButton loading={loading} label='Login' />
					</Form>
				</Col>
			</Row>
		</Container>
	);
};

export default LoginScreen;
