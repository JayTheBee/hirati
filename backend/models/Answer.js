// import mongoose from 'mongoose';

// const { Schema } = mongoose;
// const answerSchema = new Schema({
//   language: {
// 	id: Number,
// 	name: String,
//   },
//   status: {
// 	id: Number,
// 	description: String,
//   },
//   taskId: {
//     type: Schema.Types.ObjectId,
//     ref: 'Task',
//     required: true,
//   },
//   questionId: {
// 	type: Schema.Types.ObjectId,
// 	ref: 'Question',
// 	required: true,
//    },
//   performance: {
//     cputime: Schema.Types.Decimal128,
//     memory: Number,
//   },
//   answer_io: {
//     stdin: String,
//     stdoutput: String
//   },
//   judgeToken: {
// 	type: String,
//    },
//   source_code: {
// 	type: String,
//    },
//   // add 'rubrics' later for grading guide automation
// }, { timestamps: true });
// export default mongoose.model('Answer', answerSchema);

import mongoose from 'mongoose';

const { Schema } = mongoose;

const AnswerSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  questionId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Question',
  },
  // array of Student mail assigned to class
  input: {
    type: String,
  },
  output: {
    type: String,
  },
  resultAnswer: {
    time: Schema.Types.Decimal128,
    memory: Number,
    status: String,
  },
}, { timestamps: true });

// // cascade Sheeeeeeesh
// classSchema.pre('findOneAndDelete', { document: false, query: true }, async function () {
//   const targetClass = await this.model.findOne(this.getFilter());
//   await Task.deleteMany({ classId: targetClass._id });
// });

export default mongoose.model('Answer', AnswerSchema);
