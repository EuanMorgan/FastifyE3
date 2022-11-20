import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import { ZodError, ZodIssue } from "zod";

const errorHandler = (app: FastifyInstance, options: FastifyPluginOptions, done: () => void) => {
	app.setErrorHandler((error, request, reply) => {
		request.log.error(error, "Error handler");

		// If we catch a ZodError, return a 400 and the error message
		// I like to format the erors with .flatten() so they are easier to parse on the frotnend
		// Then, I add the error code as well so the frontend can handle it
		// https://github.com/colinhacks/zod/blob/master/ERROR_HANDLING.md#error-handling-in-zod
		if (error instanceof ZodError) {
			return reply.status(400).send({
				errors: error.flatten((issue: ZodIssue) => ({
					message: issue.message,
					errorCode: issue.code,
				})).fieldErrors,
			});
		}

		// Handle JWT errors
		if (error.code?.startsWith("FST_JWT_")) {
			return reply.code(error.statusCode || 401).send({
				errorCode: error.code,
				message: error.message,
			});
		}

		// Otherwise, return a 500
		reply.status(500).send({
			errorCode: error.code,
			message: "Internal server error",
		});
	});

	done();
};

export default fp(errorHandler);
