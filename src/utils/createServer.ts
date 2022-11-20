import fastify from "fastify";
import config from "./config";
import type { FastifyRequest, FastifyReply, FastifyError } from "fastify";
import { loggerConfig } from "./logger";
import authRoutes from "src/modules/auth/auth.route";
import fjwt from "./jwt";
import {
	validatorCompiler,
	serializerCompiler,
	ResponseValidationError,
} from "fastify-type-provider-zod";
import { ZodError, ZodIssue } from "zod";

// Encapsulate the server creation in a function
// so we can use it in tests
export const createServer = async () => {
	const app = fastify({
		logger: loggerConfig[config.NODE_ENV],
	});

	// This will catch any unhandled errors and return a 500
	// https://www.fastify.io/docs/latest/Reference/Server/#seterrorhandler
	// https://www.fastify.io/docs/latest/Reference/Errors/
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

	// Register plugins

	// Like in JavaScript where everything is an object, in Fastify
	// everything is a plugin. Plugins can be used to extend the
	// functionality of Fastify, or to add new features to your app.
	// https://www.fastify.io/docs/latest/Guides/Plugins-Guide/

	// Plugins can be third party packages, or custom code that we package up
	// into a 'plugin' and then register that on our Fastify instance.
	// Even our routes are plugins, they are just functions that extend fastify
	// but utilising the built in .get(), .post() etc methods.

	// I've encapsulated the plugin registration in a function
	// to keep this file clean
	app.register(fjwt);

	// Zod
	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);

	// Register routes
	// Add prefixes to the routes so they are all under /api/:moduleName
	app.register(authRoutes, {
		prefix: "/api/auth",
	});

	return app;
};
