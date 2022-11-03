//file for database connections
require('dotenv').config()

//import app from "./server.js"
//const app = require("./server.js")
//import mongodb from "mongodb"
//const mongodb = require("mongodb")
const mongoose = require('mongoose')
//import dotenv from "dotenv"
const connectDB = require('./config/dbConnection')

const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const app = express()

const port = process.env.PORT || 5000

connectDB()

//cors is used for cors connections which means being able to access the API from any links
app.use(cors())

app.use(cookieParser())
app.use(express.json())


//use this route for tasks
//app.use("/tasks", taskRoutes)

//tell express to serve static files found in public
//once you enter root route, it will serve the static files found in ./public
// app.use('/', express.static(path.join(__dirname, 'public')))


//tell express that ./routes/root is required for routing
app.use('/', require('./routes/root'))
app.use('/tasks', require('./routes/tasks'))


//tell express that for anything that has 404 it presents a json that says not found
app.all("*", (req, res) => 
	res.status(404).json({error:"not found"})
)



//mongodb version of mongoose connect
// const MongoClient = mongodb.MongoClient
// MongoClient.connect(
// 	process.env.TASKS_DB_URI, 
// 	{
// 		// indicate the maximum number of connections
// 		maxPoolSize: 50,
// 		// try to connect for 2500ms and timeout if it couldnt
// 		wtimeoutMS: 2500,
// 		// mongodb driver connections
// 		useNewUrlParser: true, 
// 	}
// ).catch(err => {
// 	console.log(err.stack)
// 	process.exit(1)
// }).then(async client => {
// 	app.listen(port, () => {
// 		console.log(`Listening on port ${port}`)
// 	})
// })



//test connection to db first before running
mongoose.connection.once('open', () =>
{
    console.log ('Connected to mongodb')	
    app.listen(port, () => console.log(`Server running on port ${[port]}`))
})
mongoose.connection.on('error', err => {
    console.log(err)
})

