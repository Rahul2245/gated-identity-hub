const {createOAuthClient,getUserClients,deleteOAuthClient,getOAuthClientByClientId}=require("./oauth.service");

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

        return res.json({
            message:
                "OAuth authorize request valid",

            client: {
                app_name: client.app_name,
                scopes: scope
                    ? scope.split(" ")
                    : []
            }
        });
    }catch (err) {

        console.error(err);

        return res.status(400).json({
            error: err.message
        });
    }
}

module.exports = {
    registerClient,
    getClients,
    removeClient,
    authorize
};