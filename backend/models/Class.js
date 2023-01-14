import mongoose from 'mongoose';

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

}, { timestamps: true });

export default mongoose.model('Class', classSchema);
