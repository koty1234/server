const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/userModel");
const Company = require("../models/companyModel");
const CreditApplication = require("../models/creditApplicationModel");
const MasterApplication = require("../models/masterApplicationModel");
const { uploadFileToS3, getObject } = require('../s3');
const Vendor = require("../models/vendorModel");
const Reference = require("../models/referenceModel");
const CreditAppCustom = require("../models/creditAppCustom");
const { findRenderedDOMComponentWithClass } = require("react-dom/test-utils");

// creates a new master app pulling together the companyId, vendorId & creditApplicationId
router.post("/", auth, async (req, res) => {
    try{
        const {
          companyId,
          vendorId,
          creditApplicationId,
          status,
          references,
          bank,
        } = req.body;

        if(!creditApplicationId || !vendorId){
            return res.status(400).json({errorMessage: "Whoops! Something went wrong"});
    }

    const newMasterApp = new MasterApplication({
        companyId: companyId,
        vendorId: vendorId,
        creditApplicationId: creditApplicationId,
        status: status,
        references: references || 0,
        bank: bank || false,
    });

    const masterApp = await newMasterApp.save();
    res.status(200).json(masterApp);
    }
    catch (err) {
        res.status(500).json({errorMessage: "Whoops! Something went wrong."});
        console.log(err);
      }
});

// get a master app by Id
router.get("/details/:id", auth, async (req, res) => {
  try{
   let masterApp = await MasterApplication.findById(req.params.id);
   if(!masterApp)  res.status(400).json({errorMessage: "No credit application found."});
   if(!masterApp.creditApplicationId) res.status(400).json({errorMessage: "Whoops! Something went wrong"})
   res.status(200).json(masterApp);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({errorMessage: "Whoops! Something went wrong."});
  }
})

//WILL NEED TO LIMIT RESULTS LATER
// get all master apps for specific Vendor
router.get("/vendor/:id", auth, async (req, res) => {
  try{
   let masterApps = await MasterApplication.find({ vendorId: req.params.id});

   //checks if any credit apps are found
   if(!masterApps)  res.status(400).json({errorMessage: "No credit application found."});

   res.status(200).json(masterApps);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({errorMessage: "Whoops! Something went wrong."});
  }
})

//joins together all details for a complete credit app PDF
router.get("/full/:id", async (req, res)=> {

  const response = {
    creatorName : "",
    creatorPosition: "",
    companyName: "",
    address: {},
    presidentName: "",
    businessType: "",
    yib: "",
    revenue: "",
    phoneNumber: "",
    email: "",
    website: "",
    refArray: {},
    qOne: "",
    qTwo: "",
    qThree: "",
    qFour: "",
    qFive: "",
    tandc: "",
    aOne: "",
    aTwo: "",
    aThree: "",
    aFour: "",
    aFive: "",
    tandcConfirmed: false,
    signature: "",
    dateCompleted: "",
    status: "",
    logo: "",
  }

  //check to make sure ID was passed
  if(!req.params.id){
    console.log(err);
    res.status(500).json({errorMessage: "Whoops! Something went wrong."});
  }

  //getCreditApp
  let creditApp = await CreditApplication.findById(req.params.id);
  //get Custom Questions
  let customQuestions = await CreditAppCustom.findById(creditApp.customCredAppId);
  //Get User details
  let user = await User.findById(creditApp.creatorId);
  //Get Company details
  let company = await Company.findById(creditApp.companyId);
  //Get Reference details
  let referenceArray = await Reference.find({companyId: creditApp.companyId});
  //get Logo
  try{
    const vendor = await Vendor.findById(customQuestions.vendorId);
    if(vendor.logoKey){
    response.logo = getObject(vendor.logoKey);
    }
    else response.logo = "https://public-images-for-cred-pay.s3.amazonaws.com/uploadLogoDefaultImage";
}
catch(err) {
    console.log(err);
}

//format date
let formattedDate = creditApp.updatedAt.toString();
console.log(formattedDate);
formattedDate = formattedDate.slice(3,15);

  response.creatorName = user.firstName + " " + user.lastName;
  response.creatorPosition = user.position || "Unknown Position";
  response.companyName = company.companyName;
  response.address = company.address + " " + company.city + ", " + company.postalCode;
  response.presidentName = company.presidentName;
  response.yib = company.yib;
  response.businessType = company.businessType;
  response.phoneNumber = company.businessPhone;
  response.email = company.businessEmail;
  response.revenue = company.revenue;
  response.website = company.website || " ";
  response.refArray = referenceArray;
  response.qOne = customQuestions.qOne;
  response.qTwo = customQuestions.qTwo;
  response.qThree = customQuestions.qThree;
  response.qFour = customQuestions.qFour;
  response.qFive = customQuestions.qFive;
  response.tandc = customQuestions.tandc;
  response.aOne = creditApp.aOne;
  response.aTwo = creditApp.aTwo;
  response.aThree = creditApp.aThree;
  response.aFour = creditApp.aFour;
  response.aFive = creditApp.aFive;
  response.tandcConfirmed = true;
  response.signature = creditApp.signature;
  response.dateCompleted = formattedDate;
  response.status = "PENDING";

  res.status(200).json(response);

})

module.exports = router;