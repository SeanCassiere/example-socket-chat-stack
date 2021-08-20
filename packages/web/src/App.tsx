import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "#root/App.css";

import { Container } from "react-bootstrap";

import Routes from "./routes/Routes";

const App = () => {
	return (
		<Container className='h-100' fluid>
			<Routes />
		</Container>
	);
};

export default App;
