require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const passport = require("passport");
require('./utils/googleAuth');


// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());


// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.get ('/auth/google', passport.authenticate('google',{scope: ['email', 'profile']}));

app.get(
    '/auth/google/callback',(req, res) => {
        passport.authenticate('google', {
            failureRedirect: "http://localhost:3000",
            successRedirect: "http://localhost:3000",
            session: false,
        }
        )
    }
);


const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
