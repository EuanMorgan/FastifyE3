import { FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify";
import { defaultResponse, errorResponse } from "../../types/globalSchemas";
import { getMeHandler, loginHandler, registerHandler } from "./auth.controller";
import {
	getMeResponseSchema,
	loginInputSchema,
	loginResponseSchema,
	registerUserInputSchema,
} from "./auth.schema";

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
				tags: ["Auth"],
				summary: "Register a new user",
				description:
					"Register a new user with an email and password. The email must be unique and the password must be at least 6 characters long",
				body: registerUserInputSchema,
				response: {
					201: defaultResponse,

					409: errorResponse.describe("Email already exists"),
				},
			},
		},
		registerHandler
	);

	app.post(
		"/login",
		{
			schema: {
				tags: ["Auth"],
				summary: "Login with an email and password",
				description: "Returns an access token that can be used to access protected routes",
				body: loginInputSchema,
				response: {
					200: loginResponseSchema,
				},
			},
		},
		loginHandler
	);

	app.get(
		"/me",
		{
			onRequest: app.authenticate,
			schema: {
				tags: ["Auth"],
				summary: "Get the logged in user",
				response: {
					200: getMeResponseSchema,
				},
				security: [
					{
						bearerAuth: [],
					},
				],
			},
		},
		getMeHandler
	);

	// Call the done callback when you are finished
	done();
};

export default authRoutes;
