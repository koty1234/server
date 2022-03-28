const router = require("express").Router();
const Company = require("../models/companyModel");
const CreditApplication = require("../models/creditApplicationModel");
const auth = require("../middleware/auth");

// creates a new credit app
router.post("/", auth, async (req, res) => {
    const userId = req.user;
    const companyId = await Company.findById(userId);
    try{
        const {
            customCredAppId,
            aOne,
            aTwo,
            aThree,
            aFour,
            aFive,
            aSix,
            aSeven,
            aEight,
            aNine,
            aTen,
            tandc,
            tandcInternal,
            signature,
        } = req.body;

        if(!customCredAppId || !userId || !companyId){
            return res.status(400).json({errorMessage: "Whoops! Something went wrong"}).send();
    }

    const newCreditApp = new CreditApplication({
        creatorId: userId,
        companyId: companyId,
        customCredAppId: customCredAppId,
        aOne: aOne || '',
        aTwo: aTwo || '',
        aThree: aThree || '',
        aFour: aFour || '',
        aFive: aFive || '',
        aSix: aSix || '',
        aSeven: aSeven || '',
        aEight: aEight || '',
        aNine: aNine || '',
        aTen: aTen || '',
        tandc: tandc || '',
        tandcInternal: tandcInternal || '',
        signature: signature || '',
    });

    const creditApp = await newCreditApp.save();
    res.status(200).json(creditApp).send();

    }
    catch (err) {
        res.status(500).send({errorMessage: "Whoops! Something went wrong."});
        console.log(err);
      }
})


// get a credit application by Id
router.get("/:id", auth, async (req, res) => {
    try{
     let creditApp = await CreditApplication.findById(req.params.id);
     if(!creditApp.data)  res.json({errorMessage: "No credit application found."});
     if(!creditApp.data.customCredAppId) res.json({errorMessage: "Whoops! Something went wrong"})
     res.json(creditApp.data);
    }
    catch (err) {
      res.status(500).json({errorMessage: "Whoops! Something went wrong."}).send();
      console.log(err);
    }
  })

module.exports = router;