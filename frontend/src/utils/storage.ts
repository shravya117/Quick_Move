import { Relocation, Task, Issue } from '../types';
import { INITIAL_RELOCATIONS, INITIAL_TASKS, INITIAL_ISSUES } from '../data/mockData';

const STORAGE_KEYS = {
  RELOCATIONS: 'qm_relocations',
  TASKS: 'qm_tasks',
  ISSUES: 'qm_issues',
};

export const loadRelocations = (): Relocation[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RELOCATIONS);
    return data ? JSON.parse(data) : INITIAL_RELOCATIONS;
  } catch {
    return INITIAL_RELOCATIONS;
  }
};

export const saveRelocations = (relocations: Relocation[]): void => {
  localStorage.setItem(STORAGE_KEYS.RELOCATIONS, JSON.stringify(relocations));
};

export const loadTasks = (): Task[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : INITIAL_TASKS;
  } catch {
    return INITIAL_TASKS;
  }
};

export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

export const loadIssues = (): Issue[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ISSUES);
    return data ? JSON.parse(data) : INITIAL_ISSUES;
  } catch {
    return INITIAL_ISSUES;
  }
};

export const saveIssues = (issues: Issue[]): void => {
  localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
};

export const resetToDemoData = () => {
  localStorage.removeItem(STORAGE_KEYS.RELOCATIONS);
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.ISSUES);
  window.location.reload();
};
