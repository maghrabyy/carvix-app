export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: string;
  km: number;
  transmission: 'Automatic' | 'Manual' | string;
}
