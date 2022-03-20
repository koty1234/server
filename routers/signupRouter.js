const router = require("express").Router();
const User = require("../models/userModel");
const Company = require("../models/companyModel");
const Vendor = require("../models/vendorModel");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//creates a new user
router.post("/", async (req, res) => {
    try {
        const {firstName, lastName, position, phone, email, password, passwordVerify} = req.body;

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

//creates a new company
  router.post("/company", auth, async (req, res) => {
    const userId = req.user;
    try {
        const {
            companyName,
            address,
            city,
            postalCode,
            presidentName,
            yib,
            businessType,
            businessPhone,
            businessEmail,
            revenue,
            website,
            facebook,
            instagram,
            twitter,
            linkedin,
          } = req.body;

    //check if fields are empty
    if(!companyName || !address || !city || !yib) {
            return res.status(400).json({errorMessage: "You need to fill eveyrthing out."});
    }
    //check if company already exists
    const existingPhone = await Company.findOne({ businessPhone });
    const existingEmail = await Company.findOne({ businessEmail });
    if (existingPhone || existingEmail)
      return res.status(400).json({
        errorMessage: "An account with this email already exists.",
      });

    //create new Company in database

    const newCompany = new Company({
      creatorId: userId,
      companyName,
      address,
      city,
      postalCode,
      presidentName,
      yib,
      businessType,
      businessPhone,
      businessEmail,
      revenue,
      website,
      facebook,
      instagram,
      twitter,
      linkedin,
    });

await newCompany.save();
res.status(200).send();
  }

catch (err) {
      res.status(500).send();
    }
  });

  //creates a new vendor
  router.post("/vendor", auth, async (req, res) => {
    const userId = req.user;
    try {
        const {
            companyName,
            address,
            city,
            postalCode,
            presidentName,
            yib,
            businessPhone,
            businessEmail,
          } = req.body;

    //check if fields are empty
    if(!companyName || !address || !city || !yib) {
            return res.status(400).json({errorMessage: "You need to fill eveyrthing out."});
    }
    //check if company already exists
    const existingPhone = await Vendor.findOne({ businessPhone });
    const existingEmail = await Vendor.findOne({ businessEmail });
    if (existingPhone || existingEmail)
      return res.status(400).json({
        errorMessage: "An account with this email already exists.",
      });

    //create new Company in database

    const newVendor = new Vendor({
      creatorId: userId,
      companyName,
      address,
      city,
      postalCode,
      presidentName,
      yib,
      businessPhone,
      businessEmail,
    });

await newVendor.save();
res.status(200).send();
  }

catch (err) {
      res.status(500).send();
      console.log(err);
    }
  });

module.exports = router;