require("dotenv").config({ path: "../.env" });

const express = require("express");
const cookieParser = require("cookie-parser");

const logger =require("./middlewares/logger");
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

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});