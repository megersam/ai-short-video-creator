import { neon } from "@neondatabase/serverless";
import {drizzle} from 'drizzle-orm/neon-http';
const sql = neon(process.env.DRIZZLE_DATABASE_URL);
export const db = drizzle(sql);