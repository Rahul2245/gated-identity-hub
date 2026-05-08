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


module.exports = {
    validateCreateClient
};