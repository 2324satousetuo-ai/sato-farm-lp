import { DEFAULT_PRICE_STAGE, isPriceStage } from './price-catalog.js';

export function isPriceAdmin(request, env) {
  const secret = request.headers.get('X-Admin-Secret');
  return Boolean(secret && env && env.ADMIN_SECRET && secret === env.ADMIN_SECRET);
}

export async function getCurrentPriceStage(env) {
  if (!env || !env.DB) {
    return DEFAULT_PRICE_STAGE;
  }

  try {
    const row = await env.DB.prepare('SELECT stage FROM price_stage WHERE id = 1').first();
    if (row && isPriceStage(row.stage)) {
      return row.stage;
    }
  } catch (error) {
    const message = String((error && error.message) || error);
    if (!/no such table:\s*price_stage/i.test(message)) {
      console.error('price_stage_read_failed', error);
    }
  }

  return DEFAULT_PRICE_STAGE;
}

export async function setPriceStage(env, nextStage) {
  if (!isPriceStage(nextStage)) {
    const error = new Error('invalid_stage');
    error.code = 'invalid_stage';
    throw error;
  }
  if (!env || !env.DB) {
    const error = new Error('database_unavailable');
    error.code = 'database_unavailable';
    throw error;
  }

  const fromStage = await getCurrentPriceStage(env);
  if (fromStage === nextStage) {
    return { stage: nextStage, changed: false, fromStage };
  }

  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO price_stage (id, stage, updated_at)
       VALUES (1, ?, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET
         stage = excluded.stage,
         updated_at = datetime('now')`
    ).bind(nextStage),
    env.DB.prepare(
      `INSERT INTO price_stage_history (from_stage, to_stage, changed_at)
       VALUES (?, ?, datetime('now'))`
    ).bind(fromStage, nextStage),
  ]);

  return { stage: nextStage, changed: true, fromStage };
}
