import { Request, Response } from 'express';
import { supabase } from '../services/supabase';
import { Task } from '../types';

// GET /api/tasks?move_id=xxx
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { move_id } = req.query;

  let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });
  if (move_id) query = query.eq('move_id', move_id as string);

  const { data, error } = await query;
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json((data ?? []).map((row: Record<string, any>) => row.payload ?? row));
};

// POST /api/tasks
export const createTask = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as Partial<Task> & Record<string, any>;

  if (!body.move_id || !body.title) {
    res.status(400).json({ error: 'Missing required fields: move_id, title' });
    return;
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      id: body.id ?? `TSK-${Date.now()}`,
      move_id: body.move_id,
      title: body.title,
      description: body.description || '',
      status: body.status || 'Pending',
      due_date: body.due_date || null,
      assigned_to: body.assigned_to || '',
      payload: body,
    })
    .select()
    .single();

  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(201).json(data?.payload ?? data);
};

// PUT /api/tasks/:id
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { data: current, error: currentError } = await supabase.from('tasks').select('*').eq('id', id).single();
  if (currentError) { res.status(404).json({ error: 'Task not found' }); return; }
  const payload = { ...(current.payload ?? {}), ...req.body, id };
  const { data, error } = await supabase
    .from('tasks').update({
      title: payload.title,
      description: payload.notes ?? payload.description ?? '',
      status: payload.status,
      due_date: payload.dueDate ?? payload.due_date ?? null,
      assigned_to: payload.assignedTo ?? payload.assigned_to ?? '',
      payload,
    }).eq('id', id).select().single();
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data?.payload ?? data);
};

// DELETE /api/tasks/:id
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(204).send();
};
