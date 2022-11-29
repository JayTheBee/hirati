require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const passport = require("passport");
require('./utils/googleAuth');
const cookieParser = require("cookie-parser");

// use loggedIn Middleware if an api needs auth
const loggedIn = (req, res, next) => {
    // Read the token from the cookie
    const token = req.cookies.token;
    if (!token)
      return res.status(401).send("Access denied...No token provided...");
    try {
      const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
      req.user = decoded;
      next();
    } catch (er) {
      // console.log("err", er);
      //Incase of expired jwt or invalid token kill the token and clear the cookie
      res.clearCookie("token");
      return res.status(400).send(er.message);
    }
}



// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.FRONT_END_URL }));
app.use(cookieParser());
// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

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


const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
