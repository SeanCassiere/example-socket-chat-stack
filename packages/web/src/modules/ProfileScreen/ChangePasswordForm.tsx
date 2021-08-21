import React, { useState } from "react";
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";

const ChangePasswordForm = () => {
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	function handleSubmit(e: React.SyntheticEvent) {
		e.preventDefault();
	}
	return (
		<>
			<Row className='justify-content-md-center align-items-md-center mb-3 mt-4'>
				<Col xs lg='6'>
					<h5>Change Password</h5>
				</Col>
			</Row>
			<Row className='justify-content-md-center align-items-md-center'>
				<Col xs lg='6'>
					<Form onSubmit={handleSubmit}>
						<Form.Group className='mb-3' controlId='floatingNewPassword'>
							<FloatingLabel controlId='floatingNewPassword' label='New Password' className='mb-3'>
								<Form.Control
									type='password'
									placeholder='New Password'
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									required
								/>
							</FloatingLabel>
						</Form.Group>

						<Form.Group className='mb-3' controlId='floatingConfirmNewPassword'>
							<FloatingLabel controlId='floatingConfirmNewPassword' label='Confirm new password' className='mb-3'>
								<Form.Control
									type='password'
									placeholder='Confirm new password'
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
								/>
							</FloatingLabel>
						</Form.Group>

						<Button variant='primary' type='submit'>
							Change Password
						</Button>
					</Form>
				</Col>
			</Row>
		</>
	);
};

export default ChangePasswordForm;
