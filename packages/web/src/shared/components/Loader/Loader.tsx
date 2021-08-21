import React from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";

export const Loader = () => {
	return (
		<Container className='h-100'>
			<Row className='h-100'>
				<Col className='h-100 justify-content-md-center align-items-md-center mb-3'>
					<div className='m-5'>
						<Spinner
							animation='border'
							role='status'
							style={{ width: "250px", height: "250px", margin: "auto", display: "block" }}
						>
							<span className='visually-hidden'>Loading...</span>
						</Spinner>
					</div>
				</Col>
			</Row>
		</Container>
	);
};

export default Loader;
