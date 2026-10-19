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
      // 2) Drei Tage keine Session – pro Tier (nur Tiere, die in den letzten 30 Tagen trainiert wurden)
      if (mins >= 18 * 60 && mins < 22 * 60) {
        const NAMES = { stevie: 'Stevie', stupsi: 'Stupsi', coco: 'Coco' };
        const byAnimal = {};
        for (const s of Object.values(data.sessions || {})) if (!s.deleted) (byAnimal[s.animal || 'stevie'] ||= []).push(s.date);
        doc.sent.idleBy = doc.sent.idleBy || {};
        for (const [animal, dates] of Object.entries(byAnimal)) {
          const restDates = Object.entries(data.rest || {}).filter(([k, r]) => r.on && (animal === 'stevie' ? !k.includes(':') : k.startsWith(animal + ':'))).map(([k]) => k.split(':').pop());
          const lastAct = [...dates, ...restDates].sort().pop();
          if (!lastAct) continue;
          const days = Math.round((Date.parse(date) - Date.parse(lastAct)) / 864e5);
          if (days >= 3 && days <= 30 && doc.sent.idleBy[animal] !== lastAct) {
            const name = NAMES[animal] || animal;
            const n = await sendTo(code, doc, s => prefOf(data, s.who, 'idle'), { title: `🦙 ${name} wartet`, body: `Seit ${days} Tagen keine Session mit ${name}. Heute eine kurze, leichte Runde? Oder bewusst einen Ruhetag eintragen.`, tag: 'idle-' + animal, url: '/?s=' + code });
            doc.sent.idleBy[animal] = lastAct; changed = true; out.push({ code: code.slice(0, 6), idle: animal, n });
          }
        }
      }
      if (changed) await savePush(code, doc);
    }
    res.json({ ok: true, berlin: { date, mins }, out });
  } catch (e) { res.status(500).json({ error: String(e.message || e) }); }
}
