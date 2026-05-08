const {createOAuthClient}=require("./oauth.service");

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

module.exports = {
    registerClient
};