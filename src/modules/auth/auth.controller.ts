import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyRequest, FastifyReply } from "fastify";
import { compareHash, generateHash } from "src/utils/bcrypt";
import { jwtSchema } from "src/utils/jwt";
import { LoginInput, RegisterUserInput } from "./auth.schema";
import { createUser, getUserByEmail, getUserById } from "./auth.service";

export const registerHandler = async (
	request: FastifyRequest<{
		Body: RegisterUserInput;
	}>,
	reply: FastifyReply
) => {
	try {
		const { email, password, name } = request.body;
		const hashedPassword = await generateHash(password);
		const user = await createUser({ email, password: hashedPassword, name });
		return reply.code(201).send({
			message: "User created successfully",
		});
	} catch (error) {
		request.log.error(error, "registerHandler: Error registering user");
		// When handling errors, it's important to check the error type
		// so we can return the correct status code
		if (error instanceof PrismaClientKnownRequestError) {
			// https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
			// P2002: Unique constraint failed on the {field_name}
			if (error.code === "P2002") {
				return reply.status(409).send({
					message: "That email is already in use",
				});
			}
		}
		// Rethrow the error if we don't know what it is
		// This will be caught upchain by the error handler
		throw error;
	}
};

export const loginHandler = async (
	request: FastifyRequest<{ Body: LoginInput }>,
	reply: FastifyReply
) => {
	try {
		const { email, password } = request.body;
		const user = await getUserByEmail(email);
		if (!user) {
			throw new Error("invalid");
		}
		const isPasswordValid = await compareHash(password, user.password);
		if (!isPasswordValid) {
			throw new Error("invalid");
		}
		// I'm using zod to validate the JWT payload, so we can just safely pass the full user object
		// and it ill strip out any extra fields
		const token = request.jwt.sign(jwtSchema.parse(user), { expiresIn: "15m" });
		return reply.send({
			token,
		});
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === "invalid") {
				return reply.status(401).send({
					message: "Invalid credentials",
				});
			}
		}

		throw error;
	}
};

export const getMeHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const user = await getUserById(request.user.id);

	return reply.send({
		user,
	});
};
