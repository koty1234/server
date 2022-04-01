const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const MongoStore = require('connect-mongo');
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

//connet to monogDB
const connection = mongoose.connect(process.env.MBD_CONNECT_STRING);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server started on port " +PORT));

const sessionStore = new MongoStore({
    mongoUrl: process.env.MBD_CONNECT_STRING,
    collection: 'sessions'
});

if(process.env.NODE_ENV === "development"){
    app.use(session({ 
        name: "Session",
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        cookie: {
            maxAge: 1000*60*60
        }
}));
}
else {
    console.log("here");
    app.use(session({ 
        name: "Session",
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
        httpOnly: true,
        cookie: {
            maxAge: 1000*60*60,
            sameSite: "None",
            secure: true,

        }
}));
};

//set up different routers
app.use("/user", require("./routers/userRouter"));
app.use("/vendor", require("./routers/vendorRouter"));
app.use("/company", require("./routers/companyRouter"));
app.use("/creditapp", require("./routers/creditAppRouter"));
