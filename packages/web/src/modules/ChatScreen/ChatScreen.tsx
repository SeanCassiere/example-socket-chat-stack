import { socketAddUserToRoom, socketCreateNewRoom, socketSendMessageToRoom } from "#root/shared/api/socket.service";
import { selectChatRoomsState } from "#root/shared/redux/store";
import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux";

export const ChatScreen = () => {
	const { myRooms } = useSelector(selectChatRoomsState);
	const [roomId, setRoomId] = useState("");
	const [chatContent, setChatContent] = useState("");

	const [roomName, setRoomName] = useState("");
	const [roomType, setRoomType] = useState<"single" | "group">("single");

	const [guestUserId, setGuestUserId] = useState("");

	function handleSendMessageSubmit(e: React.SyntheticEvent) {
		e.preventDefault();
		socketSendMessageToRoom(roomId, chatContent);
		setChatContent("");
	}

	function handleCreateRoom(e: React.SyntheticEvent) {
		e.preventDefault();
		socketCreateNewRoom({ type: roomType, name: roomName });
	}

	function handleJoinGuestToRoom(e: React.SyntheticEvent) {
		e.preventDefault();
		socketAddUserToRoom({ roomId, userId: guestUserId });
	}

	return (
		<Container className='mt-2 mb-2' fluid>
			<Row>
				<Col xs='6'>
					<Row>
						<Col>
							<form className='h-100 p-2' onSubmit={handleCreateRoom}>
								<h5>Create a Room</h5>
								<input
									type='text'
									value={roomName}
									onChange={(e) => setRoomName(e.target.value)}
									placeholder='Room Name'
									required
								/>
								<select value={roomType} onChange={(e) => setRoomType(e.target.value as any)}>
									<option value='single'>single</option>
									<option value='group'>group</option>
								</select>
								<button type='submit'>Create Room</button>
							</form>
						</Col>
					</Row>
					<Row>
						<Col>
							<div>
								<h5>My Rooms</h5>
								{myRooms.map((r) => (
									<Card key={r.roomId} className='m-2'>
										<Card.Header>
											ID: {r.roomId}, Type: {r.type}
											<Button onClick={() => setRoomId(r.roomId)} size='sm'>
												Select
											</Button>
										</Card.Header>
										<Card.Body>
											<Card.Text>
												<p>{r.name}</p>
											</Card.Text>
										</Card.Body>
									</Card>
								))}
							</div>
						</Col>
					</Row>
				</Col>
				<Col xs='6' className='bg-info'>
					<Row>
						<Col>
							<form className='h-100 p-2' onSubmit={handleJoinGuestToRoom}>
								<h5>Join userId to room</h5>
								<input
									type='text'
									value={roomId}
									onChange={(e) => setRoomId(e.target.value)}
									placeholder='Room Id'
									required
								/>
								<input
									type='text'
									value={guestUserId}
									onChange={(e) => setGuestUserId(e.target.value)}
									placeholder='User Id'
									required
								/>
								<button type='submit'>Join guest to this room</button>
							</form>
						</Col>
					</Row>
					<Row>
						<Col>
							<form className='h-100 p-2' onSubmit={handleSendMessageSubmit}>
								<h5>Send a message to room</h5>
								<input
									type='text'
									value={roomId}
									onChange={(e) => setRoomId(e.target.value)}
									placeholder='Room Id'
									required
								/>
								<input
									type='text'
									value={chatContent}
									onChange={(e) => setChatContent(e.target.value)}
									placeholder='Message'
									required
								/>
								<button type='submit'>Send Message</button>
							</form>
						</Col>
					</Row>
				</Col>
			</Row>
		</Container>
	);
};

export default ChatScreen;
