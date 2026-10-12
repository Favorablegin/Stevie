// Web-Push für Stevie: Schlüssel, Abos, Benachrichtigungen
import { validCode, get } from '../lib/store.js';
import { loadPush, savePush, register, subId, sendTo, prefOf } from '../lib/push.js';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
}
async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
  const chunks = []; for await (const c of req) chunks.push(c);
  try { return JSON.parse(Buffer.concat(chunks).toString() || '{}'); } catch { return {}; }
}
const clip = (s, n) => String(s || '').slice(0, n);

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const q = req.query || {};
    const b = req.method === 'POST' ? await readBody(req) : {};
    const action = q.action || b.action;
    const code = q.code || b.code;
    if (!validCode(code)) return res.status(400).json({ error: 'code' });

    if (action === 'key') {
      const doc = await loadPush(code);
      await register(code);
      return res.json({ publicKey: doc.vapid.publicKey });
    }
    if (action === 'subscribe') {
      const sub = b.sub; const who = b.who === 'J' ? 'J' : 'F';
      if (!sub || !sub.endpoint || !/^https:\/\//.test(sub.endpoint)) return res.status(400).json({ error: 'sub' });
      const doc = await loadPush(code);
      for (const [id, s] of Object.entries(doc.subs)) if (s.device && s.device === b.device && s.sub.endpoint !== sub.endpoint) delete doc.subs[id];
      doc.subs[subId(sub.endpoint)] = { who, sub, device: clip(b.device, 40), ua: clip(b.ua, 120), at: Date.now() };
      await savePush(code, doc); await register(code);
      return res.json({ ok: true, count: Object.keys(doc.subs).length });
    }
    if (action === 'unsubscribe') {
      const doc = await loadPush(code, false);
      if (doc && b.endpoint) { delete doc.subs[subId(b.endpoint)]; await savePush(code, doc); }
      return res.json({ ok: true });
    }
    if (action === 'status') {
      const doc = await loadPush(code, false);
      const subs = doc ? Object.values(doc.subs) : [];
      return res.json({ F: subs.filter(s => s.who === 'F').length, J: subs.filter(s => s.who === 'J').length });
    }
    if (action === 'notify' || action === 'test') {
      const doc = await loadPush(code, false);
      if (!doc) return res.json({ sent: 0 });
      const payload = { title: clip(b.title, 120), body: clip(b.body, 600), tag: clip(b.tag, 40) || undefined, url: '/?s=' + code };
      let filter;
      if (action === 'test') filter = s => (b.endpoint ? s.sub.endpoint === b.endpoint : s.who === b.from);
      else {
        const kind = ['session', 'success', 'bowl', 'idle'].includes(b.kind) ? b.kind : 'session';
        const data = await get(code).catch(() => null);
        filter = s => (b.toSelf || s.who !== b.from) && prefOf(data, s.who, kind);
      }
      const sent = await sendTo(code, doc, filter, payload);
      return res.json({ sent });
    }
    return res.status(400).json({ error: 'action' });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}
