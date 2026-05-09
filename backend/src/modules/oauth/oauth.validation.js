const validateCreateClient = (body)=>{
     const { appName, redirectUris } = body;

     if (!appName) {
        throw new Error("App name required");
    }

    if (!redirectUris || !Array.isArray(redirectUris)) {
        throw new Error("Redirect URIs required");
    }

     redirectUris.forEach((uri) => {
        try {
            new URL(uri);
        } catch {
            throw new Error(`Invalid URI: ${uri}`);
        }
    });
}

const validateAuthorizeQuery=(query)=>{
     const {
        client_id,
        redirect_uri,
        response_type,
         scope,
        state
    } = query;

     if (!client_id) {
        throw new Error("client_id required");
    }
     if (!redirect_uri) {
        throw new Error("redirect_uri required");
    }
    if (!response_type) {
        throw new Error("response_type required");
    }

     // Only authorization code flow
    if (response_type !== "code") {

        throw new Error(
            "Only authorization code flow supported"
        );
    }

    if(scope){
        if(typeof scope !== "string"){
            throw new Error(
                "scope must be string"
            );
        }

        const scopes = scope.split(" ");
        if(scopes.length===0){
            throw new Error(
                "invalid scopes"
            );
        }
    }

    if(state){
         if (typeof state !== "string") {

            throw new Error(
                "state must be string"
            );
        }
         if (state.length > 255) {

            throw new Error(
                "state too long"
            );
        }
    }

}

const validateTokenRequest = (body)=>{
    const {
        grant_type,
        client_id,
        client_secret,
        code,
        redirect_uri
    } = body;

    if(grant_type!=="authorization_code"){
        throw new Error(
            "Unsupported grant_type"
        );
    }

     if (!client_id) {
        throw new Error(
            "client_id required"
        );
    }

    if (!client_secret) {
        throw new Error(
            "client_secret required"
        );
    }

    if (!code) {
        throw new Error(
            "authorization code required"
        );
    }

    if (!redirect_uri) {
        throw new Error(
            "redirect_uri required"
        );
    }

}


module.exports = {
    validateCreateClient,
    validateAuthorizeQuery,
    validateTokenRequest
};