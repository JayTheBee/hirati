//import express from "express"
const express = require('express')
const router = express.Router()

// Tell express router that in the base route, you send a response like hello world
router.get('/', (req, res) => res.send("hello, world"))


module.exports = router