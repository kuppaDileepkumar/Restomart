import { DataSource } from 'typeorm';
import { Task } from './entities/Task'; // adjust path

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite', // this should be a valid SQLite file or a new one
  entities: [Task],
  synchronize: true, // auto creates tables; use with caution in production
  logging: false,
});
