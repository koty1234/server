const router = require("express").Router();
const User = require("../models/userModel");
const Company = require("../models/companyModel");
const Vendor = require("../models/vendorModel");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

  //creates a new vendor
  router.post("/", auth, async (req, res) => {
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