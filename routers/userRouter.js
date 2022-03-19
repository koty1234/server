const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
    try {
        const {email, password, passwordVerify} = req.body;

    //validation
    if(!email || !password || !passwordVerify) {
            return res.status(400).json({errorMessage: "You need to fill eveyrthing out."});
    }

    if (password.length < 6) {
        return res.status(400).json({errorMessage: "Please enter a longer password."});
    }

    if (password != passwordVerify) {
        return res.status(400).json({errorMessage: "Your passwords do not match!"});
    }

    //no account existingSnippet
    const userExists = await User.findOne({email});
    if(userExists) {
        return res.status(400).json({errorMessage: "This account already exists."});
    }

    // password hashing
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //save user in database

    const newUser = new User({
        email,
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

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

    //validation
    if(!email || !password) {
            return res.status(400).json({errorMessage: "You need to fill eveyrthing out."});
    }

    //no account existingSnippet
    const userExists = await User.findOne({email});
    if(!userExists) {
        return res.status(401).json({errorMessage: "Wrong email or password!"});
    }
    const correctPassword = await bcrypt.compare(
        password,
        userExists.passwordHash
    );
    if(!correctPassword) {
        return res.status(401).json({errorMessage: "Wrong email or password!"});
    }

// create a JWT token

const token = jwt.sign(
    {
      id: userExists._id,
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

router.get("/loggedin", (req, res) => {
    try {
        const token = req.cookies.token;
        console.log(token);

        if(!token) {
            return res.json(null);
        }
        const validatedUser = jwt.verify(token, process.env.JWT_SECRET);
        res.json(validatedUser.id);
    }
    catch (err) {
        return res.json(null);
    }
})

router.get("/logOut", (req, res) => {
    try {
      res
        .cookie("token", "", {
          httpOnly: true,
          sameSite:
            process.env.NODE_ENV === "development"
              ? "lax"
              : process.env.NODE_ENV === "production" && "none",
          secure:
            process.env.NODE_ENV === "development"
              ? false
              : process.env.NODE_ENV === "production" && true,
          expires: new Date(0),
        })
        .send();
    } catch (err) {
      return res.json(null);
    }
  });

module.exports = router;