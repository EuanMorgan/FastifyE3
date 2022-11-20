import prisma from "src/utils/prisma";

// TODO: type input
export const createUser = async (input: any) => {
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
