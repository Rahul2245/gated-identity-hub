require("dotenv").config({ path: "../.env" });

const express = require("express");
const cookieParser = require("cookie-parser");

const logger =require("./middlewares/logger");
const { connectDB } = require("./config/db");

const routes = require("./routes");
const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(logger);



app.use("/api",routes);
const PORT = process.env.PORT||5000;




app.get('/',(req,res)=>{
    res.send("server running");
});

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
};

startServer();