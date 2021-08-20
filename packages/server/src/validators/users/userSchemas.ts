import * as Yup from "yup";

const username = Yup.string().min(3).required();
const password = Yup.string().min(3).required();
const firstName = Yup.string().min(3).required();
const lastName = Yup.string().min(3).required();

export const userLoginBodySchema = Yup.object().shape({
	username,
	password,
});

export const registerUserBodySchema = Yup.object().shape({
	firstName,
	lastName,
	username,
	password,
});

export const selfUserUpdateBodySchema = Yup.object().shape({
	firstName: Yup.string().min(3),
	lastName: Yup.string().min(3),
	password: Yup.string().min(3),
});
