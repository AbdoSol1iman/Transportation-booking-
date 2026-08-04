import { Route } from './route.model';
import { Vehicle } from './vehicle.model';
import { Driver } from './driver.model';

export type TripStatus = 'scheduled' | 'inProgress' | 'completed' | 'cancelled' | 'fullyBooked';

export interface Trip {
  _id?: string;
  routeId: string | Route;
  vehicleId: string | Vehicle;
  driverId: string | Driver;
  departureTime: string | Date;
  arrivalTime: string | Date;
  price: number;
  capacity: number;
  currentPassengers?: number;
  status: TripStatus;
  createdAt?: string;
  updatedAt?: string;
}
