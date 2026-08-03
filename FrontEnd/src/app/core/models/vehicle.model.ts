export type VehicleType = 'bus' | 'minibus' | 'van';
export type VehicleStatus = 'active' | 'maintenance' | 'inactive';

export interface Vehicle {
  _id?: string;
  plateNumber: string;
  model: string;
  capacity: number;
  vehicleType: VehicleType;
  status: VehicleStatus;
  createdAt?: string;
  updatedAt?: string;
}
