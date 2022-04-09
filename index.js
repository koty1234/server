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
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://vendor-client-dev.herokuapp.com",
        "https://company-client-dev.herokuapp.com"] ,
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

  var sess =  { 
        name: "Session",
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
        cookie: {
            httpOnly: true,
            maxAge: 1000*60*60*24
        }
};

if (app.get('env') === 'production') {
app.set('trust proxy', 1);
sess.cookie.secure = true;
sess.cookie.sameSite = 'none';
}

app.use(session(sess));

//set up different routers
app.use("/user", require("./routers/userRouter"));
app.use("/vendor", require("./routers/vendorRouter"));
app.use("/company", require("./routers/companyRouter"));
app.use("/creditapp", require("./routers/creditAppRouter"));
app.use("/masterapp", require("./routers/masterAppRouter"));
app.use("/reference", require("./routers/referenceRouter"));
