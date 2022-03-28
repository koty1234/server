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
    origin: ["http://localhost:3000","https://vendor-client-dev.herokuapp.com"] ,
    credentials: true,
})
);
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server started on port " +PORT));

//set up different routers
app.use("/user", require("./routers/userRouter"));
app.use("/vendor", require("./routers/vendorRouter"));
app.use("/company", require("./routers/companyRouter"));
app.use("/creditapp", require("./routers/creditAppRouter"));

//connet to monogDB
mongoose.connect(process.env.MBD_CONNECT_STRING);
