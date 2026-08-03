import { Station } from './station.model';

export type RouteStatus = 'active' | 'inactive';

export interface Route {
  _id?: string;
  startStationId: string | Station;
  endStationId: string | Station;
  distance: number; // in km
  estimatedDuration: number; // in minutes
  status: RouteStatus;
  createdAt?: string;
  updatedAt?: string;
}
