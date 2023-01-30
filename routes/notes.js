const express=require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchUser')
const Notes=require('../models/Notes')
const { body, validationResult } = require("express-validator");//to validate notes 

//sare notes related end points yaha pe


//ROUTE 1: get all the notes using get:"/api/auth/getuser"  .Login required
router.get('/fetchallnotes',fetchuser,async (req,res)=>{ //request,response
    try {
        const notes=await Notes.find({user:req.user.id});
        res.json(notes) 
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");
    }
})


//ROUTE 2: add a new note using POST:"/api/auth/addnote"  .Login required
router.post('/addnote',fetchuser,[
    body('tittle','Enter a valid title please').isLength({min:3}),
    body('description','Description must be atleast 5 characters').isLength({min:5}),
],async (req,res)=>{ //request,response

    try {
        const {tittle,description,tag}=req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
        const note=new Notes({
            tittle,description,tag,user:req.user.id
        })
        const savedNote=await note.save();
        res.json(savedNote)   //saveNote is added to response
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");
    }
})

//ROUTE 3: Update an existing Note Using :PUT "/api/auth/updatenote" .Login required
router.put('/updatenote/:id',fetchuser,async (req,res)=>{ //request,response
    const {tittle,description,tag}=req.body;
    try {
        //create a newNote object
        const newNote={};
        if(tittle){newNote.tittle=tittle};
        if(description){newNote.description=description};
        if(tag){newNote.tag=tag};
        //insert only those entities to newNote that are need to update(those are in req)
        
        //find the note to be updated and update it
        let note=await Notes.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")};   //found by id given in link
        if(note.user.toString()!=req.user.id){  //requested user should be equal to user of id note
            return res.status(401).send("Not Allowed");
        }
        note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
        res.json({note});   //this returns response as json , and send returns simple text
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");
    }
})


//ROUTE 4: Delete an existing Note Using :POST "/api/auth/updatenote" .Login required
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{ //request,response
    try {
        
        //find the note to be delete and delete it
        let note=await Notes.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")};   //found by id given in link
        //allow deletion only if user owns this note
        if(note.user.toString()!=req.user.id){  //requested user should be equal to user of id note
            return res.status(401).send("Not Allowed");
        }
        note=await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success":"Note has been deleted",note:note});   //this returns response as json , and send returns simple text
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");
    }
})

    
//same endpoint pe POST , GET ,PUT alag alag kaam kar skte hai
module.exports=router 