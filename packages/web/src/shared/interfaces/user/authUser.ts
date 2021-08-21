export interface UserForApplicationWithToken {
	userId: string;
	username: string;
	firstName: string;
	lastName: string;
	token: string;
	refreshToken: string;
}
export interface UserForApplication {
	userId: string;
	username: string;
	firstName: string;
	lastName: string;
}
