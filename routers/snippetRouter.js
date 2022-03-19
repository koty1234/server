const router = require("express").Router();
const auth = require("../middleware/auth");
const Snippet = require("../models/snippetModel");

// READ SNIPPETS
router.get("/", auth, async (req, res) => {
    try{
     const snippets = await Snippet.find({userId: req.user});
     res.json(snippets);
    }
    catch {
        res.status(500).send();
    }
})

// CREATE SNIPPETS
router.post("/", auth, async (req,res) => {
    try {
    const {title, description, code} = req.body;

    if(!description && !code) {
        return res.status(400).json({errorMessage: "You need to enter atleast a desc or code."});
    }

    if(!req.user) {
        return res.status(400).json({errorMessage: "Nobody signed in"});
    }

    const userId = req.user;
    const newSnippet = new Snippet({
        userId, title, description, code
    });

   const savedSnippet =  await newSnippet.save();

    res.json(savedSnippet);
}
catch(err) {
    res.status(500).send();
}
});

// UPDATE SNIPPETS
router.put("/:id", auth, async (req, res) => {
    try {
        const { title, description, code} = req.body;
        const snippetId = req.params.id;
        const snippetUserId = req.params.userId;
        
        //check if snippetID is given
        if (!snippetId) {
            return res.status(400).json({errorMessage: "No snippet Id"});
        }

        const existingSnippet = await Snippet.findById(snippetId);
        if (!existingSnippet){
            return res.status(400).json({errorMessage: "No snippet with this ID is found"});
        }

        if(existingSnippet.userId.toString() != req.user){
            return res.status(401).json({errorMessage: "Unauthorized"});
        }

        existingSnippet.title = title;
        existingSnippet.description = description;
        existingSnippet.code = code;

        const saveSnippet = await existingSnippet.save();

        res.json(saveSnippet);
    }
    catch {
        res.status(500).send();
    }
})

//DELETE SNIPPETS
router.delete("/:id", auth, async (req, res) => {
    try {
        const snippetId = req.params.id;
        
        //check if snippetID is given
        if (!snippetId) {
            return res.status(400).json({errorMessage: "No snippet Id"});
        }

        const existingSnippet = await Snippet.findById(snippetId);
        if (!existingSnippet){
            return res.status(400).json({errorMessage: "No snippet with this ID is found"});
        }

        if(existingSnippet.userId.toString() != req.user){
            return res.status(401).json({errorMessage: "Unauthorized"});
        }

        await existingSnippet.delete();

        res.json(existingSnippet);
    }
    catch {
        res.status(500).send();
    }
})

module.exports = router;