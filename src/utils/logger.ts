import pino from 'pino';
// https://www.fastify.io/docs/latest/Reference/Logging/
export const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
};

// Fastify will use a built in logger and automatically
// log events
// The logger is attatched the the fastify instance and request objects
// So we can use it in our routes
// However, we export a global logger here to use it in other places

const logger = pino(envToLogger['development']);

export default logger;
