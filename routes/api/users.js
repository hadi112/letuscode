const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const authenticateToken = require('../../authenticatetoken')


//load input validation
const validinputregister = require('../../validation/register'); 
const validinputlogin = require('../../validation/login');

// @route   GET/api/users/test
// @desc    Test user routes
// @access  public
router.get('/test',(req,res)=>
    res.json({msg:'user route working'} 
));


//@route    POST/api/users/register
//@desc     register users
//@access   public
router.post('/register',(req,res)=>{
    const { errors, isvalid } = validinputregister(req.body)

    //check validation
    if(!isvalid){
        console.log(errors);
    }

    User.findOne({email:req.body.email})
        .then(user=>{
            if(user){
                errors.email = 'Email already exists';
                return res.status(400).json({errors});
            }else{
                const newUser = new User({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password,
                    username:req.body.username
                });
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                               .then(user => res.json(user))
                               .catch(err => console.log(err));
                    })
                })
            }
        });
}); 


//@route    POST /api/users/login
//@desc     login users || returning JWT token
//@access   public
router.post('/login',(req,res)=>{

    const { errors, isvalid } = validinputlogin(req.body)

    //check validation
    if(!isvalid){
        res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    //find user by email
    User.findOne({email})
        .then(user => {
            //check for user
            if(!user){
                errors.email = 'User not found'
                res.status(400).json(errors)
            }
    //check for password
    bcrypt.compare(password,user.password)
    .then(isMatch  => {
      if(isMatch){
        //user matched  
        var payload = {id : user.id, name : user.name, email : user.email } // create JWT Token

        //sign token
        jwt.sign(payload,keys.secretkey,{expiresIn:3600000},(err,token)=>{
            res.json({
                success:true,
                token:'jwt ' + token
            })
        });
      }
      else{
          errors.pasword = 'Password incorrect';
          res.status(400).json(errors);
      }
    })
  })
});


//@route    GET /api/users/current
//@desc     return current user from token
//@access   private
router.get('/current',authenticateToken,passport.authenticate('jwt',{session : false}),(req,res)=>{
    try{
        res.json( { msg:'authorization successful!!' } );
    }
    catch{
        res.json( { msg:'authorization not successful!!' } );
    }
})



module.exports = router;