import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
  classId: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  category: {
    type: String,
    required: false,
  },
  dateExp: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
