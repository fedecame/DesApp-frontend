import { Donation } from './Donation';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  nickname: string;
  points: number;
  donations?: Donation[];
}
