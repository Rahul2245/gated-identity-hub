CREATE TABLE IF NOT EXISTS oauth_authorization_requests (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    client_id VARCHAR(255) NOT NULL,

    user_id INTEGER NOT NULL,

    redirect_uri TEXT NOT NULL,

    scopes TEXT[] DEFAULT ARRAY[]::TEXT[],

    state TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);