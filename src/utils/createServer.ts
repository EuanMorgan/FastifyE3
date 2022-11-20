import fastify from "fastify";
import config from "./config";
import type { FastifyRequest, FastifyReply } from "fastify";
import { loggerConfig } from "./logger";
import authRoutes from "src/modules/auth/auth.route";
import fjwt from "./jwt";
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
	app.register(fjwt);

	// Register routes
	app.register(authRoutes, {
		prefix: "/api/auth",
	});

	return app;
};
