import React from "react";
import { FloatingLabel, Form, FormControlProps } from "react-bootstrap";

const FloatingInput = React.memo(
	(
		props: {
			handleChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
			value: string;
			loading: boolean;
			name: string;
			label: string;
			required?: true;
		} & FormControlProps
	) => {
		const { handleChange, value, loading, name, label, ...rest } = props;
		return (
			<Form.Group className='mb-3' controlId={`formBasic${name}`}>
				<FloatingLabel controlId={`formBasic${name}`} label={label} className='mb-3'>
					<Form.Control name={name} onChange={handleChange} value={value} disabled={loading} {...rest} />
				</FloatingLabel>
			</Form.Group>
		);
	}
);

export default FloatingInput;
