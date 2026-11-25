import dotenv from "dotenv";
import {fileURLToPath} from "node:url";
import pg from "pg";

const envPath = fileURLToPath(
    new URL("../.env", import.meta.url)
);

dotenv.config({path: envPath});

const {Pool} = pg;

const pool = new Pool({
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    database:process.env.DB_NAME,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD
});

export default pool;