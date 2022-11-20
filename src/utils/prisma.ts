import {PrismaClient} from '@prisma/client';
import logger from './logger';
// Export a Prisma singleton
const prisma = new PrismaClient();

export default prisma;

prisma.$on('beforeExit', async () => {
  logger.info('Closing prisma connection');
});
