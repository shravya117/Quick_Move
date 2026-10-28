import { Request, Response } from 'express';
import { groq, GROQ_MODEL, SYSTEM_PROMPT } from '../services/groq';

const allowedCategories = new Set(['apartment', 'movers', 'utilities', 'documentation', 'society_gatepass', 'post_move']);
const allowedSeverities = new Set(['critical', 'high', 'medium', 'low']);

export const parseOperationsMessage = async (req: Request, res: Response): Promise<void> => {
  const { message, relocations } = req.body as { message?: string; relocations?: unknown[] };
  if (!message?.trim()) {
    res.status(400).json({ error: 'message is required' });
    return;
  }

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: `${SYSTEM_PROMPT}\nReturn only JSON with keys: customerMatched, targetRelocationId, city, category, severity, rootCause, actionPlan, draftResponse. category must be one of: apartment, movers, utilities, documentation, society_gatepass, post_move. severity must be one of: critical, high, medium, low. Use only a targetRelocationId from the supplied relocations or null.` },
        { role: 'user', content: JSON.stringify({ message, relocations }) },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('Groq returned an empty response');
    const parsed: Record<string, unknown> = JSON.parse(content);
    const relocationIds = new Set((relocations ?? []).map((relocation) => {
      if (relocation && typeof relocation === 'object' && 'id' in relocation) {
        return String((relocation as { id: unknown }).id);
      }
      return '';
    }));
    if (parsed.targetRelocationId != null && !relocationIds.has(String(parsed.targetRelocationId))) {
      parsed.targetRelocationId = null;
    }
    const matchedRelocation = (relocations ?? []).find((relocation) =>
      relocation && typeof relocation === 'object' &&
      String((relocation as { id?: unknown }).id) === String(parsed.targetRelocationId),
    ) as { customerName?: unknown; toCity?: unknown } | undefined;
    parsed.customerMatched = typeof parsed.customerMatched === 'string'
      ? parsed.customerMatched
      : String(matchedRelocation?.customerName ?? '');
    parsed.city = typeof parsed.city === 'string'
      ? parsed.city
      : String(matchedRelocation?.toCity ?? '');
    if (typeof parsed.rootCause !== 'string' || typeof parsed.actionPlan !== 'string' ||
      typeof parsed.draftResponse !== 'string' || !allowedCategories.has(String(parsed.category)) ||
      !allowedSeverities.has(String(parsed.severity))) {
      res.status(502).json({ error: 'Groq returned an invalid operations result' });
      return;
    }
    res.json({ ...parsed, targetRelocationId: parsed.targetRelocationId ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AI service unavailable';
    const isModelError = message.includes('model_not_found') || message.includes('does not exist') || message.includes('do not have access');
    res.status(502).json({
      error: isModelError
        ? `Groq model "${GROQ_MODEL}" is unavailable. Set GROQ_MODEL in backend/.env to an enabled Groq model.`
        : message,
    });
  }
};
