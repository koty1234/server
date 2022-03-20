const router = require("express").Router();
const User = require("../models/userModel");
const Company = require("../models/companyModel");
const Vendor = require("../models/vendorModel");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//creates a new company
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
      userIds: [{"admin" :userId}],
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

let company = await newCompany.save();
res.status(200).send();
  }

catch (err) {
      res.status(500).send();
    }
  });

// get a company based of userId
router.get("/:id", auth, async (req, res) => {
  // try to find by userId attached to company
  const companyId = req.params.id;
  try{
   let company = await Company.findById(companyId);
   res.json(company);
   res.status(200).send();
  }
  catch {
      res.status(500).send();
  }
})

// update a company based of UserId
router.put("/:id", auth, async (req, res) => {
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
      const companyId = req.params.id;
      
      //check if snippetID is given
      if (!companyId) {
          return res.status(400).json({errorMessage: "No company Id"});
      }

      const existingCompany = await Company.findById(companyId);
      if (!existingCompany){
          return res.status(400).json({errorMessage: "No company with this ID is found"});
      }

      //will need to fix for unauthorized
      //if(existingSnippet.userIds.toString() != req.user){
       //   return res.status(401).json({errorMessage: "Unauthorized"});
      //}

      
      existingCompany.companyName = companyName;
      existingCompany.address = address;
      existingCompany.city = city;
      existingCompany.postalCode = postalCode;
      existingCompany.presidentName = presidentName;
      existingCompany.yib = yib;
      existingCompany.businessType = businessType;
      existingCompany.businessPhone = businessPhone;
      existingCompany.businessEmail = businessEmail;
      existingCompany.revenue = revenue;
      existingCompany.website = website;
      existingCompany.facebook = facebook;
      existingCompany.instagram = instagram;
      existingCompany.twitter = twitter;
      existingCompany.linkedin = linkedin;

      const saveCompany = await existingCompany.save();

      res.json(saveCompany);
  }
  catch {
      res.status(500).send();
  }
})


module.exports = router;