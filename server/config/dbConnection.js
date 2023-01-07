// const mongoose = require('mongoose')

// const connectDB = async () => {
// 	try {
// 	    await mongoose.connect(process.env.TASKS_DB_URI)
// 	} catch (err) {
// 	    console.log(err)
// 	}
//  }

// module.exports = connectDB

const mongoose = require("mongoose");

module.exports =  () => {
	const connectionParams = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	try {
		mongoose.connect(process.env.DB, connectionParams);
		console.log("Connected to database successfully");
	} catch (error) {
		console.log(error);
		console.log("Could not connect database!");
	}
};
