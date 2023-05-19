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
  // input: {
  //   type: String,
  // },
  // output: {
  //   type: String,
  // },
  resultAnswer: {
    cputime: Schema.Types.Decimal128,
    memory: Number,
    status: String,
  },
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
