import { FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify";
import { defaultResponse } from "src/types/globalSchemas";
import { getMeHandler, loginHandler, registerHandler } from "./auth.controller";
import { loginInputSchema, registerUserInputSchema, userSchema } from "./auth.schema";

// Main flow is request -> route -> controller -> service -> database
// The reason for this is we can test the controller and service functions
// Services are where the DB calls should happen because that makes it easier to isolate and
// test the DB calls. The controller is where we do the business logic
// It's important to use something like Prometheus to track the performance of the database calls
// if we have these bundled into the controllers, it would be harder to track the performance of the DB calls
const authRoutes = (app: FastifyInstance, options: FastifyPluginOptions, done: () => void) => {
	app.post(
		"/register",
		{
			schema: {
				body: registerUserInputSchema,
				response: {
					201: defaultResponse,
					409: defaultResponse,
				},
			},
		},
		registerHandler
	);

	app.post(
		"/login",
		{
			schema: {
				body: loginInputSchema,
			},
		},
		loginHandler
	);

	app.get(
		"/me",
		{
			onRequest: app.authenticate,
			schema: {
				response: {
					200: userSchema,
				},
			},
		},
		getMeHandler
	);

	// Call the done callback when you are finished
	done();
};

export default authRoutes;
