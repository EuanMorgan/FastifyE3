import fastify from "fastify";
import config from "./config";
import { loggerConfig } from "./logger";
import authRoutes from "src/modules/auth/auth.route";
import fjwt from "./plugins/jwt";
import { validatorCompiler, serializerCompiler } from "fastify-type-provider-zod";
import errorHandler from "./plugins/errorHandler";

// Encapsulate the server creation in a function
// so we can use it in tests
export const createServer = async () => {
	const app = fastify({
		logger: loggerConfig[config.NODE_ENV],
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

	// This will catch any unhandled errors and return a 500
	// https://www.fastify.io/docs/latest/Reference/Server/#seterrorhandler
	// https://www.fastify.io/docs/latest/Reference/Errors/
	app.register(errorHandler);

	// @fastify/jwt is a plugin that allows us to easily add JWT authentication
	app.register(fjwt);

	// Zod is a validation library that allows us to create schemas and use those as our json schema validation
	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);

	// Register routes
	// Add prefixes to the routes so they are all under /api/:moduleName
	app.register(authRoutes, {
		prefix: "/api/auth",
	});

	return app;
};
