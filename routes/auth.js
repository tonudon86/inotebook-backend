const express=require('express');
const router =express.Router();
const bcrypt = require('bcryptjs');
const User=require('../models/User')
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const JWT_SECRET="Harryisgoodb$oy"
const fetchuser=require('../middleware/fetchuser')
// route 1

router.post('/createuser',[  
body('name','enter a valid name').isLength({ min: 5 }),
body('email','enter a valid email ').isEmail(),
body('password','password must be a 5 charactor').isLength({ min: 5 })
], async (req,res)=>{
  // if there are error return bad request
  let success=false 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    // check email alredy exist or not
    try {
      
   
    let user=await User.findOne({email:req.body.email});
    if (user){
      return res.status(400).json({ success,error:"sorry a user with this email is already present"})
    };
    
    const salt = await bcrypt.genSaltSync(10);
    const secPass= await bcrypt.hash(req.body.password,salt)
    user = await User.create({
      name: req.body.name,
      email:req.body.email,
      password: secPass,
    }) 
    const data ={
      user:{
        id:user.id
      }
    }
    const authtoken=jwt.sign(data,JWT_SECRET);
    success=true;
    res.json({success,authtoken})
  } catch (error) {
      console.log(error)
      res.status(500).send("some error has occurd")
  }
})


// route 2

router.post('/login',[  
 
  body('email','enter a valid email ').isEmail(),
  body('password','password  cannot be blannk').exists()
  ], async (req,res)=>{

  // if there are error return bad request 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email,password}=req.body;
  try {
    
    let user=await User.findOne({email})
    if (!user){
      let success=false;
      return res.status(400).json({success,error:"Please login with correct credentials"})


    }

    const passwordCompare=await bcrypt.compare(password,user.password);

    if(!passwordCompare){
      let success=false;
      return res.status(400).json({success,error:"Please login with correct credentials"})
    };

    const data ={
      user:{
        id:user.id
      }
    };
    const authtoken=jwt.sign(data,JWT_SECRET);
let success=true;
    res.json({success, authtoken});
 
    } catch (error) {
      console.log(error)
      res.status(500).send("Internal server Error");
  }


  })




// route 3

  router.post('/getuser', fetchuser, async (req,res)=>{
        try {
          userId=req.user.id;
          const  user=await User.findById(userId).select("-password");
         
          res.send(user)
        } 
        catch (error) {
          console.log(error)
          res.status(500).send("some error has occurd")
      }
    })























module.exports=router