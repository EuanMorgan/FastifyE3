import { FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify";

const authRoutes = (
	app: FastifyInstance,
	options: FastifyPluginOptions,
	done: () => void
) => {
	app.get("/", req => {
		const jwt = req.jwt.sign(
			{
				id: 1,
				username: "test",
			},
			{
				expiresIn: "1h",
			}
		);
		return { hello: "world", jwt };
	});

	app.get(
		"/verify",
		{
			onRequest: app.authenticate,
		},
		req => {
			return { hello: "world", user: req.user };
		}
	);

	// Call the done callback when you are finished
	done();
};

export default authRoutes;
