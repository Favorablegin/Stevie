// Abendliche Prüfung: Futterschale bis 19:30 + 3 Tage ohne Session. Idempotent, darf oft aufgerufen werden.
import { get } from '../lib/store.js';
import { registryKey } from '../lib/store.js';
import { loadPush, savePush, sendTo, prefOf } from '../lib/push.js';

function berlin(now = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(now).map(x => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, mins: (+p.hour % 24) * 60 + +p.minute };
}
export default async function handler(req, res) {
  const { date, mins } = berlin();
  const out = [];
  try {
    const reg = (await get(registryKey())) || { codes: [] };
    for (const code of reg.codes) {
      const doc = await loadPush(code, false); if (!doc || !Object.keys(doc.subs || {}).length) continue;
      const data = await get(code); if (!data) continue;
      doc.sent = doc.sent || {};
      let changed = false;
      // 1) Futterschale ab 19:30
      const bowlDone = data.bowl && data.bowl[date] && data.bowl[date].done;
      if (mins >= 19 * 60 + 30 && mins < 23 * 60 && !bowlDone && doc.sent.bowl !== date) {
        const n = await sendTo(code, doc, s => prefOf(data, s.who, 'bowl'), { title: '🥣 Futterschale für Stevie', body: 'Heute ist noch keine Gute-Nachricht-Mahlzeit eingetragen. Schon erledigt? Kurz in der App abhaken.', tag: 'bowl', url: '/?s=' + code });
        doc.sent.bowl = date; changed = true; out.push({ code: code.slice(0, 6), bowl: n });
      }
      // 2) Drei Tage keine Session (und kein Ruhetag)
      const ss = Object.values(data.sessions || {}).filter(s => !s.deleted && s.animal !== 'stupsi').map(s => s.date).sort();
      const rests = Object.entries(data.rest || {}).filter(([, r]) => r.on).map(([d]) => d).sort();
      const lastAct = [ss[ss.length - 1], rests[rests.length - 1]].filter(Boolean).sort().pop();
      if (lastAct && mins >= 18 * 60 && mins < 22 * 60) {
        const days = Math.round((Date.parse(date) - Date.parse(lastAct)) / 864e5);
        if (days >= 3 && doc.sent.idle !== lastAct) {
          const n = await sendTo(code, doc, s => prefOf(data, s.who, 'idle'), { title: '🦙 Stevie wartet', body: `Seit ${days} Tagen keine Session. Heute eine kurze, leichte Runde? Oder bewusst einen Ruhetag eintragen.`, tag: 'idle', url: '/?s=' + code });
          doc.sent.idle = lastAct; changed = true; out.push({ code: code.slice(0, 6), idle: n });
        }
      }
      if (changed) await savePush(code, doc);
    }
    res.json({ ok: true, berlin: { date, mins }, out });
  } catch (e) { res.status(500).json({ error: String(e.message || e) }); }
}
