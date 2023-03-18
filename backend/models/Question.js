import mongoose from 'mongoose';

const { Schema } = mongoose;

const questionSchema = new Schema({
  questionNumber: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
  },

  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  performance: {
    cputime: Number,
    memory: Number,
    score: Number,
  },
  testcase: {
    input: [String],
    output: [String],
  },

  example: [String],

  constraints: [String],
  // add 'rubrics' later for grading guide automation
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);
