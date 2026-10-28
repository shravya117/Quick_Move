import { Request, Response } from 'express';
import { supabase } from '../services/supabase';
import { Move } from '../types';

const toRelocation = (row: Record<string, any>): Record<string, any> => {
  const payload = row.payload ?? {};
  const persistedAssignment = payload.providerAssignment ?? {};
  const hasProviderAssignment = Boolean(
    row.provider_id ||
    persistedAssignment.providerId ||
    persistedAssignment.providerName
  );

  return {
    ...payload,
    id: row.id,
    currentPhase: row.current_phase ?? payload.currentPhase ?? 'Apartment Shortlist',
    ...(hasProviderAssignment
      ? {
          providerAssignment: {
            ...persistedAssignment,
            ...(row.provider_id ? { providerId: row.provider_id } : {}),
            ...(row.assignment_status ? { assignmentStatus: row.assignment_status } : {}),
            ...(row.ops_confirmation_status === 'confirmed'
              ? { assignmentStatus: 'confirmed' }
              : {}),
          },
        }
      : {}),
  };
};

// GET /api/moves
export const getMoves = async (_req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('moves')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json((data ?? []).map(toRelocation));
};

// GET /api/moves/:id
export const getMoveById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('moves')
    .select('*, tasks(*), blockers(*)')
    .eq('id', id)
    .single();

  if (error) {
    res.status(404).json({ error: 'Move not found' });
    return;
  }
  res.json(toRelocation(data));
};

// POST /api/moves
export const createMove = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as Partial<Move> & Record<string, any>;

  if (!body.id || !body.customerName || !body.fromCity || !body.toCity || !body.targetMoveDate || !body.currentPhase) {
    res.status(400).json({ error: 'Missing required relocation fields' });
    return;
  }

  const newMove = {
    id: body.id,
    client_name: body.customerName,
    origin_city: body.fromCity,
    destination_city: body.toCity,
    move_date: body.targetMoveDate,
    status: body.currentPhase,
    priority: body.riskScore,
    assigned_team: body.assignedOps,
    current_phase: body.currentPhase,
    payload: body,
  };

  const { data, error } = await supabase
    .from('moves')
    .insert(newMove)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(201).json(toRelocation(data));
};

// PUT /api/moves/:id
export const updateMove = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updates = req.body as Partial<Move> & Record<string, any>;
  const { data: current, error: currentError } = await supabase.from('moves').select('payload').eq('id', id).single();
  if (currentError) {
    res.status(404).json({ error: 'Move not found' });
    return;
  }
  const payload = { ...(current.payload ?? {}), ...updates, id };

  const { data, error } = await supabase
    .from('moves')
    .update({
      client_name: payload.customerName,
      origin_city: payload.fromCity,
      destination_city: payload.toCity,
      move_date: payload.targetMoveDate,
      status: payload.currentPhase,
      priority: payload.riskScore,
      assigned_team: payload.assignedOps,
      current_phase: payload.currentPhase,
      payload,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(toRelocation(data));
};

// DELETE /api/moves/:id
export const deleteMove = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const { error } = await supabase
    .from('moves')
    .delete()
    .eq('id', id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(204).send();
};
