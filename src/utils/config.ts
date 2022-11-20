import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();
const schema = z.object({
	HOST: z.string().default("0.0.0.0"),
	PORT: z.number().default(4000),
	DATABASE_URL: z.string(),
	JWT_SECRET: z.string(),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
	console.error(
		"❌ Invalid environment variables:",
		JSON.stringify(parsed.error.format(), null, 4)
	);
	process.exit(1);
}

export default parsed.data;
