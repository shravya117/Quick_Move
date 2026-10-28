import { Request, Response } from 'express';
import { supabase } from '../services/supabase';

export const getBlockers = async (req: Request, res: Response): Promise<void> => {
  let query = supabase.from('blockers').select('*').order('created_at', { ascending: false });
  if (req.query.move_id) query = query.eq('move_id', String(req.query.move_id));

  const { data, error } = await query;
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data ?? []);
};

export const createBlocker = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as Record<string, unknown>;
  if (!body.relocationId || !body.title) {
    res.status(400).json({ error: 'Missing required fields: relocationId, title' });
    return;
  }

  const row = {
    id: body.id ?? `ISS-${Date.now()}`,
    move_id: body.relocationId,
    title: body.title,
    description: body.description ?? '',
    severity: body.severity ?? 'medium',
    status: body.status ?? 'open',
    assigned_to: body.assignedTo ?? '',
    payload: body,
  };
  const { data, error } = await supabase.from('blockers').insert(row).select().single();
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(201).json(data?.payload ?? data);
};

export const updateBlocker = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { data: current, error: currentError } = await supabase.from('blockers').select('*').eq('id', id).single();
  if (currentError) {
    res.status(404).json({ error: 'Blocker not found' });
    return;
  }

  const payload = { ...(current.payload ?? {}), ...req.body, id };
  const { data, error } = await supabase.from('blockers').update({
    status: payload.status ?? current.status,
    payload,
  }).eq('id', id).select().single();
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data?.payload ?? data);
};

export const deleteBlocker = async (req: Request, res: Response): Promise<void> => {
  const { error } = await supabase.from('blockers').delete().eq('id', req.params.id);
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(204).send();
};
