import { model, Schema } from 'mongoose';
// import validator from 'validator';
// eslint-disable-next-line import/no-unresolved
import ICard from 'types/card';
import { validateLink } from '../middlewares/validation';

const cardShema = new Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    validate: {
      validator: validateLink,
      message: 'Некорректный URL',
    },
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ICard>('card', cardShema);
