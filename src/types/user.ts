import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Model, Document } from 'mongoose';

interface IUser {
  name: string,
  about: string,
  avatar: string,
  email: string,
  password: string
}

interface RequestCustom extends Request {
  user?:{
    _id: string ;
  }
}

interface SessionCustom extends Request {
  user?: string | JwtPayload ;
}

interface UserModel extends Model<IUser> {
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

export {
  IUser, RequestCustom, UserModel, SessionCustom,
};
