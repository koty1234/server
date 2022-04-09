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

    req.session.user = savedUser._id.toString();
    res.status(200).json(req.session);

    } catch (err) {
      res.status(500).send({errorMessage: "Whoops! Something went wrong."});
      console.log(err);
    }
});

// used to verify if browser is logged in
router.get("/isloggedin", async (req, res) => {
  try {
    if (!req.session.user) return res.json(null);
    const userId = req.session.user;
    res.json(userId);
  } catch (err) {
    res.status(500).send({errorMessage: "Whoops! Something went wrong."});
    console.log(err);
  }
});

// log user in
router.post("/login", async (req, res) => {
  const {email, password} = req.body;

  if(!email || !password) {
    return res.status(400).json({errorMessage: "You need to enter an email and password!."});
}
  try {
    const existingUser = await User.findOne({email});
    if(!existingUser) {
      return res.status(401).json({errorMessage: "Wrong email or password"});
    }

    const isCorrectPassword = await bcrypt.compare(password, existingUser.passwordHash);
    if (!isCorrectPassword) {
      return res.status(401).json({errorMessage: "Wrong email or password"});
    }

    req.session.user = existingUser._id.toString();
    res.status(200).json(req.session);

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