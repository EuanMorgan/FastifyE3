import {createServer} from './utils/createServer';

const startServer = async () => {
  const server = await createServer();
  server.listen({
    port: 4000,
    host: '0.0.0.0', //NOTE: It is important to define the host
    // as 0.0.0.0 for docker as it doesn't know what localhost is
  });

  console.log(`Server listening `);
};
startServer();
