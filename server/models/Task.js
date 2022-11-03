const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
	title: { type: String, required:true },
	desc: String,
	perf:{ cputime: Number, memory: Number },
	score: { type: Number, required:true },
	//case
	//hints
	//tags
	case: [{ input: String, output: String }],
	examples: [String],
	constraints: [{ type: String, required:true }],
})

module.exports = mongoose.model('Task', taskSchema)