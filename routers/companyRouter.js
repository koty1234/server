const router = require("express").Router();
const User = require("../models/userModel");
const Company = require("../models/companyModel");
const Reference = require("../models/referenceModel");
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
req.session.company = company._id.toString();
res.status(200).send();
finishSetup(company._id, userId);
  }

catch (err) {
      res.status(500).send();
      console.log(err);
    }
  });

  // attaches companyId to reference for future use and easy access
  // creates 3X blank references for Contractor
  async function finishSetup(companyId, userId){
    const existingUser = await User.findById(userId);
    existingUser.companyId = companyId;
    existingUser.save();

    //Reference 1
    const referenceOne = new Reference({
      creatorId :userId,
      companyId : companyId
    });
    const savedReferenceOne = await referenceOne.save();

    //Reference 2
    const referenceTwo = new Reference({
      creatorId :userId,
      companyId : companyId
    });
    const savedReferenceTwo = await referenceTwo.save();

    //Reference 3
    const referenceThree = new Reference({
      creatorId :userId,
      companyId : companyId
    });
    const savedReferenceThree = await referenceThree.save();

  }

// get a company by passing companyId
router.get("/:id", auth, async (req, res) => {
  const companyId = req.params.id;
  try{
   let company = await Company.findById(companyId);
   res.status(200).json(company);
  }
  catch(err) {
      res.status(500).json(err);
  }
})

// update a company by passing companyId
router.patch("/:id", auth, async (req, res) => {
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
      
      //check if companyId is passed
      if (!companyId) {
          return res.status(400).json({errorMessage: "No company Id"});
      }

      const existingCompany = await Company.findById(companyId);
      if (!existingCompany){
          return res.status(400).json({errorMessage: "No company was found"});
      }

      //Checks for Authorization (USER has premission to edit Company)
      const existingUser = await User.findById(req.user);
      if(existingUser.companyId.toString() != companyId){
          return res.status(401).json({errorMessage: "Unauthorized"});
      }
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