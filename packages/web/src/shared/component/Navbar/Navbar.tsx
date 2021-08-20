import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";

export const NavbarItem = () => {
	return (
		<div>
			<Navbar bg='light' variant='light'>
				<Container>
					<Navbar.Brand as={Link} to='/'>
						Navbar
					</Navbar.Brand>
					<Nav className='me-auto'>
						<Nav.Link as={Link} to='/login'>
							Login
						</Nav.Link>
						<Nav.Link as={Link} to='/register'>
							Register
						</Nav.Link>
						<Nav.Link as={Link} to='/profile'>
							Profile
						</Nav.Link>
					</Nav>
				</Container>
			</Navbar>
		</div>
	);
};

export default NavbarItem;
