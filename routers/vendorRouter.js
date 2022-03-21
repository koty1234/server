const router = require("express").Router();
const CreditAppCustom = require("../models/creditAppCustom");
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
            website,
          } = req.body;

    //check if fields are empty
    if(!companyName || !address || !city || !yib) {
            return res.status(400).json({errorMessage: "You need to fill eveyrthing out."});
    }
    //check if vendor already exists
    const existingPhone = await Vendor.findOne({ businessPhone });
    const existingEmail = await Vendor.findOne({ businessEmail });
    if (existingPhone || existingEmail)
      return res.status(400).json({
        errorMessage: "An account with this email already exists.",
      });

    //create new vendor in database

    const newVendor = new Vendor({
      creatorId: userId,
      userIds: [{"admin" :userId}],
      companyName,
      address,
      city,
      postalCode,
      presidentName,
      yib,
      businessPhone,
      businessEmail,
      website,
    });

await newVendor.save();
res.status(200).send();
  }

catch (err) {
      res.status(500).send();
      console.log(err);
    }
});

// get a vendor based off ID
router.get("/:id", auth, async (req, res) => {
  // try to find by userId attached to vendor
  const vendorId = req.params.id;
  try{
   let vendor = await Vendor.findById(vendorId);
   res.json(vendor);
   res.status(200).send();
  }
  catch {
      res.status(500).send();
  }
})

// update a vendor based off ID
router.put("/:id", auth, async (req, res) => {
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
      website,
    } = req.body;
      const vendorId = req.params.id;
      
      //check if snippetID is given
      if (!vendorId) {
          return res.status(400).json({errorMessage: "No vendor Id"});
      }

      const existingVendor = await Vendor.findById(vendorId);
      if (!existingVendor){
          return res.status(400).json({errorMessage: "No vendor with this ID is found"});
      }

      //will need to fix for unauthorized
      //if(existingSnippet.userIds.toString() != req.user){
       //   return res.status(401).json({errorMessage: "Unauthorized"});
      //}

      
      existingVendor.companyName = companyName;
      existingVendor.address = address;
      existingVendor.city = city;
      existingVendor.postalCode = postalCode;
      existingVendor.presidentName = presidentName;
      existingVendor.yib = yib;
      existingVendor.businessPhone = businessPhone;
      existingVendor.businessEmail = businessEmail;
      existingVendor.website = website;

      const saveVendor = await existingVendor.save();

      res.json(saveVendor);
  }
  catch {
      res.status(500).send();
  }
})

// add custom cred app ID to vendor
router.patch("/updateCustomCreditApp/:id", auth, async (req, res) => {
try {
        const vendorId = req.params.id;
        const {passedId} = req.body;

        if (!passedId) {
          return res.status(400).json({errorMessage: "No passed ID"});
      }

      const existingVendor = await Vendor.findById(vendorId);
      if (!existingVendor){
        return res.status(400).json({errorMessage: "No vendor with this ID is found"});
      }

      //check if already has customCreditApp
      if (!existingVendor.customCredAppId[0]){
        existingVendor.customCredAppId = [{currentCustomApp: passedId}];
      }
      else {
        oldCustomCreditApp = existingVendor.customCredAppId[0].currentCustomApp;
        existingVendor.customCredAppId = [{currentCustomApp: passedId}, 
          {oldCustomApp: oldCustomCreditApp}];
      }
      existingVendor.save();
      res.json(existingVendor).send();

}
    catch(err) {
        res.status(500).send();
        console.log(err);
    }

})

// create custom credit app
router.post("/creditapp/custom/:id", auth, async (req, res) => {
  try {
    const {
      qOne,
      qTwo,
      qThree,
      qFour,
      qFive,
      qSix,
      qSeven,
      qEight,
      qNine,
      qTen,
    } = req.body;
    const vendorId = req.params.id;
    const creatorId = req.user;

    if(!qOne){
      return res.status(400).json({errorMessage: "You need to enter atleast one custom question."});
    }

    if(!req.user) {
      return res.status(400).json({errorMessage: "Nobody signed in"});
  }

  const newCustomCreditApp = new CreditAppCustom({
    creatorId, 
    vendorId, 
    qOne,
    qTwo,
    qThree,
    qFour,
    qFive,
    qSix,
    qSeven,
    qEight,
    qNine,
    qTen,
  });

  const savedCustomCreditApp = await newCustomCreditApp.save();
  res.json(savedCustomCreditApp);
  }
  catch (err) {
    res.status(500).send();
    console.log(err);
  }
})

// update custom credit app TODO
router.put("/creditapp/custom/:id", auth, async (req, res) => {
  try {
    const {
      qOne,
      qTwo,
      qThree,
      qFour,
      qFive,
      qSix,
      qSeven,
      qEight,
      qNine,
      qTen,
    } = req.body;
    const vendorId = req.params.id;
    const creatorId = req.user;

    const existingCustomCredApp = CreditAppCustom.findById()
    if(!qOne){
      return res.status(400).json({errorMessage: "You need to enter atleast one custom question."});
    }

    if(!req.user) {
      return res.status(400).json({errorMessage: "Nobody signed in"});
  }

  const newCustomCreditApp = new CreditAppCustom({
    creatorId, 
    vendorId, 
    qOne,
    qTwo,
    qThree,
    qFour,
    qFive,
    qSix,
    qSeven,
    qEight,
    qNine,
    qTen,
  });

  const savedCustomCreditApp = await newCustomCreditApp.save();
  res.json(savedCustomCreditApp);
  }
  catch (err) {
    res.status(500).send();
    console.log(err);
  }
})

module.exports = router;