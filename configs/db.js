
import { neon } from "@neondatabase/serverless";
import { drizzle } from 'drizzle-orm/neon-http';


// Initialize the Neon SQL client
const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DATABASE_URL);

// Initialize Drizzle with the schema
export const db = drizzle(sql);
