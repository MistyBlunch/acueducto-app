import { teardownTestDatabase } from '../helpers/test-database';

export default async (): Promise<void> => {
  await teardownTestDatabase();
};