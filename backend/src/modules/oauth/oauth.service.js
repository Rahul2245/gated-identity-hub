const crypto = require("crypto");
const bcrypt = require("bcrypt");

const {pool}=require("../../config/db");

const createOAuthClient = async ({
    appName,
    redirectUris,
    scopes,
    userId
})=>{

     const clientId = crypto.randomBytes(32).toString("hex");
     const rawClientSecret = crypto.randomBytes(64).toString("hex");

     const hashedSecret = await bcrypt.hash(rawClientSecret,10);

     const query = `
      INSERT INTO oauth_clients
        (
            app_name,
            client_id,
            client_secret,
            redirect_uris,
            scopes,
            created_by
        )
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING *
    `;

    const values = [
        appName,
        clientId,
        hashedSecret,
        redirectUris,
        scopes || [],
        userId
    ];

    const result = await pool.query(query, values);

    return {
        client: result.rows[0],
        rawClientSecret
    };
}

const getUserClients = async (userId)=>{

    const query = `
    SELECT
            id,
            app_name,
            client_id,
            redirect_uris,
            scopes,
            created_at
        FROM oauth_clients
        WHERE created_by = $1
        ORDER BY created_at DESC
    
    `;

    const result = await pool.query(query, [userId]);

    return result.rows;
}

const deleteOAuthClient = async (
    id,
    userId
) => {

    const query = `
        DELETE FROM oauth_clients
        WHERE id = $1
        AND created_by = $2
        RETURNING *
    `;

    const result =
        await pool.query(query, [
            id,
            userId
        ]);

    return result.rows[0];
};
module.exports = {
    createOAuthClient,
    getUserClients,
    deleteOAuthClient
};