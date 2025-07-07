import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Create the Neon HTTP client
const sql = neon(process.env.DATABASE_URL!);

// Initialize Drizzle with the Neon client
export const db = drizzle(sql);
