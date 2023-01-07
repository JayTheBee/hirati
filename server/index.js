// For dotenv variables
require("dotenv").config();
// Backend Main
const express = require("express");
const mongoose = require('mongoose');
// Middleware
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
// Backend API Routes
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const taskRoutes = require('./routes/tasks')
const rootRoute = require('./routes/root')
// Backend Configs
const corsOptions = require("./config/corsOptions");
const connection = require("./config/dbConnection");
const port = process.env.PORT || 8080;
// Init express
const app = express();


// Connect to database first
connection();

require('./utils/googleAuth');


// needs clientside/serveride isLoggedIn that returns true/next or status(200) if token exists. clientside reads this as true, serverside proceeds to next

// needs serverside loggedIn middleware that gets decoded token as req.user, req.user is then manipulated for various api calls

// use loggedIn Middleware if an api needs auth
const loggedIn = (req, res, next) => {
    // Read the token from the cookie
    const token = req.cookies.token;
    if (!token)
      return res.status(401).send("Access denied...No token provided...");
    try {
      const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
      req.user = decoded;
      next()
    } catch (er) {
      console.log("err is ", er);
      //Incase of expired jwt or invalid token kill the token and clear the cookie
      res.clearCookie("token");
      return res.status(400).send(er.message);
    }
}




// Init Middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());


// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use('/', rootRoute)
// app.use('/api/tasks', (req, res) => {if(isLogged) taskRoutes}   )
app.use('/api/tasks', taskRoutes)



app.get ('/auth/google', passport.authenticate('google',{scope: ['email', 'profile']}));

// app.get(
//     '/auth/google/callback',(req, res) => {
//         passport.authenticate('google', {
//             failureRedirect: "http://localhost:3000",
//             successRedirect: "http://localhost:3000",
//             session: false,
//         }
//         )
//     }
// );




// Test connection to db first before running
mongoose.connection.once('open', () =>
{
    app.listen(port, () => console.log(`Server running on port ${[port]}`))
})
mongoose.connection.on('error', err => {
    console.log(err)
})
