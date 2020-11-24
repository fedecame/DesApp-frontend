import { Donation } from './Donation';
import { LocationDesApp } from './LocationDesApp';
import { User } from './User';

export interface Project {
  donations: Donation[];
  endDate: string;
  factor: number;
  id: number;
  location: LocationDesApp;
  minClosePercentage: number;
  name: string;
  raisedFunds: number | string;
  startDate: string;
  state: string;
  users: User[];
}
