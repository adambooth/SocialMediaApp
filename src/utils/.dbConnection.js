//import pg
import pg from "pg";

//create a pool

export const db = new pg.Pool({
  connectionString: process.env.NEXT_PUBLIC_DATABASE_URL,
});
