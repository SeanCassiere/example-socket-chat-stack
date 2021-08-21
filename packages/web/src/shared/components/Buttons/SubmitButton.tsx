import React, { ReactNode } from "react";
import { Button, Spinner } from "react-bootstrap";

const SubmitButton = React.memo(({ loading, label }: { loading: boolean; label: string | ReactNode }) => {
	return (
		<Button variant='primary' type='submit' disabled={loading}>
			<Spinner
				as='span'
				animation='border'
				size='sm'
				role='status'
				aria-hidden='true'
				style={loading ? { display: "inline-block" } : { display: "none" }}
			/>
			<span className='visually-hidden'>Loading...</span>
			<span style={loading ? { marginLeft: "5px" } : {}}>{label}</span>
		</Button>
	);
});

export default SubmitButton;
