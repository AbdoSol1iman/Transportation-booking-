export type StationStatus = 'active' | 'inactive';

export interface LocationPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Station {
  _id?: string;
  name: string;
  city: string;
  address?: string;
  location: LocationPoint;
  status: StationStatus;
  createdAt?: string;
  updatedAt?: string;
}
