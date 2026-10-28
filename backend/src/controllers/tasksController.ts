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
  res.json((data ?? []).map((row: Record<string, any>) => ({
    ...(row.payload ?? row),
    id: row.id,
    relocationId: row.move_id,
  })));
};

// POST /api/tasks
export const createTask = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as Partial<Task> & Record<string, any>;
  const requestedMoveId = body.relocationId ?? body.move_id;

  if (!requestedMoveId || !body.title) {
    res.status(400).json({ error: 'Missing required fields: relocationId, title' });
    return;
  }

  const { data: move, error: moveError } = await supabase
    .from('moves')
    .select('id, client_name, origin_city, destination_city, move_date, payload')
    .eq('id', String(requestedMoveId))
    .single();

  if (moveError || !move) {
    res.status(404).json({ error: 'The selected relocation was not found' });
    return;
  }

  const relocationId = move.id;
  const taskPayload = {
    ...body,
    relocationId,
    move_id: relocationId,
    customerName: move.payload?.customerName ?? move.client_name,
    city: move.payload?.toCity ?? move.destination_city,
  };

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      id: body.id ?? `TSK-${Date.now()}`,
      move_id: relocationId,
      title: body.title,
      description: body.description || body.notes || '',
      status: body.status || 'Pending',
      due_date: body.due_date || body.dueDate || null,
      assigned_to: body.assigned_to || body.assignedTo || '',
      payload: taskPayload,
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
  const requestedMoveId = payload.relocationId ?? payload.move_id ?? current.move_id;
  if (String(requestedMoveId) !== String(current.move_id)) {
    res.status(400).json({ error: 'A task cannot be reassigned to a different relocation' });
    return;
  }

  const { data: move, error: moveError } = await supabase
    .from('moves')
    .select('id, client_name, destination_city, payload')
    .eq('id', current.move_id)
    .single();
  if (moveError || !move) {
    res.status(409).json({ error: 'The task relocation no longer exists' });
    return;
  }

  payload.relocationId = move.id;
  payload.move_id = move.id;
  payload.customerName = move.payload?.customerName ?? move.client_name;
  payload.city = move.payload?.toCity ?? move.destination_city;
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
