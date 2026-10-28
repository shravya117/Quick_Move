// Shared TypeScript types for backend

export type MoveStatus = 'Planning' | 'Packing' | 'In Transit' | 'Delivered' | 'Completed' | 'On Hold';
export type MovePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskStatus = 'Pending' | 'In Progress' | 'Done' | 'Blocked';
export type BlockerSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type BlockerStatus = 'Open' | 'In Progress' | 'Resolved';

export interface Move {
  id: string;
  client_name: string;
  origin_city: string;
  destination_city: string;
  move_date: string;
  status: MoveStatus;
  priority: MovePriority;
  assigned_team: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: string;
  move_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  due_date?: string;
  assigned_to?: string;
  created_at?: string;
}

export interface Blocker {
  id: string;
  move_id: string;
  title: string;
  description?: string;
  severity: BlockerSeverity;
  status: BlockerStatus;
  reported_by?: string;
  created_at?: string;
  resolved_at?: string;
}

export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiChatRequest {
  message: string;
  history?: AiChatMessage[];
  context?: {
    activeMoves?: number;
    pendingTasks?: number;
    openBlockers?: number;
    recentMove?: Partial<Move>;
  };
}
