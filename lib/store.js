// Speicher: textdb.online (dieselbe Ablage wie die App)
import crypto from 'node:crypto';
const API = 'https://textdb.online';
export const validCode = c => typeof c === 'string' && /^[a-z0-9]{10,40}$/i.test(c);
export async function get(key) {
  const r = await fetch(`${API}/${encodeURIComponent(key)}?t=${Date.now()}`, { cache: 'no-store' });
  if (!r.ok) throw new Error('textdb ' + r.status);
  const t = (await r.text()).trim();
  if (!t) return null;
  try { return JSON.parse(t); } catch { return null; }
}
export async function set(key, obj) {
  const body = new URLSearchParams({ key, value: JSON.stringify(obj) });
  const r = await fetch(`${API}/update`, { method: 'POST', body });
  const j = await r.json().catch(() => ({}));
  if (j.status !== 1) throw new Error('textdb write: ' + (j.error || r.status));
}
const secret = () => crypto.createHash('sha256').update((process.env.STEVIE_SECRET || process.env.VERCEL_PROJECT_ID || 'stevie') + ':stevie-push').digest('hex');
export const registryKey = () => 'stvreg' + secret().slice(0, 26);
export const pushKey = code => 'stvpush' + crypto.createHash('sha256').update(secret() + ':' + code).digest('hex').slice(0, 26);
