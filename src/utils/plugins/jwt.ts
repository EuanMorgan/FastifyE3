import type { FastifyInstance, FastifyRequest, FastifyReply, FastifyPluginOptions } from "fastify";
import jwt from "@fastify/jwt";
import config from "../config";
import fp from "fastify-plugin";
import { z } from "zod";

// Export a zod schema so we can strip out any unwanted properties
// And ensure the user object is of the type we expect
export const jwtSchema = z.object({
	id: z.number(),
	email: z.string().email(),
});
export type JWTUser = z.infer<typeof jwtSchema> & {
	sessionId: string;
	iat: number;
	exp: number;
};

const fjwt = (app: FastifyInstance, options: FastifyPluginOptions, done: () => void) => {
	// Configuration for @fastify/jwt

	app.register(jwt, {
		// Use a secret string or public/private key pair
		// Can also do things like deny tokens based on a blacklist using the trusted callback
		secret: config.JWT_SECRET,
	});

	// Add a 'decorator' to the fastify instance
	// A decorator is just a function that is attached to the fastify instance#
	// This decorator simply calls jwt verify
	// https://www.fastify.io/docs/latest/Reference/Decorators/
	// We also need to tell typescript about this decorator, I do in types.d.ts
	app.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			await request.jwtVerify();
		} catch (err) {
			reply.send(err);
		}
	});

	// I want the jwt methods be available on the request object
	// so we can use them in the controllers, therefore I am going to
	// add a preHandler hook to all routes which adds the jwt methods
	// Fastify allows us to hook in to the request lifecycle at many points
	// https://www.fastify.io/docs/latest/Reference/Hooks/
	app.addHook("preHandler", (req, reply, next) => {
		// NOTE: We also need to inform TypeScript that we
		// have modified the request object, I'm doing that in
		// types.d.ts
		req.jwt = app.jwt;
		return next();
	});

	// Call the done callback when you are finished
	done();
};

// We need to wrap the plugin with fastify-plugin to make it globally accessible
// This is because Fastify encapsulates all plugins to the context they were created in
// https://www.fastify.io/docs/latest/Reference/Encapsulation/
// https://www.npmjs.com/package/fastify-plugin
export default fp(fjwt);
