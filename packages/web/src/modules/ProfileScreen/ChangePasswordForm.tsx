import React, { useEffect, useState } from "react";
import { Alert, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, selectChangeUserPasswordProcess } from "#root/shared/redux/store";
import { changeUserPasswordThunk } from "#root/shared/redux/thunks/allProcess/changePassword.thunk copy";
import { resetProcess } from "#root/shared/redux/slices/allProcess";
import SubmitButton from "#root/shared/components/Buttons/SubmitButton";
import FloatingInput from "#root/shared/components/Inputs/FloatingInputForm";

const ChangePasswordForm = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { loading, success, error, errorMsg } = useSelector(selectChangeUserPasswordProcess);

	const [form, setForm] = useState({
		newPassword: "",
		confirmPassword: "",
	});
	const [isMatchPasswordsErr, setIsMatchPasswordsErr] = useState(false);

	useEffect(() => {
		return () => {
			dispatch(resetProcess("changeUserPasswordProcess"));
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

		if (form.newPassword !== form.confirmPassword) {
			return setIsMatchPasswordsErr(true);
		}
		setIsMatchPasswordsErr(false);

		dispatch(changeUserPasswordThunk({ password: form.confirmPassword }));
	}

	return (
		<>
			<Row className='justify-content-md-center align-items-md-center mb-3 mt-4'>
				<Col xs lg='6'>
					<h5>Change Password</h5>
				</Col>
			</Row>

			{success && (
				<Row className='justify-content-md-center align-items-md-center mb-3'>
					<Col xs lg='6'>
						<Alert variant='success'>Your password has been successfully updated.</Alert>
					</Col>
				</Row>
			)}
			{error || isMatchPasswordsErr ? (
				<Row className='justify-content-md-center align-items-md-center mb-3'>
					<Col xs lg='6'>
						<Alert variant='danger'>{isMatchPasswordsErr ? "Passwords do not match." : errorMsg}</Alert>
					</Col>
				</Row>
			) : null}

			<Row className='justify-content-md-center align-items-md-center'>
				<Col xs lg='6'>
					<Form onSubmit={handleSubmit}>
						<FloatingInput
							handleChange={handleChange}
							value={form.newPassword}
							name='newPassword'
							label='New Password'
							loading={loading}
							placeholder='New Password'
							type='password'
							required
						/>

						<FloatingInput
							handleChange={handleChange}
							value={form.confirmPassword}
							name='confirmPassword'
							label='Confirm Password'
							loading={loading}
							placeholder='Confirm Password'
							type='password'
							required
						/>

						<SubmitButton loading={loading} label='Change Password' />
					</Form>
				</Col>
			</Row>
		</>
	);
};

export default ChangePasswordForm;
