import { socketCreateNewRoom, socketSendMessageToRoom } from "#root/shared/api/socket.service";
import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

export const ChatScreen = () => {
	const [roomId, setRoomId] = useState("");
	const [chatContent, setChatContent] = useState("");

	const [roomName, setRoomName] = useState("");
	const [roomType, setRoomType] = useState<"single" | "group">("single");

	function handleSendMessageSubmit(e: React.SyntheticEvent) {
		e.preventDefault();
		socketSendMessageToRoom(roomId, chatContent);
		setChatContent("");
	}

	function handleCreateRoom(e: React.SyntheticEvent) {
		e.preventDefault();
		socketCreateNewRoom({ type: roomType, name: roomName });
	}

	return (
		<Container className='mt-2 mb-2' fluid>
			<Row>
				<Col xs='6'>
					<form className='bg-warning h-100 p-2' onSubmit={handleSendMessageSubmit}>
						<h5>Send a message to room</h5>
						<input type='text' value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder='Room Id' />
						<input
							type='text'
							value={chatContent}
							onChange={(e) => setChatContent(e.target.value)}
							placeholder='Message'
						/>
						<button>Send Message</button>
					</form>
				</Col>
				<Col xs='6' className='bg-info'>
					<Container fluid>
						<Row>
							<Col xs='12'>
								<form className='bg-warning h-100 p-2' onSubmit={handleCreateRoom}>
									<h5>Create a Room</h5>
									<input
										type='text'
										value={roomName}
										onChange={(e) => setRoomName(e.target.value)}
										placeholder='Room Name'
									/>
									<select value={roomType} onChange={(e) => setRoomType(e.target.value as any)}>
										<option value='single'>single</option>
										<option value='group'>group</option>
									</select>
									<button>Create Room</button>
								</form>
							</Col>
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
