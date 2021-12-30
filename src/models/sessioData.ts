import { IUser } from './user';

interface ISessionData {
  token: string;
  user: IUser;
}

export default ISessionData;
