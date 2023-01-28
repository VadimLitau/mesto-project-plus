import { Schema } from 'mongoose';
import { IUser } from './user';

interface ICard {
  name: string,
  link: string,
  owner: IUser,
  likes: [Schema.Types.ObjectId],
  createdAt: Schema.Types.Date,
}

export default ICard;
