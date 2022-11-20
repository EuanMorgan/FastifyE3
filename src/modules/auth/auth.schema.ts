// Schema define the expected input and output of a route
// Fastify uses JSON schema to do this
// https://www.fastify.io/docs/latest/Reference/Validation-and-Serialization/
// However, I am using a plugin which allows me to define my schemas with Zod
// and has Zod as the validator
import { z } from "zod";

const baseAuthSchema = z.object({
	email: z.string().email().min(20),
	password: z.string().min(8),
});

export const registerUserInputSchema = baseAuthSchema.extend({
	name: z.string().nullish(),
});
export type RegisterUserInput = z.infer<typeof registerUserInputSchema>;

export const loginInputSchema = baseAuthSchema;
export type LoginInput = z.infer<typeof loginInputSchema>;

export const userSchema = registerUserInputSchema.extend({
	id: z.number(),
});
