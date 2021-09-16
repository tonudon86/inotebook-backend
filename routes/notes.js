const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");

const { body, validationResult } = require("express-validator");

const fetchuser = require("../middleware/fetchuser");

// route 1
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });

        res.json(notes);
    } catch (error) {
        console.log(error)
        res.status(500).send("some error has occurd")
    }
});

// route 2
router.post(
  "/addnote",
  [
    body("title", "enter a valid name").isLength({ min: 5 }),
    body("description", "enter a valid description ").isLength({ min: 5 }),
  ],
  fetchuser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        
 
    const { title, description, tag } = req.body;
    const note = new Notes({ title, description, tag, user: req.user.id });
    const savedNote = await note.save();

    res.json(savedNote);    } catch (error) {
        console.log(error)
        res.status(500).send("some error has occurd")
    }
  }
);


// route 3
router.put(
    "/updatenote/:id",fetchuser,async (req, res) => {
 
 
          
   
      const { title, description, tag } = req.body;

      try {

      const newNote={};
      if (title) {
        newNote.title=title
      }
      if(description){newNote.description=description}
      if(tag){newNote.tag=tag}

        
      let note =await Notes.findById(req.params.id);
      if(!note){return res.status(404).send("not found")};
      if (note.user.toString() !==req.user.id){
          return res.status(404).send("not allowed");

      }

      note =await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
      res.json({note});
            
    } catch (error) {
        console.log(error)
        res.status(500).send("some error has occurd")
    }
        
      }  );

module.exports = router;

// route 4
router.delete(
    "/deletenote/:id",fetchuser,async (req, res) => {
 
 
          
 

      try {

 
        
      let note =await Notes.findById(req.params.id);
      if(!note){return res.status(404).send("not found")};
      if (note.user.toString() !==req.user.id){
          return res.status(404).send("not allowed");

      }

      note =await Notes.findByIdAndDelete(req.params.id)
      res.json({"success":"Note has been deleted",note:note});
            
    } catch (error) {
        console.log(error)
        res.status(500).send("some error has occurd")
    }
        
      }  );

module.exports = router;
