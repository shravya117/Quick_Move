import { Relocation, Task, Issue, OpsMember } from '../types';

export const OPS_TEAM: OpsMember[] = [
  { id: 'ops-1', name: 'Priya Sharma', activeMovesCount: 6, phone: '+91 98201 12345', cities: ['Bengaluru', 'Chennai'] },
  { id: 'ops-2', name: 'Rahul Verma', activeMovesCount: 5, phone: '+91 98112 23456', cities: ['Pune', 'Mumbai'] },
  { id: 'ops-3', name: 'Sneha Kulkarni', activeMovesCount: 5, phone: '+91 98450 34567', cities: ['Hyderabad', 'Ahmedabad'] },
  { id: 'ops-4', name: 'Amit Roy', activeMovesCount: 4, phone: '+91 98300 45678', cities: ['Delhi-NCR', 'Kolkata'] },
  { id: 'ops-5', name: 'Vikram Nair', activeMovesCount: 4, phone: '+91 98765 56789', cities: ['Bengaluru', 'Pune'] },
];

export const INITIAL_RELOCATIONS: Relocation[] = [
  {
    id: 'REL-2026-081',
    customerName: 'Aditya & Ritu Mehra',
    phone: '+91 99201 88412',
    email: 'aditya.mehra@fintechcorp.io',
    fromCity: 'Gurgaon',
    toCity: 'Bengaluru',
    currentPhase: 'Moving Day',
    targetMoveDate: '2026-10-28', // Tomorrow!
    assignedOps: 'Priya Sharma',
    apartment: {
      societyName: 'Prestige Lakeside Habitat',
      flatNumber: 'Tower 4, Flat 1402',
      locality: 'Varthur, Whitefield',
      status: 'Agreement Signed',
      depositPaid: true,
      societyNocStatus: 'Blocked',
      societyRulesNote: 'Society MC enforces ₹15,000 refundable move-in deposit & freight elevator slot booking 48h prior. No move-in after 6 PM.'
    },
    movers: {
      vendorName: 'SafePack Express (Whitefield branch)',
      vendorPhone: '+91 98451 90812',
      status: 'In Transit',
      slotTime: '10:00 AM - 2:00 PM',
      vehicleType: '14ft Closed Container',
      tollOrTransitPassIssue: false
    },
    utilities: {
      electricityStatus: 'Application Filed',
      internetStatus: 'Slot Booked',
      gasStatus: 'Cylinder Booked',
      waterStatus: 'Verified'
    },
    documents: {
      rentalAgreementRegistered: true,
      policeVerificationDone: false,
      bankAddressUpdated: false,
      aadhaarAddressSubmitted: true
    },
    riskScore: 'High',
    riskReason: 'Move-in scheduled for tomorrow but Prestige Society MC has NOT issued Gate Pass because lift deposit receipt was not countersigned by landlord.',
    notes: [
      'Customer has a 3-month-old infant; urgent need for power and AC setup by evening.',
      'Landlord is NRI (based in Singapore), response delay of ~12 hours.'
    ]
  },
  {
    id: 'REL-2026-084',
    customerName: 'Kavita Sundaram',
    phone: '+91 97402 11928',
    email: 'kavita.s@cloudsystems.com',
    fromCity: 'Bengaluru',
    toCity: 'Pune',
    currentPhase: 'Utility Setup',
    targetMoveDate: '2026-10-31',
    assignedOps: 'Rahul Verma',
    apartment: {
      societyName: 'Amanora Gateway Towers',
      flatNumber: 'Tower 1, 904',
      locality: 'Hadapsar',
      status: 'Move-in Ready',
      depositPaid: true,
      societyNocStatus: 'Approved',
      societyRulesNote: 'Freight elevator usage permitted between 9:30 AM to 5:30 PM only.'
    },
    movers: {
      vendorName: 'Agarwal Shift Logistics',
      vendorPhone: '+91 98220 44321',
      status: 'Booked',
      slotTime: '11:00 AM',
      vehicleType: '19ft Container'
    },
    utilities: {
      electricityStatus: 'Application Filed',
      internetStatus: 'Not Started',
      gasStatus: 'Piped Connection Active',
      waterStatus: 'Verified'
    },
    documents: {
      rentalAgreementRegistered: true,
      policeVerificationDone: true,
      bankAddressUpdated: false,
      aadhaarAddressSubmitted: false
    },
    riskScore: 'Medium',
    riskReason: 'MSEDCL electricity connection name transfer requires stamped index II copy which broker has not forwarded yet.',
    notes: [
      'Customer needs 300 Mbps fiber line active on Day 1 for remote US shift work.'
    ]
  },
  {
    id: 'REL-2026-089',
    customerName: 'Saurabh Joshi',
    phone: '+91 98810 55419',
    email: 'saurabh.j@techindia.org',
    fromCity: 'Delhi-NCR',
    toCity: 'Mumbai',
    currentPhase: 'Packers & Movers',
    targetMoveDate: '2026-11-02',
    assignedOps: 'Rahul Verma',
    apartment: {
      societyName: 'Sea Green CHS',
      flatNumber: 'Flat 302, B-Wing',
      locality: 'Bandra West (Pali Hill)',
      status: 'Agreement Drafted',
      depositPaid: true,
      societyNocStatus: 'Applied',
      societyRulesNote: 'Extremely narrow lane. Large trucks prohibited by Mumbai Traffic Police between 8 AM and 9 PM.'
    },
    movers: {
      vendorName: 'Mumbai Star Packers',
      vendorPhone: '+91 98200 99881',
      status: 'Survey Pending',
      slotTime: '9:00 AM',
      vehicleType: 'Requires Shuttle Tempo (Tata Ace) split transfer',
      tollOrTransitPassIssue: true
    },
    utilities: {
      electricityStatus: 'Not Started',
      internetStatus: 'Not Started',
      gasStatus: 'Piped Connection Active',
      waterStatus: 'Verified'
    },
    documents: {
      rentalAgreementRegistered: false,
      policeVerificationDone: false,
      bankAddressUpdated: false,
      aadhaarAddressSubmitted: false
    },
    riskScore: 'High',
    riskReason: 'Vendor originally quoted standard 17ft truck. Pali Hill access requires 3 separate small tempo shuttles. Vendor threatening ₹12,000 extra cost.',
    notes: [
      'Need customer agreement or negotiation with vendor before survey is finalized.'
    ]
  },
  {
    id: 'REL-2026-092',
    customerName: 'Deepak & Nidhi Chawla',
    phone: '+91 98101 44552',
    email: 'deepak.c@globalconsult.com',
    fromCity: 'Mumbai',
    toCity: 'Hyderabad',
    currentPhase: 'Apartment Shortlist',
    targetMoveDate: '2026-11-08',
    assignedOps: 'Sneha Kulkarni',
    apartment: {
      societyName: 'My Home Bhooja',
      flatNumber: 'Block C, 1801',
      locality: 'HITEC City',
      status: 'Shortlisted',
      depositPaid: false,
      societyNocStatus: 'Not Applied',
      societyRulesNote: 'Move-in allowed on weekends only with MyGate digital pass.'
    },
    movers: {
      vendorName: 'Unassigned',
      vendorPhone: '',
      status: 'Unassigned',
      slotTime: 'TBD',
      vehicleType: 'TBD'
    },
    utilities: {
      electricityStatus: 'Not Started',
      internetStatus: 'Not Started',
      gasStatus: 'Not Started',
      waterStatus: 'Verified'
    },
    documents: {
      rentalAgreementRegistered: false,
      policeVerificationDone: false,
      bankAddressUpdated: false,
      aadhaarAddressSubmitted: false
    },
    riskScore: 'Low',
    riskReason: 'Everything on track for shortlisted unit visit this Saturday.',
    notes: [
      'Customer requesting pet-friendly apartment verification for two Golden Retrievers.'
    ]
  },
  {
    id: 'REL-2026-095',
    customerName: 'Ananya Deshmukh',
    phone: '+91 98452 77110',
    email: 'ananya.d@biotech.ac.in',
    fromCity: 'Pune',
    toCity: 'Bengaluru',
    currentPhase: 'Documentation & KYC',
    targetMoveDate: '2026-11-04',
    assignedOps: 'Vikram Nair',
    apartment: {
      societyName: 'Sobha Dream Acres',
      flatNumber: 'Wing 12, 502',
      locality: 'Panathur, Marathahalli ORR',
      status: 'Agreement Signed',
      depositPaid: true,
      societyNocStatus: 'Applied',
      societyRulesNote: 'Strict registration copy and tenant biometric registration required.'
    },
    movers: {
      vendorName: 'South Cargo Movers',
      vendorPhone: '+91 99880 12091',
      status: 'Booked',
      slotTime: '2:00 PM',
      vehicleType: '14ft Container'
    },
    utilities: {
      electricityStatus: 'Application Filed',
      internetStatus: 'Slot Booked',
      gasStatus: 'Cylinder Booked',
      waterStatus: 'Pending Society Tanker Card'
    },
    documents: {
      rentalAgreementRegistered: true,
      policeVerificationDone: false,
      bankAddressUpdated: false,
      aadhaarAddressSubmitted: false
    },
    riskScore: 'Medium',
    riskReason: 'Panathur S-cross railway underpass waterlogging prone; delivery truck route needs live monsoon checkpoint.',
    notes: [
      'Aadhaar address update requires registered agreement soft copy stamped with Sub-Registrar seal.'
    ]
  },
  {
    id: 'REL-2026-098',
    customerName: 'Rohan Sen',
    phone: '+91 98310 99882',
    email: 'rohan.sen@creativestudio.com',
    fromCity: 'Kolkata',
    toCity: 'Delhi-NCR',
    currentPhase: 'Post-Move Support',
    targetMoveDate: '2026-10-24', // Completed move 3 days ago
    assignedOps: 'Amit Roy',
    apartment: {
      societyName: 'DLF The Crest',
      flatNumber: 'Tower 2, 801',
      locality: 'Sector 54, Gurgaon',
      status: 'Move-in Ready',
      depositPaid: true,
      societyNocStatus: 'Approved',
      societyRulesNote: 'Clubhouse induction complete.'
    },
    movers: {
      vendorName: 'Capital Fast Movers',
      vendorPhone: '+91 98110 55677',
      status: 'Delivered',
      slotTime: 'Completed',
      vehicleType: '17ft Container'
    },
    utilities: {
      electricityStatus: 'Active',
      internetStatus: 'Active',
      gasStatus: 'Piped Connection Active',
      waterStatus: 'Verified'
    },
    documents: {
      rentalAgreementRegistered: true,
      policeVerificationDone: true,
      bankAddressUpdated: true,
      aadhaarAddressSubmitted: true
    },
    riskScore: 'Low',
    riskReason: 'Post-move resolution: 1 broken glass center table reported during transit, insurance claim initiated.',
    notes: [
      'Customer NPS rated 9/10, pending insurance settlement voucher of ₹4,200.'
    ]
  },
  {
    id: 'REL-2026-103',
    customerName: 'Manojkumar & Divya',
    phone: '+91 94440 88219',
    email: 'manoj.divya@medhealth.org',
    fromCity: 'Chennai',
    toCity: 'Ahmedabad',
    currentPhase: 'Utility Setup',
    targetMoveDate: '2026-10-30',
    assignedOps: 'Sneha Kulkarni',
    apartment: {
      societyName: 'Godrej Garden City',
      flatNumber: 'Eden Block, 1104',
      locality: 'SG Highway',
      status: 'Move-in Ready',
      depositPaid: true,
      societyNocStatus: 'Approved',
      societyRulesNote: 'Adani Gas meter verification needed before valve opening.'
    },
    movers: {
      vendorName: 'Gujarat Express Movers',
      vendorPhone: '+91 98250 11990',
      status: 'In Transit',
      slotTime: '1:00 PM',
      vehicleType: '14ft Truck'
    },
    utilities: {
      electricityStatus: 'Meter Transferred',
      internetStatus: 'Not Started',
      gasStatus: 'Not Started',
      waterStatus: 'Verified'
    },
    documents: {
      rentalAgreementRegistered: true,
      policeVerificationDone: true,
      bankAddressUpdated: false,
      aadhaarAddressSubmitted: false
    },
    riskScore: 'Medium',
    riskReason: 'Adani Gas technician rejected slot today due to missing physical signature on transfer form from landlord.',
    notes: [
      'Customer arriving by flight on Oct 29 evening; needs cooking gas operational by Oct 30 morning.'
    ]
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'TSK-101',
    relocationId: 'REL-2026-081',
    customerName: 'Aditya & Ritu Mehra',
    city: 'Bengaluru',
    title: 'Obtain Landlord signed Lift Deposit receipt for Prestige Society MC',
    category: 'society_gatepass',
    dueDate: '2026-10-26', // OVERDUE by 1 day
    status: 'overdue',
    priority: 'critical',
    assignedTo: 'Priya Sharma',
    notes: 'Prestige estate office will not allow SafePack truck at security gate without physical signed slip.',
    blockerReason: 'NRI Landlord in Singapore hasn’t emailed scanned copy.'
  },
  {
    id: 'TSK-102',
    relocationId: 'REL-2026-081',
    customerName: 'Aditya & Ritu Mehra',
    city: 'Bengaluru',
    title: 'Confirm freight elevator slot reservation (10:00 AM - 2:00 PM)',
    category: 'society_gatepass',
    dueDate: '2026-10-27', // Due Today
    status: 'pending',
    priority: 'high',
    assignedTo: 'Priya Sharma',
    notes: 'Tower 4 freight lift is shared with another resident moving out.'
  },
  {
    id: 'TSK-103',
    relocationId: 'REL-2026-084',
    customerName: 'Kavita Sundaram',
    city: 'Pune',
    title: 'Collect Stamped Index II copy from broker for MSEDCL meter',
    category: 'utilities',
    dueDate: '2026-10-25', // OVERDUE
    status: 'overdue',
    priority: 'high',
    assignedTo: 'Rahul Verma',
    notes: 'Hadapsar MSEDCL sub-division requires physical stamped Index II to approve transfer.',
    blockerReason: 'Broker Omkar Properties hasn’t picked up copy from Sub-Registrar.'
  },
  {
    id: 'TSK-104',
    relocationId: 'REL-2026-089',
    customerName: 'Saurabh Joshi',
    city: 'Mumbai',
    title: 'Negotiate Bandra Pali Hill mini-shuttle tempo fee with Mumbai Star Packers',
    category: 'movers',
    dueDate: '2026-10-26', // OVERDUE
    status: 'overdue',
    priority: 'critical',
    assignedTo: 'Rahul Verma',
    notes: 'Vendor demanding ₹12k extra; standard cap in agreement is ₹4k. Customer unaware.',
    blockerReason: 'Vendor refuses to dispatch truck until extra payment is locked.'
  },
  {
    id: 'TSK-105',
    relocationId: 'REL-2026-089',
    customerName: 'Saurabh Joshi',
    city: 'Mumbai',
    title: 'Draft registered rent agreement with Mumbai biometrics executive',
    category: 'documentation',
    dueDate: '2026-10-27', // Due Today
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Rahul Verma',
    notes: 'Home visit for fingerprint scan booked for today 5:00 PM.'
  },
  {
    id: 'TSK-106',
    relocationId: 'REL-2026-103',
    customerName: 'Manojkumar & Divya',
    city: 'Ahmedabad',
    title: 'Call Adani Gas supervisor to re-book emergency valve activation slot',
    category: 'utilities',
    dueDate: '2026-10-27', // Due Today
    status: 'pending',
    priority: 'high',
    assignedTo: 'Sneha Kulkarni',
    notes: 'Get digital landlord NOC sent via WhatsApp to supervisor.'
  },
  {
    id: 'TSK-107',
    relocationId: 'REL-2026-095',
    customerName: 'Ananya Deshmukh',
    city: 'Bengaluru',
    title: 'Verify Panathur underpass road status with local field logistics contact',
    category: 'movers',
    dueDate: '2026-10-29',
    status: 'pending',
    priority: 'medium',
    assignedTo: 'Vikram Nair',
    notes: 'Backup route via Balagere-Varthur main road if heavy rain.'
  },
  {
    id: 'TSK-108',
    relocationId: 'REL-2026-092',
    customerName: 'Deepak & Nidhi Chawla',
    city: 'Hyderabad',
    title: 'Confirm My Home Bhooja society pet policy documentation',
    category: 'apartment',
    dueDate: '2026-10-28',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: 'Sneha Kulkarni',
    notes: 'Requires rabies vaccination certificate upload to MyGate portal.'
  },
  {
    id: 'TSK-109',
    relocationId: 'REL-2026-081',
    customerName: 'Aditya & Ritu Mehra',
    city: 'Bengaluru',
    title: 'Schedule Airtel Xstream Fiber technician for Oct 28 at 4:00 PM',
    category: 'utilities',
    dueDate: '2026-10-27', // Due Today
    status: 'pending',
    priority: 'medium',
    assignedTo: 'Priya Sharma',
    notes: 'Order ID: BLR-ART-99210.'
  },
  {
    id: 'TSK-110',
    relocationId: 'REL-2026-098',
    customerName: 'Rohan Sen',
    city: 'Delhi-NCR',
    title: 'Disburse ₹4,200 transit transit insurance reimbursement',
    category: 'post_move',
    dueDate: '2026-10-28',
    status: 'in_progress',
    priority: 'low',
    assignedTo: 'Amit Roy',
    notes: 'Claim form approved by Bajaj Allianz surveyor.'
  }
];

export const INITIAL_ISSUES: Issue[] = [
  {
    id: 'ISS-001',
    relocationId: 'REL-2026-081',
    customerName: 'Aditya & Ritu Mehra',
    city: 'Bengaluru',
    title: 'Society Gate Pass Blocked (Prestige Lakeside Habitat)',
    description: 'Prestige Management Committee refused truck entry gate pass for tomorrow 10 AM. Demanding signed refundable lift deposit slip from landlord, who is in Singapore.',
    severity: 'critical',
    status: 'open',
    category: 'society_gatepass',
    reportedAt: '2026-10-27 11:30 AM',
    assignedTo: 'Priya Sharma',
    suggestedAiAction: 'Trigger QuickMove Escrow guarantee waiver to the Society Estate Manager + send pre-formatted e-signature authorization link to Singapore landlord.',
    suggestedWhatsAppMsg: 'Dear Prestige Management Committee, QuickMove officially undertakes the refundable lift deposit liability of ₹15,000 for Flat 1402 Tower 4 under Guarantee Reference #QM-BLR-8819. Landlord digital authorization is attached. Kindly approve gate pass for vehicle KA-03-D-4412.'
  },
  {
    id: 'ISS-002',
    relocationId: 'REL-2026-089',
    customerName: 'Saurabh Joshi',
    city: 'Mumbai',
    title: 'Truck Access Blocked on Pali Hill & Vendor Extortion',
    description: 'Packers & Movers vendor arrived with 17ft container which is barred from Bandra West narrow lane. Vendor is demanding ₹12,000 cash for 3 mini-tempos or threatening to unload on roadside.',
    severity: 'critical',
    status: 'open',
    category: 'movers',
    reportedAt: '2026-10-27 01:15 PM',
    assignedTo: 'Rahul Verma',
    suggestedAiAction: 'Dispatch QuickMove partner local tempo fleet from Santacruz warehouse at negotiated ₹3,800 rate and deduct difference from primary vendor invoice under SLA clause 7.2.',
    suggestedWhatsAppMsg: 'Hi Saurabh, do not pay any extra cash to the truck crew. QuickMove ops team is dispatching 2 local shuttle tempos directly to Pali Hill to safely transfer your goods. Our ground coordinator Rahul is managing the transfer.'
  },
  {
    id: 'ISS-003',
    relocationId: 'REL-2026-103',
    customerName: 'Manojkumar & Divya',
    city: 'Ahmedabad',
    title: 'Adani Gas Connection Stalled - Missing Landlord Meter NOC',
    description: 'Customer arriving Oct 29 evening. Technician refused to turn on pipeline gas valve due to missing physical NOC form from landlord.',
    severity: 'high',
    status: 'open',
    category: 'utilities',
    reportedAt: '2026-10-27 02:45 PM',
    assignedTo: 'Sneha Kulkarni',
    suggestedAiAction: 'Send emergency WhatsApp template to landlord for instant OTP consent on Adani Gas portal + provide QuickMove backup induction cooktop rental for Day 1.',
    suggestedWhatsAppMsg: 'Hello Mr. Patel (Landlord), QuickMove is assisting your new tenant Manojkumar at Godrej Garden City. To avoid cooking disruption upon their arrival, please verify the 6-digit OTP sent by Adani Gas or sign the 1-click digital NOC: https://quickmove.in/noc/ad-992'
  },
  {
    id: 'ISS-004',
    relocationId: 'REL-2026-084',
    customerName: 'Kavita Sundaram',
    city: 'Pune',
    title: 'MSEDCL Electricity Transfer Stalled - Broker Delay',
    description: 'Amanora Gateway Towers broker has not delivered stamped Index II, risking meter power cut during billing cycle rollover.',
    severity: 'medium',
    status: 'in_progress',
    category: 'utilities',
    reportedAt: '2026-10-26 04:00 PM',
    assignedTo: 'Rahul Verma',
    suggestedAiAction: 'Fetch certified digital Index II online from Maharashtra e-Mahabhulekh / IGR portal using document registration number directly, bypassing broker delay.',
    suggestedWhatsAppMsg: 'Hi Omkar Properties, QuickMove requires the digital copy of registered agreement #PUN-HAV-9941 today for Kavita Sundaram’s MSEDCL transfer. We can pull it from IGR if you share the GRN challan receipt.'
  }
];
