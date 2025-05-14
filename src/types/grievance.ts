export interface Grievance {
  id: string;
  complaint: string;
  rating: number;
  status: 'pending' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
}

export type GrievanceStatus = 'pending' | 'resolved'; 