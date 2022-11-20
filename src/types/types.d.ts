import { JWT } from "@fastify/jwt";
import { JWTUser } from "../utils/plugins/jwt";

// Extend fastify JWT to type the user available on the request object

declare module "@fastify/jwt" {
	interface FastifyJWT {
		user: JWTUser;
	}
}

declare module "fastify" {
	interface FastifyRequest {
		jwt: JWT;
	}

	interface FastifyInstance {
		authenticate: () => Promise<void>;
	}
}
