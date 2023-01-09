import IUser from './user';

interface ICard {
  name: string,
  link: string,
  owner: IUser,
  likes: string[],
  data: object,
}

export default ICard;
