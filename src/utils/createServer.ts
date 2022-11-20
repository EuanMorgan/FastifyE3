import fastify from 'fastify';

// Encapsulate the server creation in a function
// so we can use it in tests
export const createServer = async () => {
  const app = fastify(); //todo logger

  return app;
};
