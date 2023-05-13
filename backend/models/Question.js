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
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  rubrics: {
    cputime: Number,
    memory: Number,
    status: Number,
  },
  testcase: {
    input: [String],
    output: [String],
  },

  points: {
    type: Number,
  },

  keywords: {
    type: [String],
  },

  resultSample: {
    time: Schema.Types.Decimal128,
    language: String,
    languageId: String,
    memory: Number,
    status: String,
  },
  // add 'rubrics' later for grading guide automation
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);
