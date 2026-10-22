import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Task } from '../entities/Task';
import { Comment } from '../entities/Comment';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const AppDataSource = new DataSource ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User, Task, Comment], 
    synchronize: false,
    // synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'development',
    migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
});


