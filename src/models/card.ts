import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
// eslint-disable-next-line import/no-unresolved
import ICard from 'types/card';

const card = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: ObjectId,
    required: true,
  },
  likes: {
    type: ObjectId,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICard>('user', card);
