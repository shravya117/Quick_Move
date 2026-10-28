-- QuickMove test data for the current API/frontend contract.
-- Run after 001_quickmove_persistence.sql.
-- Safe to re-run: existing IDs are left unchanged.

with seed_moves (
  id, customer_name, origin_city, destination_city, move_date,
  current_phase, priority, assigned_ops, society_name, flat_number,
  phone, email
) as (
  values
    ('REL-001', 'Aarav Sharma', 'Bengaluru', 'Pune', '2026-11-05'::date, 'Apartment Shortlist', 'High', 'Rahul Verma', 'Green Valley Apartments', 'A-1204', '+91 9000000001', 'aarav@example.com'),
    ('REL-002', 'Priya Nair', 'Mumbai', 'Bengaluru', '2026-11-08'::date, 'Packers & Movers', 'Medium', 'Ananya Rao', 'Lakeview Residency', 'B-302', '+91 9000000002', 'priya@example.com'),
    ('REL-003', 'Rohan Mehta', 'Pune', 'Hyderabad', '2026-11-10'::date, 'Utility Setup', 'High', 'Rahul Verma', 'Sunrise Heights', 'C-704', '+91 9000000003', 'rohan@example.com'),
    ('REL-004', 'Sneha Iyer', 'Chennai', 'Mumbai', '2026-11-12'::date, 'Documentation & KYC', 'Medium', 'Priya Shah', 'Palm Grove', 'D-205', '+91 9000000004', 'sneha@example.com'),
    ('REL-005', 'Karan Patel', 'Hyderabad', 'Chennai', '2026-11-14'::date, 'Moving Day', 'High', 'Ananya Rao', 'Orchid Towers', 'A-901', '+91 9000000005', 'karan@example.com'),
    ('REL-006', 'Meera Joshi', 'Delhi', 'Pune', '2026-11-16'::date, 'Post-Move Support', 'Low', 'Priya Shah', 'Maple Residency', 'E-405', '+91 9000000006', 'meera@example.com'),
    ('REL-007', 'Dev Malhotra', 'Kolkata', 'Delhi', '2026-11-18'::date, 'Apartment Shortlist', 'Medium', 'Rahul Verma', 'Silver Oak Homes', 'F-602', '+91 9000000007', 'dev@example.com'),
    ('REL-008', 'Ishita Rao', 'Mumbai', 'Hyderabad', '2026-10-20'::date, 'Completed', 'Low', 'Priya Shah', 'Riverfront Homes', 'G-110', '+91 9000000008', 'ishita@example.com')
)
insert into public.moves (
  id, client_name, origin_city, destination_city, move_date,
  status, priority, assigned_team, current_phase, payload
)
select
  id,
  customer_name,
  origin_city,
  destination_city,
  move_date,
  current_phase,
  priority,
  assigned_ops,
  current_phase,
  jsonb_build_object(
    'id', id,
    'customerName', customer_name,
    'phone', phone,
    'email', email,
    'fromCity', origin_city,
    'toCity', destination_city,
    'currentPhase', current_phase,
    'targetMoveDate', move_date,
    'assignedOps', assigned_ops,
    'apartment', jsonb_build_object(
      'societyName', society_name,
      'flatNumber', flat_number,
      'locality', destination_city || ' Central',
      'status', case when current_phase = 'Apartment Shortlist' then 'Shortlisted' else 'Agreement Signed' end,
      'depositPaid', current_phase <> 'Apartment Shortlist',
      'societyNocStatus', case when current_phase = 'Moving Day' then 'Blocked' else 'Applied' end,
      'societyRulesNote', 'Database test record'
    ),
    'movers', jsonb_build_object(
      'vendorName', case when current_phase = 'Apartment Shortlist' then 'Unassigned' else 'City Movers' end,
      'vendorPhone', '+91 9000000099',
      'status', case when current_phase = 'Completed' then 'Delivered' else 'Booked' end,
      'slotTime', '10:00 AM - 2:00 PM',
      'vehicleType', '14ft Container',
      'tollOrTransitPassIssue', current_phase = 'Moving Day'
    ),
    'utilities', jsonb_build_object(
      'electricityStatus', case when current_phase = 'Utility Setup' then 'Application Filed' else 'Not Started' end,
      'internetStatus', case when current_phase in ('Post-Move Support', 'Completed') then 'Active' else 'Not Started' end,
      'gasStatus', 'Not Started',
      'waterStatus', 'Verified'
    ),
    'documents', jsonb_build_object(
      'rentalAgreementRegistered', current_phase <> 'Apartment Shortlist',
      'policeVerificationDone', current_phase in ('Post-Move Support', 'Completed'),
      'bankAddressUpdated', current_phase = 'Completed',
      'aadhaarAddressSubmitted', current_phase = 'Completed'
    ),
    'riskScore', priority,
    'riskReason', 'Database test record',
    'notes', jsonb_build_array('Database test record')
  )
from seed_moves
on conflict (id) do nothing;

with seed_tasks (id, move_id, title, description, status, due_date, assigned_to, category, priority) as (
  values
    ('TASK-001', 'REL-001', 'Prepare apartment shortlist', 'Identify suitable apartments and confirm availability.', 'in_progress', '2026-10-29'::date, 'Rahul Verma', 'apartment', 'high'),
    ('TASK-002', 'REL-001', 'Confirm society documentation', 'Check move-in requirements with the society.', 'pending', '2026-10-31'::date, 'Rahul Verma', 'society_gatepass', 'medium'),
    ('TASK-003', 'REL-002', 'Confirm moving company', 'Confirm packing date and moving vehicle.', 'in_progress', '2026-10-30'::date, 'Ananya Rao', 'movers', 'high'),
    ('TASK-004', 'REL-003', 'Submit electricity request', 'Submit the required utility paperwork.', 'pending', '2026-11-02'::date, 'Rahul Verma', 'utilities', 'medium'),
    ('TASK-005', 'REL-004', 'Verify relocation documents', 'Check identity and address documents.', 'completed', '2026-10-25'::date, 'Priya Shah', 'documentation', 'low'),
    ('TASK-006', 'REL-005', 'Confirm vehicle entry slot', 'Confirm vehicle size and society entry time.', 'pending', '2026-11-12'::date, 'Ananya Rao', 'society_gatepass', 'high'),
    ('TASK-007', 'REL-006', 'Resolve internet installation issue', 'Follow up with the internet provider.', 'in_progress', '2026-10-30'::date, 'Priya Shah', 'utilities', 'medium'),
    ('TASK-008', 'REL-008', 'Complete move-in checklist', 'Confirm final relocation tasks are completed.', 'completed', '2026-10-20'::date, 'Priya Shah', 'post_move', 'low')
)
insert into public.tasks (
  id, move_id, title, description, status, due_date, assigned_to, payload
)
select
  task.id,
  task.move_id,
  task.title,
  task.description,
  task.status,
  task.due_date,
  task.assigned_to,
  jsonb_build_object(
    'id', task.id,
    'relocationId', task.move_id,
    'customerName', move.payload ->> 'customerName',
    'city', move.destination_city,
    'title', task.title,
    'category', task.category,
    'dueDate', task.due_date,
    'status', task.status,
    'priority', task.priority,
    'assignedTo', task.assigned_to,
    'notes', task.description
  )
from seed_tasks task
join public.moves move on move.id = task.move_id
on conflict (id) do nothing;

with seed_blockers (id, move_id, title, description, severity, status, assigned_to, category, resolution) as (
  values
    ('BLK-001', 'REL-001', 'Society approval pending', 'The society office has not confirmed move-in approval.', 'high', 'open', 'Rahul Verma', 'society_gatepass', null),
    ('BLK-002', 'REL-003', 'Electricity paperwork delayed', 'A required document is pending with the utility provider.', 'medium', 'open', 'Rahul Verma', 'utilities', null),
    ('BLK-003', 'REL-005', 'Vehicle entry timing not confirmed', 'The society has not confirmed the vehicle entry slot.', 'high', 'open', 'Ananya Rao', 'movers', null),
    ('BLK-004', 'REL-002', 'Packing material delivery delayed', 'The delivery was delayed but has since been resolved.', 'low', 'resolved', 'Ananya Rao', 'movers', 'Delivery received'),
    ('BLK-005', 'REL-008', 'Internet installation delay', 'The installation was delayed before the move was completed.', 'medium', 'resolved', 'Priya Shah', 'post_move', 'Installation completed')
)
insert into public.blockers (
  id, move_id, title, description, severity, status, assigned_to, payload
)
select
  blocker.id,
  blocker.move_id,
  blocker.title,
  blocker.description,
  blocker.severity,
  blocker.status,
  blocker.assigned_to,
  jsonb_build_object(
    'id', blocker.id,
    'relocationId', blocker.move_id,
    'customerName', move.payload ->> 'customerName',
    'city', move.destination_city,
    'title', blocker.title,
    'description', blocker.description,
    'severity', blocker.severity,
    'status', blocker.status,
    'category', blocker.category,
    'reportedAt', current_date,
    'assignedTo', blocker.assigned_to,
    'suggestedAiAction', coalesce(blocker.resolution, 'Review and confirm the operational action.')
  )
from seed_blockers blocker
join public.moves move on move.id = blocker.move_id
on conflict (id) do nothing;

select 'Relocations' as category, count(*) as total from public.moves where id like 'REL-%'
union all
select 'Tasks', count(*) from public.tasks where id like 'TASK-%'
union all
select 'Blockers', count(*) from public.blockers where id like 'BLK-%';
