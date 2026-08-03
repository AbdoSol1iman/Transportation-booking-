import { User } from './user.model';
import { Trip } from './trip.model';

export interface Review {
  _id?: string;
  userId: string | User;
  tripId: string | Trip;
  rating: number;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}
