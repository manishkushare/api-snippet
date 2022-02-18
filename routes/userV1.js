var express = require('express');
var router = express.Router();
var User = require('../models/UserV2');
var auth = require("../middlewares/auth");

router.post('/signup', async (req,res,next)=> {
  try {
      const user = await User.create(req.body);
      console.log(user);
      res.json({user :await user.userJSON()});
  } catch (error) {
      next(error);
  }
});

router.post('/login', async (req,res,next)=> {
  const {email,password} = req.body;
  try {
      if(!email || !password){
          return res.status(404).json({ errors: 
              {
                  body : [
                      "Email/Password required"
                  ]
              } 
          })
      };
      const user = await User.findOne({email});
      if(!user){
          return res.status(404).json({
              errors : {
                  body : [
                      "Email is not registered"
                  ]
              }
          })
      };
      const result = await user.verifyPassword(password);
      if(!result){
          return res.status(404).json({
              errors : {
                  body : [
                      "Password is In-correct"
                  ]
              }
          })
      };
      const token = await user.signToken();
      console.log(token);
      res.json({user : await user.userJSON(token)});
  } catch (error) {
      console.log(error);
      next(error);
  }
});

router.get('/', auth.verifyToken, async (req,res,next)=> {
    console.log(req.user,"ihwreklfhklejrgklj");
    try {
        return res.json({user: req.user});
    } catch (error) {

        next(error);
    }
});

router.get('/bookmarks',auth.verifyToken, async (req,res,next)=> {
    try {
        const user = await User.findById(req.user.id).populate("bookmark");
        res.json({user});
    } catch (error) {
        next(error);
    }
})

module.exports = router;

