import { model, Schema } from 'mongoose';

// eslint-disable-next-line import/no-unresolved, import/no-named-as-default
import { IUser } from '../types/user';

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
  },
});

export default model<IUser>('User', userSchema);
