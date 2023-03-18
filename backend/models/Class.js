import mongoose from 'mongoose';
import Task from './Task.js';

const { Schema } = mongoose;

const classSchema = new Schema({
  className: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // array of Student mail assigned to class
  studentEmail: {
    type: Array,
  },
  teamCode: {
    type: String,
    required: true,
    unique: true,
  },

}, { timestamps: true });

// cascade Sheeeeeeesh
classSchema.pre('findOneAndDelete', { document: false, query: true }, async function () {
  const targetClass = await this.model.findOne(this.getFilter());
  await Task.deleteMany({ classId: targetClass._id });
});

export default mongoose.model('Class', classSchema);
