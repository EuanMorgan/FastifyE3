import envSchema from 'env-schema';
import {Type, Static} from '@sinclair/typebox';
// Typesafe environment variables

const schema = Type.Object({
  HOST: Type.String({
    default: '0.0.0.0',
  }),
  PORT: Type.Number({
    default: 4000,
  }),
  DATABASE_URL: Type.String(),
});

type Env = Static<typeof schema>;

export const config = envSchema<Env>({
  schema,
  dotenv: true,
});
