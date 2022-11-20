import {z} from 'zod';
import dotenv from 'dotenv';
dotenv.config();
const schema = z.object({
  HOST: z.string().default('0.0.0.0'),
  PORT: z.number().default(4000),
  DATABASE_URL: z.string(),
});

export const config = schema.parse(process.env);
