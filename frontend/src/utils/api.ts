import { Issue, Relocation, Task } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
      ...options,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Network request failed';
    throw new Error(`Backend unavailable at ${API_BASE}: ${detail}`);
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Backend request failed (${response.status})`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
};

export const api = {
  getRelocations: () => request<Relocation[]>('/moves'),
  createRelocation: (relocation: Relocation) => request<Relocation>('/moves', { method: 'POST', body: JSON.stringify(relocation) }),
  updateRelocation: (relocation: Relocation) => request<Relocation>(`/moves/${encodeURIComponent(relocation.id)}`, { method: 'PUT', body: JSON.stringify(relocation) }),
  deleteRelocation: (id: string) => request<void>(`/moves/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  getTasks: () => request<Task[]>('/tasks'),
  createTask: (task: Omit<Task, 'id'>) => request<Task>('/tasks', { method: 'POST', body: JSON.stringify({ ...task, move_id: task.relocationId }) }),
  updateTask: (task: Task) => request<Task>(`/tasks/${encodeURIComponent(task.id)}`, { method: 'PUT', body: JSON.stringify(task) }),
  getIssues: () => request<Issue[]>('/blockers'),
  createIssue: (issue: Omit<Issue, 'id'>) => request<Issue>('/blockers', { method: 'POST', body: JSON.stringify(issue) }),
  updateIssue: (issue: Issue) => request<Issue>(`/blockers/${encodeURIComponent(issue.id)}`, { method: 'PUT', body: JSON.stringify(issue) }),
  parseMessage: (message: string, relocations: Relocation[]) => request<{
    customerMatched: string;
    city: string;
    category: Task['category'];
    severity: 'critical' | 'high' | 'medium' | 'low';
    rootCause: string;
    actionPlan: string;
    draftResponse: string;
    targetRelocationId: string | null;
  }>('/ai/parse-message', { method: 'POST', body: JSON.stringify({ message, relocations }) }),
};
