import React, { useEffect, useState } from "react";
import { Alert, Button, Col, FloatingLabel, Form, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, selectAuthUserState, selectUpdateProfileProcess } from "#root/shared/redux/store";
import { updateUserProfileThunk } from "#root/shared/redux/thunks/allProcess/updateProfile.thunk";
import { resetProcess } from "#root/shared/redux/slices/allProcess";
import SubmitButton from "#root/shared/components/Buttons/SubmitButton";

const UserDetailsForm = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { loading, success, error, errorMsg } = useSelector(selectUpdateProfileProcess);

	const {
		user: { firstName, lastName, username },
	} = useSelector(selectAuthUserState);

	const [form, setForm] = useState({
		firstName: firstName as string,
		lastName: lastName as string,
	});

	useEffect(() => {
		return () => {
			dispatch(resetProcess("updateProfileDetails"));
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

		dispatch(updateUserProfileThunk(form));
	}

	return (
		<>
			<Row className='justify-content-md-center align-items-md-center mb-3 mt-3'>
				<Col xs lg='6'>
					<h5>Update profile details</h5>
				</Col>
			</Row>

			{success && (
				<Row className='justify-content-md-center align-items-md-center mb-3'>
					<Col xs lg='6'>
						<Alert variant='success'>User profile has been successfully updated.</Alert>
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
									name='firstName'
									value={form.firstName}
									onChange={handleChange}
									disabled={loading}
									required
								/>
							</FloatingLabel>
						</Form.Group>

						<Form.Group className='mb-3' controlId='formBasicLastName'>
							<FloatingLabel controlId='floatingLastName' label='Last Name' className='mb-3'>
								<Form.Control
									type='text'
									placeholder='Doe'
									name='lastName'
									value={form.lastName}
									onChange={handleChange}
									disabled={loading}
									required
								/>
							</FloatingLabel>
						</Form.Group>

						<SubmitButton loading={loading} label='Update' />
					</Form>
				</Col>
			</Row>
		</>
	);
};

export default UserDetailsForm;
