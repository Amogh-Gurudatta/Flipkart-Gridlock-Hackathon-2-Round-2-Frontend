// Traffic Offender Registry — data schema and mock records
// Replaces the old criminal ProfileData schema.

export interface TrafficOffender {
  id: string;
  name: string;            // Owner / driver name
  vehicleNumber: string;   // e.g. "KA-01-AB-1234"
  vehicleType: '2-Wheeler' | '4-Wheeler' | 'Auto' | 'Heavy' | 'Other';
  status: 'Pending Challans' | 'Clear' | 'Impounded';
  frequency: 'First-Time' | 'Repeat' | 'Habitual';
  pendingFines: number;    // Amount in INR
}

export const MOCK_OFFENDERS: TrafficOffender[] = [
  {
    id: 'OFF-001',
    name: 'Rajan Subramaniam',
    vehicleNumber: 'KA-01-MN-4421',
    vehicleType: '4-Wheeler',
    status: 'Pending Challans',
    frequency: 'Habitual',
    pendingFines: 12500,
  },
  {
    id: 'OFF-002',
    name: 'Priya Nair',
    vehicleNumber: 'KA-05-AB-7890',
    vehicleType: '2-Wheeler',
    status: 'Clear',
    frequency: 'First-Time',
    pendingFines: 0,
  },
  {
    id: 'OFF-003',
    name: 'Mohammed Ashraf',
    vehicleNumber: 'KA-03-CD-3310',
    vehicleType: 'Auto',
    status: 'Impounded',
    frequency: 'Habitual',
    pendingFines: 28000,
  },
  {
    id: 'OFF-004',
    name: 'Lakshmi Devi',
    vehicleNumber: 'KA-41-EF-0092',
    vehicleType: '4-Wheeler',
    status: 'Pending Challans',
    frequency: 'Repeat',
    pendingFines: 5000,
  },
  {
    id: 'OFF-005',
    name: 'Venkatesh Gowda',
    vehicleNumber: 'KA-02-GH-5521',
    vehicleType: 'Heavy',
    status: 'Impounded',
    frequency: 'Repeat',
    pendingFines: 41000,
  },
];
