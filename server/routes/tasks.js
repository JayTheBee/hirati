//import express from "express"
const express = require('express')
const router = express.Router()
const taskController = require('../controller/taskController')

router.route("/")
	// .get("/:id", taskController.getTask)
	.get(taskController.getAllTask)
	.post(taskController.createTask)
	.patch(taskController.updateTask)
	.delete(taskController.deleteTask)


// router.route("/:id").get(taskController.getTask)

module.exports = router