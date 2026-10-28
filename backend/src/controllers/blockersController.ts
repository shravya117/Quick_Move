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
  res.json((data ?? []).map((row: Record<string, any>) => ({
    ...(row.payload ?? {}),
    id: row.id,
    relocationId: row.move_id,
    title: row.title,
    description: row.description,
    severity: row.severity,
    status: row.status,
    assignedTo: row.assigned_to,
  })));
};

export const createBlocker = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as Record<string, unknown>;
  if (!body.relocationId || !body.title || !body.description || !body.reportedBy || !body.assignedTo) {
    res.status(400).json({ error: 'Missing required blocker fields' });
    return;
  }

  const { data: move, error: moveError } = await supabase
    .from('moves')
    .select('id, client_name, destination_city, payload')
    .eq('id', String(body.relocationId))
    .single();
  if (moveError || !move) {
    res.status(404).json({ error: 'The selected relocation was not found' });
    return;
  }

  const reportedAt = body.reportedAt ?? new Date().toISOString();
  const row = {
    id: body.id ?? `ISS-${Date.now()}`,
    move_id: move.id,
    title: body.title,
    description: body.description,
    severity: body.severity ?? 'medium',
    status: 'open',
    assigned_to: body.assignedTo,
    payload: {
      ...body,
      relocationId: move.id,
      customerName: move.payload?.customerName ?? move.client_name,
      city: move.payload?.toCity ?? move.destination_city,
      reportedAt,
      status: 'open',
    },
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
  if (payload.status === 'resolved' && !payload.resolutionNotes) {
    res.status(400).json({ error: 'Resolution notes are required before resolving a blocker' });
    return;
  }
  if (payload.status === 'resolved') {
    payload.resolvedAt = payload.resolvedAt ?? new Date().toISOString();
    payload.resolvedBy = payload.resolvedBy ?? payload.assignedTo;
  }
  if (payload.status !== 'resolved') {
    payload.resolvedAt = undefined;
    payload.resolvedBy = undefined;
  }
  const { data, error } = await supabase.from('blockers').update({
    title: payload.title ?? current.title,
    description: payload.description ?? current.description,
    severity: payload.severity ?? current.severity,
    status: payload.status ?? current.status,
    assigned_to: payload.assignedTo ?? payload.assigned_to ?? current.assigned_to,
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
