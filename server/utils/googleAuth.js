const passport = require ('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const {User}= require('../models/User');
const crypto = require ( "crypto");
const Token = require("../models/token");
let token;

passport.use(new GoogleStrategy({
    clientID:    process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.BASE_URL + process.env.GOOGLE_CALLBACK_ROUTE,
    passReqToCallback: true,
    scope: ["profile","email"]
  },
   async(req, accessToken, refreshToken, profile, done) =>{
    let gmail = await User.findOne({ email: profile.email });
    if(gmail){
      // token = gmail.generateAuthToken();
      console.log(profile);
      //help stepbro im stucc
      return done(null, profile);
    }
      
		//   res.status(200).send({ data: token, message: "logged in successfully" });


    // new User({
    //   firstName: profile.given_name, 
    //   lastName: profile.family_name, 
    //   email: profile.email, 
    //   password: "gmailLogin" ,
    //   role: "student",
    //   classes: "" ,
    //   verified: true,
    // }).save().then( console.log("save to db using Google auth"));
    console.log(profile);
    req.user = profile;
    return done(null, user);
    
  }
));

