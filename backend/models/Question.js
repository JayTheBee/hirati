import mongoose from 'mongoose';

const { Schema } = mongoose;

const questionSchema = new Schema({
  questionCount: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
  },
  language: {
    type: String,
  },
  languageId: {
    type: String,
  },

  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  rubrics: {
    cputime: Number,
    memory: Number,
    score: Number,
  },
  testcase: {
    input: [String],
    output: [String],
  },

  points: {
    type: Number,
  },

  resultSample: {
    time: Schema.Types.Decimal128,
    language: String,
    languageId: String,
    status: String,
  },
  // add 'rubrics' later for grading guide automation
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);
