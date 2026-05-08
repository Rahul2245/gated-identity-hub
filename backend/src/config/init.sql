CREATE TABLE IF NOT EXISTS oauth_clients (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    app_name VARCHAR(255) NOT NULL,

    client_id VARCHAR(255) UNIQUE NOT NULL,

    client_secret TEXT NOT NULL,

    redirect_uris TEXT[] NOT NULL,

    scopes TEXT[] DEFAULT ARRAY[]::TEXT[],

    created_by INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);