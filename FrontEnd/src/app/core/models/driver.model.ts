export type DriverStatus = 'available' | 'onTrip' | 'offline';

export interface Driver {
  _id?: string;
  fullName: string;
  phone: string;
  licenseNumber: string;
  photoUrl?: string | null;
  rating?: number;
  experienceYears?: number;
  tripsCount?: number;
  status: DriverStatus;
  createdAt?: string;
  updatedAt?: string;
}
