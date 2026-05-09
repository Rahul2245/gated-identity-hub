CREATE TABLE IF NOT EXISTS oauth_consents (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id INTEGER NOT NULL,

    client_id VARCHAR(255) NOT NULL,

    scopes TEXT[] DEFAULT ARRAY[]::TEXT[],

    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);