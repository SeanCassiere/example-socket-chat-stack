import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import { useSelector } from "react-redux";

import { selectAuthUserState } from "#root/shared/redux/store";

export const NavbarItem = () => {
	const { isLoggedIn } = useSelector(selectAuthUserState);
	return (
		<div>
			<Navbar bg='light' variant='light'>
				<Container>
					<Navbar.Brand as={Link} to={isLoggedIn ? "/chat" : "/"}>
						Navbar
					</Navbar.Brand>
					<Nav className='me-auto'>
						{!isLoggedIn && (
							<>
								<Nav.Link as={Link} to='/login'>
									Login
								</Nav.Link>
								<Nav.Link as={Link} to='/register'>
									Register
								</Nav.Link>
							</>
						)}
						{isLoggedIn && (
							<>
								<Nav.Link as={Link} to='/profile'>
									Profile
								</Nav.Link>
								<Nav.Link as={Link} to='/chat'>
									Chat
								</Nav.Link>
								<Nav.Link as={Link} to='/logout'>
									Logout
								</Nav.Link>
							</>
						)}
					</Nav>
				</Container>
			</Navbar>
		</div>
	);
};

export default NavbarItem;
