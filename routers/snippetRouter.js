const router = require("express").Router();
const Snippet = require("../models/snippetModel");

// READ SNIPPETS
router.get("/", async (req, res) => {
    try{
     const snippets = await Snippet.find();
     res.json(snippets);
    }
    catch {
        res.status(500).send();
    }
})

// CREATE SNIPPETS
router.post("/", async (req,res) => {
    try {
    const {title, description, code} = req.body;

    if(!description && !code) {
        return res.status(400).json({errorMessage: "You need to enter atleast a desc or code."});
    }

    const newSnippet = new Snippet({
        title, description, code
    });

   const savedSnippet =  await newSnippet.save();

    res.json(savedSnippet);
}
catch(err) {
    res.status(500).send();
}
});

// UPDATE SNIPPETS
router.put("/:id", async (req, res) => {
    try {
        const { title, description, code} = req.body;
        const snippetId = req.params.id;
        
        //check if snippetID is given
        if (!snippetId) {
            return res.status(400).json({errorMessage: "No snippet Id"});
        }

        const existingSnippet = await Snippet.findById(snippetId);
        if (!existingSnippet){
            return res.status(400).json({errorMessage: "No snippet with this ID is found"});
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
router.delete("/:id", async (req, res) => {
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

        await existingSnippet.delete();

        res.json(existingSnippet);
    }
    catch {
        res.status(500).send();
    }
})

module.exports = router;