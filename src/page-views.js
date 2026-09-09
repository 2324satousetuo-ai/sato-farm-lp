export const PAGE_VIEW_KEY = 'sato-farm-nakanojo-lp';

function unavailable(error) {
  const next = new Error('database_unavailable');
  next.code = 'database_unavailable';
  if (error) {
    next.cause = error;
  }
  return next;
}

export async function hitPageView(env) {
  if (!env || !env.DB) {
    throw unavailable();
  }

  try {
    const row = await env.DB.prepare(
      `INSERT INTO page_views (key, count)
       VALUES (?, 1)
       ON CONFLICT(key) DO UPDATE SET count = count + 1
       RETURNING count`
    )
      .bind(PAGE_VIEW_KEY)
      .first();

    const value = Number(row && row.count);
    if (!Number.isFinite(value)) {
      throw new Error('counter_invalid');
    }
    return value;
  } catch (error) {
    if (error && error.message === 'counter_invalid') {
      throw error;
    }
    const message = String((error && error.message) || error);
    if (/no such table:\s*page_views/i.test(message)) {
      throw unavailable(error);
    }
    throw error;
  }
}
