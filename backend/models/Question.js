import mongoose from 'mongoose';

const { Schema } = mongoose;

const questionSchema = new Schema({
  questionTitle: {
    type: String,
    required: true,
  },

  completed: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
  },

  questionBody: {
    type: String,
    required: true,
  },

  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  performance: {
    cputime: Number,
    memory: Number,
  },
  testcase: [{
    input: String,
    output: String,
  }],

  example: [String],
  constraint: [{
    ype: String,
    required: true,
  }],
  // add 'rubrics' later for grading guide automation
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);
