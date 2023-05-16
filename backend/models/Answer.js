import mongoose from 'mongoose';

const { Schema } = mongoose;

const answerSchema = new Schema({
  language: {
	id: Number,
	name: String,
  },
  status: {
	id: Number,
	description: String,
  },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  questionId: {
	type: Schema.Types.ObjectId,
	ref: 'Question',
	required: true,
   },
  performance: {
    cputime: Schema.Types.Decimal128,
    memory: Number,
  },
  answer_io: {
    stdin: String,
    stdoutput: String
  },
  judgeToken: {
	type: String,
   },
  source_code: {
	type: String,
   },
  // add 'rubrics' later for grading guide automation
}, { timestamps: true });

export default mongoose.model('Answer', answerSchema);
