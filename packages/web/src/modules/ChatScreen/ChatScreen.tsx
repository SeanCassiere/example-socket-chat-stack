import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { chatGetAllUsers } from "#root/shared/redux/thunks/chatRooms.thunks";

export const ChatScreen = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(chatGetAllUsers());
	}, [dispatch]);

	return (
		<Container className='mt-2 mb-2' fluid>
			<Row>
				<Col xs='6'>
					<Row>
						<Col xs='12'>Hello World</Col>
					</Row>
				</Col>
			</Row>
		</Container>
	);
};

export default ChatScreen;
