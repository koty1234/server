const router = require("express").Router();
const auth = require("../middleware/auth");
const Reference = require("../models/referenceModel");
const User = require("../models/userModel");

// creates a new master app
router.post("/", auth, async (req, res) => {
    try{
        const {
          companyId,
          referenceName,
          referencePhoneNumber,
          referenceEmail,
          refStatus,
          payHistory,
          length,
          offerCredit,
          notes,
        } = req.body;

        if(!companyId){
            return res.status(400).json({errorMessage: "Whoops! Something went wrong"}).send();
    }

    const newReference = new Reference({
        creatorId: req.user,
        companyId: companyId,
        referenceName: referenceName || '',
        referencePhoneNumber: referencePhoneNumber || '',
        referenceEmail: referenceEmail || '',
        refStatus: refStatus ||'',
        payHistory: payHistory || '',
        length: length || '',
        offerCredit: offerCredit || '',
        notes: notes || '',
    });

    const reference = await newReference.save();
    res.status(200).json(reference).send();

    }
    catch (err) {
        res.status(500).send({errorMessage: "Whoops! Something went wrong."});
        console.log(err);
      }
});

// get all references for Contractor
router.get("/company/:id", auth, async (req, res) => {
  try{
   let references = await Reference.find({ companyId: req.params.id});
   if(!references)  res.json({errorMessage: "No references found."});
   res.json(references);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({errorMessage: "Whoops! Something went wrong."});
  }
})

// update a reference by Id
router.patch("/company/:id", auth, async (req, res) => {
  try{
    const {
      referenceName,
      referencePhoneNumber,
      referenceEmail,
      refLength
    } = req.body;

const existingReference = await Reference.findById(req.params.id)
if(!existingReference){
  return res.status(400).json({errorMessage: "No reference found"});
}
if(!req.user) {
  return res.status(400).json({errorMessage: "Nobody signed in"});
}  

//checks for Authorization
let user = await User.findById(req.user);
if(existingReference.companyId.toString() != user.companyId.toString()){
  return res.status(400).json({errorMessage: "Unauthorized"});
}

existingReference.referenceName = referenceName;
existingReference.referencePhoneNumber = referencePhoneNumber;
existingReference.referenceEmail = referenceEmail;
existingReference.refLength = refLength;

const saveReference = await existingReference.save();
res.json(saveReference);
  }
catch (err) {
  res.status(500).json({errorMessage: "Whoops! Something went wrong."}).send();
  console.log(err);
}
})


module.exports = router;