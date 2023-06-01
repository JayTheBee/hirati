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
  taskId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Task',
  },
  questionId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Question',
  },
  resultAnswer: {
    cputime: Schema.Types.Decimal128,
    memory: Number,
    status: String,
  },
  rubricAdditional: [{
    rubricRating: Number,
    rubricTitle: String,
    rubricMethod: String,
  }],
  code_tokens: {
    type: Array,
    required: true,
  },
}, { timestamps: true });

// // cascade Sheeeeeeesh
// classSchema.pre('findOneAndDelete', { document: false, query: true }, async function () {
//   const targetClass = await this.model.findOne(this.getFilter());
//   await Task.deleteMany({ classId: targetClass._id });
// });

export default mongoose.model('Answer', AnswerSchema);
