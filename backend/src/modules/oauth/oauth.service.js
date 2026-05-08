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


module.exports = {
    createOAuthClient
};