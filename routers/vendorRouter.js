const router = require("express").Router();
const CreditAppCustom = require("../models/creditAppCustom");
const Vendor = require("../models/vendorModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
//note
//creates a new vendor -> sends to finishSetup()
router.post("/", auth, async (req, res) => {
    const userId = req.user;
    try {
        const {
            companyName,
            address,
            city,
            state,
            postalCode,
            presidentName,
            yib,
            businessPhone,
            businessEmail,
            website,
          } = req.body;

    //check if fields are empty
    if(!companyName || !address || !city || !yib || !businessPhone || !businessEmail) {
            return res.status(400).json({errorMessage: "You need to fill eveyrthing out."}).send();
    }
    //check if vendor already exists (based off email and phone)
    const existingPhone = await Vendor.findOne({ businessPhone });
    const existingEmail = await Vendor.findOne({ businessEmail });
    if (existingPhone || existingEmail)
      return res.status(400).json({
        errorMessage: "An account with this email or phone number already exists.",
      });

    //VALIDATION SUCCESSFUL
    //create new vendor in database with creator as default ADMIN
    const newVendor = new Vendor({
      creatorId: userId,
      userIds: [{"admin" :userId}],
      companyName,
      address,
      city,
      state,
      postalCode,
      presidentName,
      yib,
      businessPhone,
      businessEmail,
      website,
    });

    const vendor = await newVendor.save();
    let vendorId = vendor._id;
    res.status(200).json(vendor).send();

    // once complete, send to finishSetup()
    finishSetup(vendorId,userId);
    }


catch (err) {
      res.status(500).json({errorMessage: "Whoops! Something went wrong."}).send();
      console.log(err);
    }
});

// adds three custom credit apps + attaches Vendor ID to creator.
async function finishSetup(vendorId, userId) {
  
  // creates Default Custom Credit App
  const defaultCreditApp = new CreditAppCustom({
    creatorId :userId,
    vendorId: vendorId,
    title: "Default",
    qOne: "",
    qTwo: "",
    qThree: "",
    qFour: "",
    qFive: "",
    qSix: "",
    qSeven: "",
    qEight: "",
    qNine: "",
    qTen: "",
    tandc: "",
  });
  const savedDefaultCreditApp = await defaultCreditApp.save();
  // creates Residential Custom Credit App
  const residentialCreditApp = new CreditAppCustom({
    creatorId :userId,
    vendorId: vendorId,
    title: "Residential",
    qOne: "",
    qTwo: "",
    qThree: "",
    qFour: "",
    qFive: "",
    qSix: "",
    qSeven: "",
    qEight: "",
    qNine: "",
    qTen: "",
    tandc: "",
  });
  const savedResidentialCreditApp = await residentialCreditApp.save();
  // creates Commercial Custom Credit App
  const commercialCreditApp = new CreditAppCustom({
    creatorId :userId,
    vendorId: vendorId,
    title: "Commercial",
    qOne: "",
    qTwo: "",
    qThree: "",
    qFour: "",
    qFive: "",
    qSix: "",
    qSeven: "",
    qEight: "",
    qNine: "",
    qTen: "",
    tandc: "",
  });
  const savedCommercialCreditApp = await commercialCreditApp.save();
  // attaches IDs to vendor
  const existingVendor = await Vendor.findById(vendorId);
  existingVendor.customCredAppId = [
  {"Default" :savedDefaultCreditApp._id}, 
  {"Residential" : savedResidentialCreditApp._id},
  {"Commercial" : savedCommercialCreditApp._id
  }]
  existingVendor.save();

  // attach vendorID to user.
  const existingUser = await User.findById(userId);
  existingUser.vendorId = vendorId;
  existingUser.save();
}

// get a vendor by passing vendorId
router.get("/:id", auth, async (req, res) => {
  try{
   let vendor = await Vendor.findById(req.params.id);
   if(vendor.userIds[0].admin != req.user)  res.json({errorMessage: "Unauthorized"})
   res.json(vendor);
  }
  catch (err) {
    res.status(500).json({errorMessage: "Whoops! Something went wrong."}).send();
    console.log(err);
  }
})

// update a vendor by passing vendorId
router.patch("/:id", auth, async (req, res) => {
  try {
    const {
      companyName,
      address,
      city,
      state,
      postalCode,
      presidentName,
      yib,
      businessPhone,
      businessEmail,
      website,
    } = req.body;
      const vendorId = req.params.id;
      
      //check if vendorId is passed
      if (!vendorId) {
          return res.status(400).json({errorMessage: "No vendor ID passed"});
      }

      // check if Authorized
      const existingVendor = await Vendor.findById(vendorId);
      if (!existingVendor)
          return res.status(400).json({errorMessage: "No vendor with this ID is found"});

      // check if Authorized
      if(existingVendor.userIds[0].admin != req.user)  
          return res.status(400).json({errorMessage: "Unauthorized"});

      
      existingVendor.companyName = companyName;
      existingVendor.address = address;
      existingVendor.city = city;
      existingVendor.state = state;
      existingVendor.postalCode = postalCode;
      existingVendor.presidentName = presidentName;
      existingVendor.yib = yib;
      existingVendor.businessPhone = businessPhone;
      existingVendor.businessEmail = businessEmail;
      existingVendor.website = website;
      const saveVendor = await existingVendor.save();
      res.json(saveVendor);
  }
  catch (err) {
    res.status(500).json({errorMessage: "Whoops! Something went wrong."}).send();
    console.log(err);
  }
})

// get a customCredApp from Id
router.get("/customcreditapp/:id", auth, async (req, res) => {
  // try to find by Id attached to vendor
  const customCredAppId = req.params.id;
  try{
   let customCredApp = await CreditAppCustom.findById(customCredAppId);

   //checks for Authorization
   let user = await User.findById(req.user);

   if(customCredApp.vendorId.toString() != user.vendorId.toString()){
     return res.status(400).json({errorMessage: "Unauthorized"});
   }
    res.status(200).json(customCredApp);
  }
  catch (err) {
   // res.status(500).json({errorMessage: "Whoops! Something went wrong."});
    console.log(err);
  }
})

// update a customCredApp from Id
router.patch("/customcreditapp/:id", auth, async (req, res) => {
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
      tandc,
    } = req.body;

    const existingCustomCredApp = await CreditAppCustom.findById(req.params.id)
    if(!existingCustomCredApp){
      return res.status(400).json({errorMessage: "No custom credit app found"});
    }
    if(!req.user) {
      return res.status(400).json({errorMessage: "Nobody signed in"});
    }
    //checks for Authorization
    let user = await User.findById(req.user);
    if(existingCustomCredApp.vendorId.toString() != user.vendorId.toString()){
      return res.status(400).json({errorMessage: "Unauthorized"});
    }

    existingCustomCredApp.qOne = qOne;
    existingCustomCredApp.qTwo = qTwo;
    existingCustomCredApp.qThree = qThree;
    existingCustomCredApp.qFour = qFour;
    existingCustomCredApp.qFive = qFive;
    existingCustomCredApp.qSix = qSix;
    existingCustomCredApp.qSeven = qSeven;
    existingCustomCredApp.qEight = qEight;
    existingCustomCredApp.qNine = qNine;
    existingCustomCredApp.qTen = qTen;
    existingCustomCredApp.tandc = tandc;
  
  const savedCustomCredApp = await existingCustomCredApp.save();
  res.json(savedCustomCredApp);
  }
  catch (err) {
    res.status(500).json({errorMessage: "Whoops! Something went wrong."}).send();
    console.log(err);
  }
})

module.exports = router;