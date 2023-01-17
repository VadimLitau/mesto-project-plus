import { Request } from 'express';

interface IUser {
  name: string,
  about: string,
  avatar: string,
}

interface RequestCustom extends Request {
  user?:{
    _id: string
  }
}
export { IUser, RequestCustom };
