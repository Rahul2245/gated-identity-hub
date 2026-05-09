CREATE TABLE IF NOT EXISTS oauth_authorization_codes (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code TEXT UNIQUE NOT NULL,

    client_id VARCHAR(255) NOT NULL,

    user_id INTEGER NOT NULL,

    redirect_uri TEXT NOT NULL,

    scopes TEXT[] DEFAULT ARRAY[]::TEXT[],

    expires_at TIMESTAMP NOT NULL,

    used BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);