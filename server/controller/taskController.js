const Task = require('../models/Task')


//getTaskByCreator
//getTaskByAssigned


const getAllTask = async (req, res) => {
	try{
		const tasks = await Task.find().lean()

		if (!tasks?.length) {
			return res.status(400).json({ message: 'No tasks found' })
		}
		res.status(200).json(tasks)
	}catch(error){
		res.status(404).json({ message: error.message });
	}

}


// @desc Create new task
// @route POST /task
// @access Private
const createTask = async (req, res) => {
	try {
		const { title, perf, score,  constraint } = req.body

		// checks for empty inputs
		if(!title || !perf || !score || !constraint){
			return res.status(400).json({message: "All task information requried"})
		}
	
		// checks duplicates 
		const duplicate = await Task.findOne({ title }).lean().exec()
		if (duplicate) return res.status(409).json({ message: 'Duplicate task title' }) 
	
	
		const task = await Task.create({ ...req.body })
	
		if (task) { //created 
			res.status(201).json(task)
		 } else {
			res.status(400).json({ message: 'Invalid task information received' })
		 }
	}catch(error){
		res.status(409).json({ message: error.message });		
	}

	
}

const updateTask = async (req, res) =>{
	const { id, title, perf, score,  constraints } = req.body

	// checks for empty inputs
	if(!title || !perf || !score || !constraints){
		return res.status(400).json({message: "All task information requried"})
	}

	const task = await Task.findById(id).exec()
	if(!task) {
		return res.status(404).json({ message: 'Task not found' })
	}

	const duplicate = await Task.findOne({ title }).lean().exec()
	if (duplicate && duplicate?._id.toString() !== id) {
		return res.status(409).json({ message: 'Duplicate task title' }) 
	}

	task.title = title
	task.desc = req.body.desc
	task.perf = perf
	task.score = score
	task.case = req.body.case
	task.examples = req.body.examples
	task.constraints = constraints

	const updatedTask = await task.save()

	res.json(`'Task updated'`)

}

const deleteTask = async (req, res) => {
	const { id } = req.body

	if(!id) return res.status(400).json({message: 'Task ID required'})

	const task = await Task.findById(id).exec()
	if(!task) return res.status(400).json({ message: 'Task not found' })

	const result = await task.deleteOne()

	res.json(`'Task deleted'`)
}

module.exports = {
	getAllTask,
	createTask,
	updateTask,
	deleteTask
}
