const {createOAuthClient,
    getUserClients,
    deleteOAuthClient,
    getOAuthClientByClientId,
    createAuthorizationRequest,
getAuthorizationRequestById,
saveConsent,
createAuthorizationCode
                }=require("./oauth.service");

const {validateCreateClient,validateAuthorizeQuery}=require("./oauth.validation");

const registerClient = async (req,res)=>{
    try{
        validateCreateClient(req.body);

        const {
            appName,
            redirectUris,
            scopes
        } = req.body;

        const userId = req.user.id;

        const result =
            await createOAuthClient({
                appName,
                redirectUris,
                scopes,
                userId
            });

            return res.status(201).json({
                message: "OAuth client created",
                client_id: result.client.client_id,
                client_secret:result.rawClientSecret,
                 redirect_uris:
                result.client.redirect_uris
            });
    }catch (err) {

        console.error(err);

        return res.status(400).json({
            
            error: err.message
        });
    };
};

const getClients =async (req,res)=>{
    try{
        const clients =await getUserClients(req.user.id);
        return res.json({
            clients
        });

    }catch(err){
        console.error(err);
         return res.status(500).json({
            error: err.message
        });
    }
}

const removeClient = async (req,res)=>{
    try {
        const client = await deleteOAuthClient(
            req.params.id,
            req.user.id
        );

        if(!client){
            return res.status(404).json({
                error: "Client not found"
            });
        }
        return res.json({
            message: "Client deleted"
        });
        
    } catch (err) {
        return res.status(500).json({
            error:err.message
        });
        
    }
}

const authorize = async (req,res)=>{
    try{
        validateAuthorizeQuery(req.query);


        const {
            client_id,
            redirect_uri,
            scope,
            state
        } = req.query;

        //fetching oAuth client
        const client= await getOAuthClientByClientId(client_id);

        if(!client){
             return res.status(400).json({
                error: "Invalid client_id"
            });
        }

         // Validate redirect URI
        if (
            !client.redirect_uris.includes(
                redirect_uri
            )
        ) {

            return res.status(400).json({
                error: "Invalid redirect_uri"
            });
        }

        // Check login
        if (!req.user) {

            return res.status(401).json({
                error: "Login required"
            });
        }

        const scopes =
    scope
        ? scope.split(" ")
        : [];

const authRequest =
    await createAuthorizationRequest({
        clientId: client.client_id,
        userId: req.user.id,
        redirectUri: redirect_uri,
        scopes,
        state
    });

return res.json({

    message:
        "Authorization request created",

    consent: {

        request_id: authRequest.id,

        app_name: client.app_name,

        scopes
    }
});
    }catch (err) {

        console.error(err);

        return res.status(400).json({
            error: err.message
        });
    }
}

const approveConsent =async (
    req,res
)=>{
    try{
         const { request_id } = req.body;

        if (!request_id) {

            return res.status(400).json({
                error: "request_id required"
            });
        }

        const authRequest = await getAuthorizationRequestById(request_id);

        if(!authRequest){
            return res.status(404).json({
                error:
                "Authorization request not found"
            });
        }

        //save consent
        await saveConsent({

            userId:
                authRequest.user_id,

            clientId:
                authRequest.client_id,

            scopes:
                authRequest.scopes
        });

        //genrate authorization code
        const authCode = await createAuthorizationCode({
            clientId:
                    authRequest.client_id,

                userId:
                    authRequest.user_id,

                redirectUri:
                    authRequest.redirect_uri,

                scopes:
                    authRequest.scopes
        });

        //redirect URL
        const redirectUrl = new URL(authRequest.redirect_uri);

        redirectUrl.searchParams.set(
            "code",
            authCode.code
        );

          if (authRequest.state) {

            redirectUrl.searchParams.set(
                "state",
                authRequest.state
            );
        }

        return res.json({
             message:
                "Consent approved",

            redirect_to:
                redirectUrl.toString()
        });

    }catch (err) {
        return res.status(500).json({
            error:err.message
        });
    }
}

module.exports = {
    registerClient,
    getClients,
    removeClient,
    authorize,
    approveConsent
    
};