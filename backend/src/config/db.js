const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log("Database connected successfully");
        client.release();
    } catch (err) {
        console.error("Database connection failed", err);
        process.exit(1);
    }
};

module.exports = {
    pool,
    connectDB,
};