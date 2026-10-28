export const SUPPORTED_CITIES = [
  'Bengaluru',
  'Pune',
  'Mumbai',
  'Delhi-NCR',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
] as const;

export type SupportedCity = (typeof SUPPORTED_CITIES)[number];
export type City = SupportedCity | string;

export const isSupportedCity = (city: string): boolean => {
  return (SUPPORTED_CITIES as readonly string[]).includes(city as SupportedCity);
};

export type RelocationPhase = 
  | 'Apartment Shortlist' 
  | 'Packers & Movers' 
  | 'Utility Setup' 
  | 'Documentation & KYC' 
  | 'Moving Day' 
  | 'Post-Move Support'
  | 'Completed';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';
export type TaskCategory = 
  | 'apartment' 
  | 'movers' 
  | 'utilities' 
  | 'documentation' 
  | 'society_gatepass' 
  | 'post_move';

export interface Task {
  id: string;
  relocationId: string;
  customerName: string;
  city: City;
  title: string;
  category: TaskCategory;
  dueDate: string; // ISO date format YYYY-MM-DD
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string; // Ops coordinator name
  notes?: string;
  blockerReason?: string;
}

export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IssueStatus = 'open' | 'in_progress' | 'resolved';

export interface Issue {
  id: string;
  relocationId: string;
  customerName: string;
  city: City;
  title: string;
  description: string;
  severity: IssueSeverity;
  status: IssueStatus;
  category: TaskCategory;
  reportedAt: string;
  assignedTo: string;
  suggestedAiAction?: string;
  suggestedWhatsAppMsg?: string;
}

export interface Relocation {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  fromCity: string;
  toCity: City;
  currentPhase: RelocationPhase;
  targetMoveDate: string;
  assignedOps: string;
  apartment: {
    societyName: string;
    flatNumber: string;
    locality: string;
    status: 'Searching' | 'Shortlisted' | 'Agreement Drafted' | 'Agreement Signed' | 'Move-in Ready';
    depositPaid: boolean;
    societyNocStatus: 'Not Applied' | 'Applied' | 'Approved' | 'Blocked';
    societyRulesNote?: string;
  };
  movers: {
    vendorName: string;
    vendorPhone: string;
    status: 'Unassigned' | 'Survey Pending' | 'Booked' | 'Packing Done' | 'In Transit' | 'Delivered' | 'Unpacked';
    slotTime: string;
    vehicleType: string;
    tollOrTransitPassIssue?: boolean;
  };
  utilities: {
    electricityStatus: 'Not Started' | 'Application Filed' | 'Meter Transferred' | 'Active';
    internetStatus: 'Not Started' | 'Slot Booked' | 'Fiber Installed' | 'Active';
    gasStatus: 'Not Started' | 'Piped Connection Active' | 'Cylinder Booked';
    waterStatus: 'Verified' | 'Pending Society Tanker Card';
  };
  documents: {
    rentalAgreementRegistered: boolean;
    policeVerificationDone: boolean;
    bankAddressUpdated: boolean;
    aadhaarAddressSubmitted: boolean;
  };
  riskScore: 'Low' | 'Medium' | 'High';
  riskReason?: string;
  notes: string[];
}

export interface OpsMember {
  id: string;
  name: string;
  activeMovesCount: number;
  phone: string;
  cities: City[];
}
