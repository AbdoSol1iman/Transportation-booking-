import { User } from './user.model';
import { Trip } from './trip.model';

export type PaymentMethod = 'cash' | 'card' | 'wallet';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  _id?: string;
  bookingCode: string;
  userId: string | User;
  tripId: string | Trip;
  passengers: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  createdAt?: string;
  updatedAt?: string;
}
