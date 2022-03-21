const router = require("express").Router();
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//creates a new user
router.post("/", async (req, res) => {
    try {
        const {firstName, lastName, position, phone, email, userSide, password, passwordVerify} = req.body;

    //validation
    if(!email || !password || !passwordVerify) {
            return res.status(400).json({errorMessage: "You need to fill eveyrthing out."});
    }
    if (password.length < 8) {
        return res.status(400).json({errorMessage: "Please enter a longer password."});
    }
    if (password != passwordVerify) {
        return res.status(400).json({errorMessage: "Your passwords do not match!"});
    }
    //check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        errorMessage: "An account with this email already exists.",
      });

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

    // create a JWT token

    const token = jwt.sign(
        {
          id: savedUser._id,
        },
        process.env.JWT_SECRET
      );
  
      res
        .cookie("token", token, {
          httpOnly: true,
          sameSite:
            process.env.NODE_ENV === "development"
              ? "lax"
              : process.env.NODE_ENV === "production" && "none",
          secure:
            process.env.NODE_ENV === "development"
              ? false
              : process.env.NODE_ENV === "production" && true,
        })
        .send();
    } catch (err) {
      res.status(500).send();
    }
  });

//used to update a user (primarily to add business)
router.patch("/", auth, async (req, res) => {
    try {
        const {passedId} = req.body;
        const userId = req.user;
        
        //check if ID is passed
        if (!passedId) {
            return res.status(400).json({errorMessage: "No user"});
        }

        // find existing user and determin UserSide
        const existingUser = await User.findById(userId);
        if (!existingUser){
            return res.status(400).json({errorMessage: "No user with this ID is found"});
        }
        // determind where to put userId
        if(existingUser.userSide == "vendor") existingUser.vendorId = passedId;
        else if(existingUser.userSide == "company") existingUser.companyId = passedId;
        else {
          //do stuff if userSide isn't set.
        }

        const saveUser = await existingUser.save();
        res.json(saveUser);
    }
    catch(err) {
        res.status(500).send();
        console.log(err);
    }
})

module.exports = router;