import webpush from 'web-push';
import crypto from 'node:crypto';
import { get, set, registryKey, pushKey } from './store.js';

export async function loadPush(code, create = true) {
  const key = pushKey(code);
  let doc = await get(key);
  if (!doc && create) {
    const v = webpush.generateVAPIDKeys();
    doc = { vapid: { publicKey: v.publicKey, privateKey: v.privateKey }, subs: {}, sent: {} };
    await set(key, doc);
    await register(code);
  }
  return doc;
}
export const savePush = (code, doc) => set(pushKey(code), doc);
export async function register(code) {
  const k = registryKey();
  const reg = (await get(k)) || { codes: [] };
  if (!reg.codes.includes(code)) { reg.codes.push(code); await set(k, reg); }
}
export const subId = endpoint => crypto.createHash('sha256').update(endpoint).digest('hex').slice(0, 16);

// sendet an alle Abos, die laut Filter dran sind; entfernt abgelaufene Abos
export async function sendTo(code, doc, filter, payload) {
  const opts = { TTL: 60 * 60 * 6, urgency: 'normal', vapidDetails: { subject: 'https://stevie-ten.vercel.app', publicKey: doc.vapid.publicKey, privateKey: doc.vapid.privateKey } };
  let sent = 0, removed = false;
  await Promise.all(Object.entries(doc.subs || {}).filter(([, s]) => filter(s)).map(async ([id, s]) => {
    try { await webpush.sendNotification(s.sub, JSON.stringify(payload), opts); sent++; }
    catch (e) { if (e.statusCode === 404 || e.statusCode === 410) { delete doc.subs[id]; removed = true; } }
  }));
  if (removed) await savePush(code, doc);
  return sent;
}
export function prefOf(data, who, kind) {
  const p = data && data.settings && data.settings.push && data.settings.push.prefs && data.settings.push.prefs[who];
  if (!p) return true; // Standard: alles an
  return p[kind] !== false;
}
