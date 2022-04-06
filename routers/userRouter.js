const router = require("express").Router();
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");


//creates a new user
router.post("/", async (req, res) => {
    try {
        const {firstName, lastName, position, phone, email, userSide, password, passwordVerify} = req.body;

    //checks to make required fields are filled
    if(!email || !password || !passwordVerify) {
            return res.status(400).json({errorMessage: "You need to fill eveyrthing out."});
    }
    //checks to make sure password is atleast 8 characters long.
    if (password.length < 8) {
        return res.status(400).json({errorMessage: "Please enter a longer password."});
    }
    //checks to make sure passwords match
    if (password != passwordVerify) {
        return res.status(400).json({errorMessage: "Your passwords do not match!"});
    }
    //check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        errorMessage: "An account with this email already exists.",
      });

    //VALIDATION PASSED

    // password hashing
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //create new User in database

    const newUser = new User({
        firstName,
        lastName,
        position,
        email,
        phone,
        userSide,
        passwordHash
    });

    const savedUser = await newUser.save();

    req.session.data = {userId: savedUser._id.toString()};
    console.log(req.session.data);
    res.status(200).json(req.session.data);

    } catch (err) {
      res.status(500).send({errorMessage: "Whoops! Something went wrong."});
      console.log(err);
    }
});

// used to verify if browser is logged in
router.get("/isloggedin", async (req, res) => {
  try {
    if (!req.session.data) return res.json(null);
    const userId = req.session.data.userId;
    //res.json(userId);
  res.cookie("name", "express", {
    httpOnly: true,
    sameSite:
    process.env.NODE_ENV === "development"
      ? "lax"
      : process.env.NODE_ENV === "production" && "none",
  secure:
    process.env.NODE_ENV === "development"
      ? false
      : process.env.NODE_ENV === "production" && true,
}).send();
  } catch (err) {
    res.status(500).send({errorMessage: "Whoops! Something went wrong."});
    console.log(err);
  }
});

// get user details
router.get("/", auth, async (req, res) => {
  try {
    if (!req.user) return res.json({errorMessage: "No user"});
    const existingUser = await User.findById(req.user);
    res.json(existingUser);
  } catch (err) {
    res.status(500).send({errorMessage: "Whoops! Something went wrong."});
    console.log(err);
  }
});

//updates user infomation
router.patch("/", auth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
    } = req.body;

      const existingUser = await User.findById(req.user);
      existingUser.firstName = firstName,
      existingUser.lastName = lastName,
      existingUser.email = email,
      existingUser.phone = phone,
      existingUser.position = position
      const saveUser = await existingUser.save();
      res.json(saveUser);
  }
  catch (err) {
    res.status(500).json({errorMessage : "Whoops! Something went wrong."}).send();
    console.log(err);
  }
})

module.exports = router;