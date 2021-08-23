import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { selectAuthUserState, selectChatRoomsState } from "#root/shared/redux/store";
import { useSocket } from "#root/shared/context/Socket.context";
import { chatGetAllUsers } from "#root/shared/redux/thunks/chatRooms.thunks";

export const DevScreen = () => {
	const dispatch = useDispatch();

	const {
		user: { userId: authUserId },
	} = useSelector(selectAuthUserState);
	const { myRooms, allUsers } = useSelector(selectChatRoomsState);

	// Socket methods
	const { sendMessage, createRoom, removeUser, addUser, createRoomWithGuests } = useSocket();

	const [roomId, setRoomId] = useState("");
	const [chatContent, setChatContent] = useState("");

	const [roomName, setRoomName] = useState("");
	const [roomType, setRoomType] = useState<"single" | "group">("single");

	const [guestUserId, setGuestUserId] = useState("");
	const [guestUsers, setGuestUsers] = useState<string[]>([]);

	useEffect(() => {
		dispatch(chatGetAllUsers());
	}, [dispatch]);

	function handleSendMessageSubmit(e: React.SyntheticEvent) {
		e.preventDefault();
		sendMessage(roomId, chatContent);
		setChatContent("");
	}

	function handleCreateRoom(e: React.SyntheticEvent) {
		e.preventDefault();
		createRoom(roomName, roomType);
	}

	function handleCreateRoomWithGuests(e: React.SyntheticEvent) {
		e.preventDefault();
		createRoomWithGuests(roomName, roomType, guestUsers);
	}

	function handleJoinGuestToRoom(e: React.SyntheticEvent) {
		e.preventDefault();
		addUser(roomId, guestUserId);
	}

	function handleLeaveRoom(e: React.SyntheticEvent) {
		e.preventDefault();
		removeUser(roomId, guestUserId);
	}

	return (
		<Container className='mt-2 mb-2' fluid>
			<Row>
				<Col xs='6'>
					<Row>
						<Col xs='12'>
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
											<Button variant='danger' onClick={() => removeUser(r.roomId, authUserId as string)} size='sm'>
												Leave
											</Button>
										</Card.Header>
										<Card.Body>
											<Card.Text>{r.name}</Card.Text>
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
								<h5>Join new userId to room</h5>
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
								<Button type='submit'>Join guest to this room</Button>
							</form>
						</Col>
					</Row>
					<Row>
						<Col>
							<form className='h-100 p-2' onSubmit={handleLeaveRoom}>
								<h5>Remove user from room</h5>
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
								<Button type='submit' variant='danger'>
									Remove user from this room
								</Button>
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
								<Button type='submit'>Send Message</Button>
							</form>
						</Col>
					</Row>
					<Row>
						<Col>
							<form className='h-100 p-2' onSubmit={handleCreateRoomWithGuests}>
								<hr />
								<h5>
									Create a Room with Guests{" "}
									<Button type='button' variant='danger' onClick={() => setGuestUsers([])}>
										Clear selection
									</Button>
								</h5>
								<p>Guests: {JSON.stringify(guestUsers)}</p>
								<input
									type='text'
									value={roomName}
									onChange={(e) => setRoomName(e.target.value)}
									placeholder='Room Name'
									required
								/>
								<Form.Select value={roomType} onChange={(e) => setRoomType(e.currentTarget.value as any)}>
									<option value='single'>single</option>
									<option value='group'>group</option>
								</Form.Select>
								<Form.Select multiple>
									{allUsers.map((user) => (
										<option
											key={`option-${user.userId}`}
											disabled={authUserId === user.userId}
											onClick={() => setGuestUsers((g) => [...g, user.userId])}
										>
											{user.username}
										</option>
									))}
								</Form.Select>
								<Button type='submit'>Create Room with guests</Button>
								<hr />
							</form>
						</Col>
					</Row>
				</Col>
			</Row>
		</Container>
	);
};

export default DevScreen;
