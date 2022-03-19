const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

// setup express server

const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000","https://snippetmanagerak.netlify.app"] ,
    credentials: true,
})
);
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server started on port" +PORT));

//set up routers

app.use("/snippet", require("./routers/snippetRouter"));
app.use("/auth", require("./routers/userRouter"));

//connet to monogDB

mongoose.connect(process.env.MBD_CONNECT_STRING);
