import { Request, Response } from 'express';
import { supabase } from '../services/supabase';
import { Move } from '../types';

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
  res.json(data);
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
  res.json(data);
};

// POST /api/moves
export const createMove = async (req: Request, res: Response): Promise<void> => {
  const body: Partial<Move> = req.body;

  if (!body.client_name || !body.origin_city || !body.destination_city || !body.move_date) {
    res.status(400).json({ error: 'Missing required fields: client_name, origin_city, destination_city, move_date' });
    return;
  }

  const newMove = {
    client_name: body.client_name,
    origin_city: body.origin_city,
    destination_city: body.destination_city,
    move_date: body.move_date,
    status: body.status || 'Planning',
    priority: body.priority || 'Medium',
    assigned_team: body.assigned_team || 'Unassigned',
    notes: body.notes || '',
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
  res.status(201).json(data);
};

// PUT /api/moves/:id
export const updateMove = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updates: Partial<Move> = req.body;

  const { data, error } = await supabase
    .from('moves')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
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
