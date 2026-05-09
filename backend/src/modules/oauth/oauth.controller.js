const {createOAuthClient,getUserClients,deleteOAuthClient}=require("./oauth.service");

const {validateCreateClient}=require("./oauth.validation");

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

module.exports = {
    registerClient,
    getClients,
    removeClient
};