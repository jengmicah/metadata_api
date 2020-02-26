import * as pg from 'pg';

const pgconfig = {
    user: 'postgres',
    database: 'testdb',
    password: 'postgres',
    host: 'localhost',
    port: 5432
};

const pool = new pg.Pool(pgconfig);
console.log(`DB Connection Settings: ${JSON.stringify(pgconfig)}`);

/**
 * Single Query to Postgres
 * @param sql: the query for store data
 * @param data: the data to be stored
 * @return result
 */
export const sqlToDB = async (sql: string, data: string[][]) => {
    console.log(`sqlToDB() sql: ${sql} | data: ${data}`);

    try {
        return pool.query(sql, data)

    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * Retrieve a SQL client with transaction from connection pool. If the client is valid, either
 * COMMMIT or ROALLBACK needs to be called at the end before releasing the connection back to pool.
 */
export const getTransaction = async () => {
    console.log(`getTransaction()`);
    // @ts-ignore
    const client: pg.Client = await pool.connect();
    try {
        await client.query('BEGIN');
        return client;
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * Rollback transaction
 */
export const rollback = async (client: pg.Client) => {
    if (typeof client !== 'undefined' && client) {
        try {
            console.log(`sql transaction rollback`);
            await client.query('ROLLBACK');
        } catch (error) {
            throw new Error(error.message);
        } finally {
            await client.end();
        }
    } else {
        console.log(`rollback() not excuted. client is not set`);
    }
};

/**
 * Commit transaction
 */
export const commit = async (client: pg.Client) => {
    console.log(`sql transaction committed`);
    try {
        await client.query('COMMIT');
    } catch (error) {
        throw new Error(error.message);
    } finally {
        await client.end();
    }
};