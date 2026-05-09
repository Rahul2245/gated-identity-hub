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

const getOAuthClientByClientId = async (clientId)=>{
    const query = `
    SELECT *
    FROM oauth_clients
    WHERE client_id=$1`;

    const result = await pool.query(query,[clientId]);

    return result.rows[0];
}

const createAuthorizationRequest = async ({
    clientId,
    userId,
    redirectUri,
    scopes,
    state

})=>{
    const query = `
        INSERT INTO oauth_authorization_requests
        (
            client_id,
            user_id,
            redirect_uri,
            scopes,
            state
        )
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *
    `;

    const values = [
        clientId,
        userId,
        redirectUri,
        scopes,
        state
    ];
    const result = await pool.query(query,values);
    return result.rows[0];
}

const getAuthorizationRequestById = async (requestId)=>{
    const query = `
    SELECT *
    FROM oauth_authorization_requests
    WHERE id = $1
    `;

    const result = await pool.query(query,[requestId]);
    return result.rows[0];
}

const saveConsent = async ({
   userId,
    clientId,
    scopes
})=>{
    const query =`
     INSERT INTO oauth_consents
        (
            user_id,
            client_id,
            scopes
        )
        VALUES ($1,$2,$3)
        RETURNING *
    `;
    
    const result = await pool.query(
        query,[
            userId,
            clientId,
            scopes
        ]
    );

    return result.rows[0];

}

const createAuthorizationCode = async({
    clientId,
    userId,
    redirectUri,
    scopes
})=>{
    const code = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now()+5*60*1000);

    const query =` 
     INSERT INTO oauth_authorization_codes
        (
            code,
            client_id,
            user_id,
            redirect_uri,
            scopes,
            expires_at
        )
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING *
    `;

    const values = [
        code,
        clientId,
        userId,
        redirectUri,
        scopes,
        expiresAt
    ];

    const result = await pool.query(query,values);
    return result.rows[0];
}


const getAuthorizationCode =async (code)=>{
    const query =`
    SELECT *
     FROM oauth_authorization_codes
        WHERE code = $1
    `;

    const result = await pool.query(query,[code]);

    return result.rows[0];
}

const markAuthorizationCodeUsed = async (code)=>{
    const query =`
    UPDATE oauth_authorization_codes
        SET used = TRUE
        WHERE code = $1
    `;

    await pool.query(query,[code]);
}



module.exports = {
    createOAuthClient,
    getUserClients,
    deleteOAuthClient,
    getOAuthClientByClientId,
    createAuthorizationRequest,
    getAuthorizationRequestById,
    saveConsent,
    createAuthorizationCode,
    getAuthorizationCode,
    markAuthorizationCodeUsed
};