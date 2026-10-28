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
  res.json(data);
};

// POST /api/tasks
export const createTask = async (req: Request, res: Response): Promise<void> => {
  const body: Partial<Task> = req.body;

  if (!body.move_id || !body.title) {
    res.status(400).json({ error: 'Missing required fields: move_id, title' });
    return;
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      move_id: body.move_id,
      title: body.title,
      description: body.description || '',
      status: body.status || 'Pending',
      due_date: body.due_date || null,
      assigned_to: body.assigned_to || '',
    })
    .select()
    .single();

  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(201).json(data);
};

// PUT /api/tasks/:id
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('tasks').update(req.body).eq('id', id).select().single();
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
};

// DELETE /api/tasks/:id
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(204).send();
};
