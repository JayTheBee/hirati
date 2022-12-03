const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
	title: { type: String, required:true },
	desc: String,
	perf:{ cputime: Number, memory: Number },
	score: { type: Number, required:true },
	//case
	//hints
	//tags
	casevar: [{ input: String, output: String }],
	example: [String],
	constraint: [{ type: String, required:true }],
})

module.exports = mongoose.model('Task', taskSchema)