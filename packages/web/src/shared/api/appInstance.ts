import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_SERVER_HOST}/api` || "http://localhost:4000/api";

const appAxiosInstance = axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
});

export default appAxiosInstance;
