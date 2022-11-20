import prisma from "../../utils/prisma";
import { RegisterUserInput } from "./auth.schema";

// TODO: type input
export const createUser = async (input: RegisterUserInput) => {
	return prisma.user.create({
		data: {
			email: input.email,
			password: input.password,
			name: input.name,
		},
	});
};

export const getUserByEmail = async (email: string) => {
	return prisma.user.findUnique({
		where: {
			email,
		},
	});
};

export const getUserById = async (id: number) => {
	console.log(id);
	return prisma.user.findUnique({
		where: {
			id,
		},
	});
};
