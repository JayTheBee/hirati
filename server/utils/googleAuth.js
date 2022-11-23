const passport = require ('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const {User}= require('../models/User');
const crypto = require ( "crypto");
const Token = require("../models/token");
let token;

passport.use(new GoogleStrategy({
    clientID:    '961175355541-rcijpp4orfor42ik751b35gcvb903fms.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:8080/auth/google/callback',
    passReqToCallback: true,
    scope: ["profile","email"]
  },
   async(req, accessToken, refreshToken, profile, done) =>{
    let gmail = await User.findOne({ email: profile.email });
    if(gmail){
      // token = gmail.generateAuthToken();
      console.log(profile);
      //stucc nako dito lods
      return done(null, profile);
    }
      
		//   res.status(200).send({ data: token, message: "logged in successfully" });


    new User({
      firstName: profile.given_name, 
      lastName: profile.family_name, 
      email: profile.email, 
      password: "gmailLogin" ,
      role: "student",
      classes: "" ,
      verified: true,
    }).save().then( console.log("save to db using Google auth"));

    req.user = profile;
    return done(null, user);
    
  }
));

