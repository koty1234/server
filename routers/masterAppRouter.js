const router = require("express").Router();
const auth = require("../middleware/auth");
const MasterApplication = require("../models/masterApplicationModel");

// creates a new master app
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
            return res.status(400).json({errorMessage: "Whoops! Something went wrong"}).send();
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
    res.status(200).json(masterApp).send();

    }
    catch (err) {
        res.status(500).send({errorMessage: "Whoops! Something went wrong."});
        console.log(err);
      }
});

// get a master app by Id
router.get("/details/:id", auth, async (req, res) => {
  try{
   let masterApp = await MasterApplication.findById(req.params.id);
   if(!masterApp)  res.json({errorMessage: "No credit application found."});
   if(!masterApp.creditApplicationId) res.json({errorMessage: "Whoops! Something went wrong"})
   res.json(masterApp);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({errorMessage: "Whoops! Something went wrong."});
  }
})

// get a master app by Id
router.get("/vendor/:id", auth, async (req, res) => {
  try{
   let masterApps = await MasterApplication.find({ vendorId: req.params.id});
   if(!masterApps)  res.json({errorMessage: "No credit application found."});
   res.json(masterApps);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({errorMessage: "Whoops! Something went wrong."});
  }
})


module.exports = router;