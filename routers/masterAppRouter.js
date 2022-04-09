const router = require("express").Router();
const auth = require("../middleware/auth");
const MasterApplication = require("../models/masterApplicationModel");

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

module.exports = router;