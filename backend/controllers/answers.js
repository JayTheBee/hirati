import Answer from '../models/Answer.js';

export const createAnswer = async (req, res, next) => {
	console.log('ANSWER DATA IS: ', req.body)
	try {
		const newAnswer = new Answer(req.body);
		const savedAnswer = await newAnswer.save();
	 
		res.status(200).json({message: 'Created Answer data', data: savedAnswer});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}


export const getAnswer = async (req, res, next) => {
	try {
		// const question = await Question.find({ taskId: req.params.taskId }).sort({ createdAt: -1 });
		const answer = await Answer.find({ taskId: req.params.taskId });
		return res.status(200).json({data: answer, message: 'Found answer data'});
	   } catch (err) {
		return next(err);
	   }
}