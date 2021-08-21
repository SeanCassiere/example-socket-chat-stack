import React, { useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";

export const ChatScreen = () => {
	const newRoomRef = useRef<HTMLInputElement>(null);

	return (
		<Container className='mt-2 mb-2' fluid>
			<Row>
				<Col xs='6'>
					<div className='bg-warning h-100 p-2'>
						<input type='text' ref={newRoomRef} />
						<button>Create room</button>
					</div>
				</Col>
				<Col xs='6' className='bg-info'>
					<Container fluid>
						<Row>
							<Col xs='12'>Content</Col>
						</Row>
						<Row className='bg-primary'>
							<Col xs='12'>Input</Col>
						</Row>
					</Container>
				</Col>
			</Row>
		</Container>
	);
};

export default ChatScreen;
