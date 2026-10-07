'use strict';
/* Stevie · Trainings-App — Daten lokal + Sync über textdb.online (gemeinsamer Stall-Code) */
const API = 'https://textdb.online';
const P = window.PLAN;
const LEGS = ['VL', 'VR', 'HL', 'HR'];
const LEGNAME = { VL: 'vorn links', VR: 'vorn rechts', HL: 'hinten links', HR: 'hinten rechts', gesamt: 'gesamt' };
const WHO = { F: 'Fabi', J: 'Judith' };
const ANIMAL = { stevie: 'Stevie', stupsi: 'Stupsi' };

// ---------- helpers ----------
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const dstr = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const today = () => dstr(new Date());
const nowTime = () => { const d = new Date(); return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
const D = s => new Date(s + 'T12:00:00');
const daysBetween = (a, b) => Math.round((D(b) - D(a)) / 864e5);
const addDays = (s, n) => { const d = D(s); d.setDate(d.getDate() + n); return dstr(d); };
const fmtShort = s => { const d = D(s); return d.getDate() + '.' + (d.getMonth() + 1) + '.'; };
const fmtLong = s => D(s).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' });
const weekStart = s => { const d = D(s); const wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd); return dstr(d); };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
const f1 = n => n.toFixed(1).replace('.', ',');
const lsGet = k => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch { } };
const lv = n => P.levels[n];
const ALP = '<svg viewBox="0 0 64 64" class="alp" aria-hidden="true"><use href="#alpaca"/></svg>';

// ---------- state ----------
const params = new URLSearchParams(location.search);
let code = (params.get('s') || lsGet('stevie.code') || '').trim();
if (code && !/^[a-z0-9]{10,40}$/i.test(code)) code = '';
let me = lsGet('stevie.me') || '';
let tab = lsGet('stevie.tab') || 'heute';
let sub = { protokoll: 'liste', wissen: null, wlevel: null, muster: 'stevie' };
let S = null;
let syncState = { busy: false, ok: null, last: 0, err: '' };
let lastRemoteStable = null;
let dirty = false;
let pushTimer = null;
let sheetOpen = false, pendingRender = false;
let timer = null;

function emptyData() {
  return { v: 1, sessions: {}, notes: {}, minis: {}, bowl: {}, letters: {}, week8: null, settings: { startDate: today(), stopWord: 'STOPP', updatedAt: 0 } };
}
function loadLocal() {
  try { const t = lsGet('stevie.data.' + code); if (t) return normalize(JSON.parse(t)); } catch { }
  return emptyData();
}
function normalize(d) {
  const e = emptyData();
  if (!d || typeof d !== 'object') return e;
  for (const k of ['sessions', 'notes', 'minis', 'bowl', 'letters']) e[k] = d[k] && typeof d[k] === 'object' ? d[k] : {};
  e.week8 = d.week8 || null;
  e.settings = Object.assign(e.settings, d.settings || {});
  return e;
}
function saveLocal() { lsSet('stevie.data.' + code, JSON.stringify(S)); }
function stable(o) {
  if (Array.isArray(o)) return '[' + o.map(stable).join(',') + ']';
  if (o && typeof o === 'object') return '{' + Object.keys(o).sort().map(k => JSON.stringify(k) + ':' + stable(o[k])).join(',') + '}';
  return JSON.stringify(o);
}
function merge(a, b) {
  a = normalize(a); b = normalize(b);
  const out = emptyData();
  for (const k of ['sessions', 'notes', 'minis', 'bowl', 'letters']) {
    out[k] = Object.assign({}, a[k]);
    for (const [id, v] of Object.entries(b[k])) {
      const cur = out[k][id];
      if (!cur || (v.updatedAt || 0) > (cur.updatedAt || 0)) out[k][id] = v;
    }
  }
  for (const k of ['week8', 'settings']) {
    const x = a[k], y = b[k];
    out[k] = !x ? y : !y ? x : ((y.updatedAt || 0) > (x.updatedAt || 0) ? y : x);
  }
  if (!out.settings) out.settings = emptyData().settings;
  return out;
}
function commit(msg) {
  saveLocal(); dirty = true; render();
  if (msg) toast(msg);
  clearTimeout(pushTimer); pushTimer = setTimeout(sync, 800);
}

// ---------- sync ----------
async function pull() {
  const r = await fetch(`${API}/${encodeURIComponent(code)}?t=${Date.now()}`, { cache: 'no-store' });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const t = (await r.text()).trim();
  if (!t) return null;
  try { return JSON.parse(t); } catch { return null; }
}
async function push(data) {
  const value = JSON.stringify(data);
  if (value.length > 195000) throw new Error('Speicher fast voll – bitte unter Einstellungen exportieren.');
  const body = new URLSearchParams({ key: code, value });
  const r = await fetch(`${API}/update`, { method: 'POST', body });
  const j = await r.json().catch(() => ({}));
  if (j.status !== 1) throw new Error(j.error || 'Speichern fehlgeschlagen');
}
async function sync() {
  if (!code || syncState.busy) return;
  if (!navigator.onLine) { syncState.ok = false; syncState.err = 'offline'; paintSync(); return; }
  syncState.busy = true; paintSync();
  try {
    const remote = await pull();
    const before = stable(S);
    if (remote) S = merge(S, remote);
    const after = stable(S);
    const remoteStable = remote ? stable(normalize(remote)) : null;
    saveLocal();
    if (!remote || after !== remoteStable) await push(S);
    dirty = false;
    syncState.ok = true; syncState.err = ''; syncState.last = Date.now();
    if (before !== after) safeRender();
  } catch (e) {
    syncState.ok = false; syncState.err = e.message || 'Fehler';
  } finally {
    syncState.busy = false; paintSync();
  }
}
function paintSync() {
  const b = $('#syncBtn'); if (!b) return;
  b.className = 'sync ' + (syncState.busy ? 'busy' : syncState.ok ? 'ok' : syncState.ok === false ? 'err' : '');
  $('#syncTxt').textContent = syncState.busy ? 'sync …' : syncState.ok ? 'synchron' : syncState.ok === false ? (dirty ? 'lokal gespeichert' : 'offline') : '…';
}
function safeRender() { if (sheetOpen) pendingRender = true; else render(); }

// ---------- analysis ----------
function sessionsOf(animal) {
  return Object.values(S.sessions).filter(s => !s.deleted && (!animal || s.animal === animal))
    .sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')) || (a.createdAt || 0) - (b.createdAt || 0));
}
const legsOf = s => s.level < 4 ? ['gesamt', ...((s.legs || []).filter(l => LEGS.includes(l)))] : (s.legs && s.legs.length ? s.legs : ['gesamt']);
function analyze(animal) {
  const tr = {};
  for (const s of sessionsOf(animal)) {
    for (const leg of legsOf(s)) {
      const t = tr[leg] || (tr[leg] = { n: 0, achieved: {}, last: null, streak: 0, levelSince: null, prevGood: null });
      if (!t.last || t.last.level !== s.level) { t.levelSince = s.date; t.streak = 0; t.prevGood = null; }
      if (s.baro <= 1) {
        t.streak++;
        if (t.streak >= 2 && !t.achieved[s.level]) t.achieved[s.level] = [t.prevGood, s.date];
        t.prevGood = s.date;
      } else { t.streak = 0; t.prevGood = null; }
      t.last = { level: s.level, baro: s.baro, date: s.date };
      t.n++;
    }
  }
  return tr;
}
function recFor(t) {
  if (!t || !t.last) return null;
  const x = t.last.level, b = t.last.baro;
  let r;
  if (b === 3) r = { kind: 'down', level: Math.max(0, x - 1), label: 'Ein Level tiefer', msg: 'Letztes Mal STOPP: Die nächste Session beginnt ein Level tiefer. Kein Rückschritt, sondern ein Fundament.' };
  else if (b === 2) r = { kind: 'repeat', level: x, label: 'Wiederholen', msg: 'Letztes Mal ACHTUNG: Level wiederholen und leichter einsteigen.' };
  else if (t.streak >= 2) r = x >= 9 ? { kind: 'up', level: 9, label: 'Geschafft', msg: 'Level 9 geschafft! Ab und zu eine Bein-Session ohne Schnitt einbauen.' } : { kind: 'up', level: x + 1, label: 'Weiter!', msg: '2 gute Sessions in Folge: weiter zum nächsten Level.' };
  else r = { kind: 'again', level: x, label: 'Noch 1 gute', msg: 'Gute Session! Noch eine gute auf diesem Level, dann geht’s weiter.' };
  if (r.kind !== 'up' && t.levelSince && daysBetween(t.levelSince, today()) > 7) r.stuck = true;
  return r;
}
function overview(animal) {
  const tr = analyze(animal);
  const g = tr.gesamt;
  const legPhase = (g && g.achieved[3] !== undefined) || LEGS.some(l => tr[l]);
  const res = { tr, legPhase, legs: {} };
  if (!legPhase) {
    res.main = g ? recFor(g) : { kind: 'start', level: animal === 'stupsi' ? null : 1, label: 'Start', msg: animal === 'stupsi' ? 'Startpunkt: zwei Level unter dem, was Stupsi heute schon entspannt mitmacht.' : 'Level 0 läuft ab heute im Alltag mit. Die erste Session ist Level 1: Kommen und Gehen.' };
  } else {
    for (const l of LEGS) res.legs[l] = tr[l] ? recFor(tr[l]) : { kind: 'start', level: 4, label: 'Start', msg: 'Noch nicht begonnen: Start bei Level 4.' };
    // Vorschlag: Vorderbeine zuerst, das niedrigste Level
    const order = ['VL', 'VR', 'HL', 'HR'];
    const front = order.slice(0, 2).map(l => [l, res.legs[l]]);
    front.sort((a, b) => a[1].level - b[1].level);
    res.focus = front[0][0];
  }
  return res;
}
function maxAchieved(tr) {
  let m = -1;
  for (const t of Object.values(tr)) for (const k of Object.keys(t.achieved)) m = Math.max(m, +k);
  return m;
}
function achievedAny(tr, level) { return Object.values(tr).some(t => t.achieved[level] !== undefined); }
function lettersUnlocked() {
  const tr = analyze('stevie'); const g = tr.gesamt;
  const u = {};
  if (g && g.achieved[1] !== undefined) u.l1 = true;
  if (g && g.achieved[3] !== undefined) u.l2 = true;
  if (LEGS.some(l => tr[l] && tr[l].achieved[5] !== undefined)) u.l3 = true;
  if (LEGS.some(l => tr[l] && tr[l].achieved[7] !== undefined)) u.l4 = true;
  if (LEGS.some(l => tr[l] && tr[l].achieved[9] !== undefined) || (S.letters.l5 && S.letters.l5.forced)) u.l5 = true;
  return u;
}
function achievementsSet(animal) {
  const tr = analyze(animal); const out = new Set();
  for (const [leg, t] of Object.entries(tr)) for (const k of Object.keys(t.achieved)) out.add(leg + ':' + k);
  return out;
}
function planWeek() {
  const sd = S.settings.startDate || today();
  return Math.max(1, Math.floor(daysBetween(sd, today()) / 7) + 1);
}
function roadmapFor(w) { return P.roadmap.find(r => w >= r.from && w <= r.to) || P.roadmap[P.roadmap.length - 1]; }

// ---------- rendering ----------
function render() {
  pendingRender = false;
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.arg === tab));
  if (!code) { $('#tabs').hidden = true; $('#view').innerHTML = viewOnboarding(); return; }
  $('#tabs').hidden = false;
  const v = { heute: viewHeute, protokoll: viewProtokoll, muster: viewMuster, erfolge: viewErfolge, wissen: viewWissen }[tab] || viewHeute;
  $('#view').innerHTML = v();
  paintSync();
}

function viewOnboarding() {
  return `<div class="onb">
    <svg class="big" viewBox="0 0 64 64"><use href="#alpaca"/></svg>
    <h1>Hallo!</h1>
    <p>Stevies Trainingsplan für Fabi und Judith: Sessions eintragen, sehen, wann es weitergeht, Muster erkennen und Erfolge sammeln.</p>
    <div class="card" style="text-align:left">
      <h3>Neu anfangen</h3>
      <p class="muted small">Legt einen gemeinsamen Stall an. Den Link schickst du danach an Judith, dann seht ihr beide dieselben Daten.</p>
      <button class="btn primary block" data-act="newStall">Stall anlegen</button>
    </div>
    <div class="card" style="text-align:left">
      <h3>Ich habe einen Stall-Code</h3>
      <input type="text" id="joinCode" placeholder="z. B. stevie…" autocapitalize="off" autocomplete="off" spellcheck="false">
      <div class="btns"><button class="btn" data-act="joinStall">Beitreten</button></div>
    </div>
  </div>`;
}

function weekStrip() {
  const ws = weekStart(today());
  const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const ss = sessionsOf('stevie');
  let html = '<div class="week">';
  for (let i = 0; i < 7; i++) {
    const d = addDays(ws, i);
    const s = ss.filter(x => x.date === d);
    const top = s.length ? Math.max(...s.map(x => x.baro)) : null;
    html += `<div class="${d === today() ? 'today' : ''}"><span class="${top !== null ? 'bg' + top : ''}">${s.length ? (s.length > 1 ? s.length + '×' : '✓') : ''}</span>${days[i]}</div>`;
  }
  return html + '</div>';
}

function viewHeute() {
  const ov = overview('stevie');
  const w = planWeek(); const rm = roadmapFor(w);
  const ss = sessionsOf('stevie');
  const thisWeek = ss.filter(s => weekStart(s.date) === weekStart(today())).length;
  const doneToday = ss.some(s => s.date === today());
  const last = ss[ss.length - 1];
  let hero = '';
  if (!ov.legPhase) {
    const r = ov.main; const L = r.level !== null ? lv(r.level) : null;
    hero = `<div class="card hero">${ALP}
      <div class="eyebrow">Nächste Session</div>
      <div class="lvno">Level ${L ? L.n : '–'}</div>
      <h2>${L ? esc(L.name) : 'Start festlegen'}</h2>
      <span class="badge ${r.kind}">${esc(r.label)}</span>
      <p>${esc(r.msg)}</p>
      ${L ? `<p class="small"><b>Ziel:</b> ${esc(L.goal)}</p>` : ''}
      ${r.stuck ? `<p class="small">💡 Seit über einer Woche auf diesem Level: nächsten Schritt halbieren – halb so tief, halb so lang, halb so nah.</p>` : ''}
      <div class="btns">${L ? `<button class="btn light" data-act="level" data-arg="${L.n}">Anleitung</button>` : ''}<button class="btn light" data-act="startTimer">Session starten</button></div>
    </div>`;
  } else {
    const fr = ov.legs[ov.focus]; const L = lv(fr.level);
    hero = `<div class="card hero">${ALP}
      <div class="eyebrow">Vorschlag für heute · ${LEGNAME[ov.focus]}</div>
      <div class="lvno">Level ${L.n}</div>
      <h2>${esc(L.name)}</h2>
      <span class="badge ${fr.kind}">${esc(fr.label)}</span>
      <p>${esc(fr.msg)}</p>
      ${fr.stuck ? `<p class="small">💡 Seit über einer Woche auf diesem Level: halb so tief, halb so lang, halb so nah.</p>` : ''}
      <div class="legs">${LEGS.map(l => { const r = ov.legs[l]; return `<button class="leg" data-act="level" data-arg="${r.level}"><small>${l} · ${LEGNAME[l]}</small><b>Level ${r.level}</b><small>${esc(r.label)}${r.stuck ? ' · 💡' : ''}</small></button>`; }).join('')}</div>
      <p class="small">Vorderbeine gehen voraus, Hinterbeine dürfen ein oder zwei Level hinterherlaufen.</p>
      <div class="btns"><button class="btn light" data-act="level" data-arg="${L.n}">Anleitung</button><button class="btn light" data-act="startTimer">Session starten</button></div>
    </div>`;
  }
  const bowlToday = S.bowl[today()] && S.bowl[today()].done;
  let bowlDots = ''; let streak = 0;
  for (let i = 13; i >= 0; i--) { const d = addDays(today(), -i); const on = S.bowl[d] && S.bowl[d].done; bowlDots += `<i class="${on ? 'on' : ''}"></i>`; }
  for (let i = 0; i < 400; i++) { const d = addDays(today(), -i); if (S.bowl[d] && S.bowl[d].done) streak++; else if (i > 0) break; }
  const wk = Math.min(12, w);
  let tl = ''; for (let i = 1; i <= 12; i++) tl += `<span class="${i < wk ? 'past' : i === wk ? 'now' : ''}">${i}</span>`;
  const week8Due = w >= 8 && !S.week8;
  const stupsiOn = sessionsOf('stupsi').length || achievedAny(analyze('stevie'), 6);
  let stupsi = '';
  if (stupsiOn) {
    const so = overview('stupsi');
    const r = so.legPhase ? so.legs[so.focus] : so.main;
    stupsi = `<div class="card"><div class="row between"><div><div class="eyebrow">Bonus · Stupsis Runde</div><h3>${r.level !== null ? 'Level ' + r.level + ' · ' + esc(lv(r.level).name) : 'Startpunkt festlegen'}</h3></div><span class="badge ${r.kind}">${esc(r.label)}</span></div><p class="small muted">${esc(r.msg)}</p><button class="btn sm" data-act="newSession" data-arg="stupsi">Stupsi-Session eintragen</button></div>`;
  }
  return `
    ${hero}
    <button class="btn primary block" data-act="newSession" style="min-height:54px;font-size:17px">＋ Session eintragen</button>
    ${doneToday ? `<p class="small muted center">Heute gab es schon eine Session. Höchstens eine pro Tag – morgen geht’s weiter.</p>` : ''}
    <div class="card">
      <div class="row between"><h3>Diese Woche</h3><span class="badge">${thisWeek} von 4–5</span></div>
      ${weekStrip()}
      <p class="small muted" style="margin:8px 0 0">${thisWeek >= 5 ? 'Wochenziel erreicht. Ruhetage sind auch Training.' : thisWeek >= 4 ? 'Wochenziel erreicht. Eine mehr geht, muss aber nicht.' : last ? 'Letzte Session: ' + fmtLong(last.date) + (daysBetween(last.date, today()) >= 3 ? ' – Zeit für eine kurze, leichte Runde.' : '') : 'Noch keine Session eingetragen.'}</p>
    </div>
    <div class="card">
      <div class="bowl">
        <button class="bowl-btn ${bowlToday ? 'on' : ''}" data-act="bowl" aria-label="Futterschale heute">${bowlToday ? '✓' : '🥣'}</button>
        <div class="grow"><h3 style="margin:0">Judiths Futterschale</h3><div class="small muted">${bowlToday ? 'Heute erledigt' + (S.bowl[today()].who ? ' von ' + WHO[S.bowl[today()].who] : '') + '. ' : 'Heute noch offen. '}${streak > 1 ? streak + ' Tage am Stück.' : ''}</div><div class="dots">${bowlDots}</div></div>
      </div>
    </div>
    ${stupsi}
    <div class="card">
      <div class="row between"><h3>Woche ${w > 12 ? '12+' : w} von 12</h3><button class="btn sm ghost" data-act="wissen" data-arg="fahrplan">Fahrplan</button></div>
      <div class="timeline">${tl}</div>
      <p class="small" style="margin:10px 0 0"><b>${esc(rm.phase)}</b> · Level ${esc(rm.lv)}<br><span class="muted">${esc(rm.side)} Die Wochen sind Richtwerte – das Tempo bestimmt Stevie.</span></p>
      ${week8Due ? `<button class="btn terra block" style="margin-top:12px" data-act="tab" data-arg="protokoll" data-sub="woche8">Woche-8-Check ausfüllen</button>` : ''}
    </div>
    <div class="stopword"><span>Stop-Wort</span><b>${esc(S.settings.stopWord || 'STOPP')}</b><span class="small" style="font-weight:600">Hände sofort weg.</span></div>
    <div class="golden">Wir hören so früh auf, dass Stevie nicht lernen muss, uns mit stärkerem Verhalten zum Aufhören zu bringen.</div>
  `;
}

// ----- Protokoll
function viewProtokoll() {
  const segs = [['liste', 'Protokoll'], ['karte', 'Levelkarte'], ['woche8', 'Woche-8-Check']];
  let body = '';
  if (sub.protokoll === 'karte') body = levelkarte();
  else if (sub.protokoll === 'woche8') body = week8View();
  else body = sessionList();
  return `<div class="seg">${segs.map(([k, l]) => `<button class="${sub.protokoll === k ? 'on' : ''}" data-act="sub" data-arg="${k}">${l}</button>`).join('')}</div>${body}`;
}
function sessionLine(s) {
  const L = lv(s.level);
  const legs = s.level >= 4 && s.legs && s.legs.length ? ' · ' + s.legs.join(' ') : '';
  return `<button class="entry" style="width:100%;text-align:left" data-act="editSession" data-arg="${s.id}">
    <div class="bdot bg${s.baro}">${s.baro}</div>
    <div class="grow"><div class="t">${s.animal === 'stupsi' ? 'Stupsi · ' : ''}Level ${s.level} · ${esc(L.name)}${legs}</div>
    <div class="meta">${fmtLong(s.date)}${s.time ? ' · ' + s.time : ''} · ${WHO[s.who] || '?'} · ${s.minutes} Min.</div>
    ${s.good ? `<p>👍 ${esc(s.good)}</p>` : ''}${s.next ? `<p class="muted">→ ${esc(s.next)}</p>` : ''}
    ${s.signals && s.signals.length ? `<div class="chipline">${s.signals.map(x => `<span>${esc(x)}</span>`).join('')}</div>` : ''}</div></button>`;
}
function sessionList() {
  const ss = sessionsOf().reverse();
  if (!ss.length) return `<div class="card empty"><svg viewBox="0 0 64 64"><use href="#alpaca"/></svg>Noch keine Session. Eine Zeile pro Session, Stichworte reichen.<div class="btns"><button class="btn primary" data-act="newSession">Erste Session eintragen</button></div></div>`;
  let html = '', curW = '';
  for (const s of ss) {
    const w = weekStart(s.date);
    if (w !== curW) { if (curW) html += '</div>'; curW = w; html += `<div class="eyebrow" style="margin-top:16px">Woche ab ${fmtShort(w)}</div><div class="card" style="padding:4px 14px;margin-top:6px">`; }
    html += sessionLine(s);
  }
  return html + '</div><p class="small muted center">Tippen zum Bearbeiten oder Löschen.</p>';
}
function levelkarte() {
  const tr = analyze('stevie');
  const cell = (leg, n) => {
    const t = tr[leg];
    if (t && t.achieved[n] !== undefined) { const [a, b] = t.achieved[n]; return `<span class="cell done">${fmtShort(a)}<br>${fmtShort(b)}</span>`; }
    if (t && t.last && t.last.level === n) return `<span class="cell wip">läuft</span>`;
    return `<span class="cell none">–</span>`;
  };
  let rows = '';
  for (const L of P.levels) {
    if (L.n < 4) rows += `<tr><td class="lvn">${L.n}</td><td style="text-align:left">${esc(L.name)}</td><td colspan="4">${cell('gesamt', L.n)} <span class="small muted">gesamt</span></td></tr>`;
    else rows += `<tr><td class="lvn">${L.n}</td><td style="text-align:left">${esc(L.name)}</td>${LEGS.map(l => `<td>${cell(l, L.n)}</td>`).join('')}</tr>`;
  }
  const trS = analyze('stupsi'); const ms = maxAchieved(trS);
  return `<div class="card" style="padding:12px">
    <p class="small muted" style="margin:0 0 6px">Geschafft nach 2 guten Sessions in Folge – die App trägt beide Daten automatisch ein. Ab Level 4 pro Bein.</p>
    <table class="lk"><tr><th>LV</th><th style="text-align:left">Name</th><th>VL</th><th>VR</th><th>HL</th><th>HR</th></tr>${rows}</table></div>
    <div class="card"><h3>Stupsis Runde</h3><div class="row wrap" style="gap:6px">${P.levels.map(L => `<span class="lvbubble ${L.n <= ms && Object.values(trS).some(t => t.achieved[L.n] !== undefined) ? 'done' : ''}">${L.n}</span>`).join('')}</div>
    <p class="small muted">${sessionsOf('stupsi').length ? 'Höchstes geschafftes Level: ' + (ms >= 0 ? ms : '–') : 'Startet, wenn Stevie Level 6 erreicht hat.'}</p></div>`;
}
function currentLegLevels() {
  const ov = overview('stevie');
  if (!ov.legPhase) return { front: '', hind: '' };
  const g = l => { const t = ov.tr[l]; return t ? (Object.keys(t.achieved).length ? Math.max(...Object.keys(t.achieved).map(Number)) : t.last.level) : '–'; };
  return { front: g('VL') + ' / ' + g('VR'), hind: g('HL') + ' / ' + g('HR') };
}
function week8View() {
  const w = S.week8 || {};
  const cl = currentLegLevels();
  const f = (k, label, ph) => `<div class="field"><label>${label}</label><textarea data-w8="${k}" placeholder="${ph || ''}">${esc(w[k] || '')}</textarea></div>`;
  const dec = [['A', 'Plan läuft weiter wie geplant.', 'Vorderbeine bei Level 6 oder weiter. Die Vorderfüße bis Woche 12 sind realistisch. Hinterbeine weiter im eigenen Tempo.'], ['B', 'Weiter trainieren, Nagelpflege mit Hilfe für Woche 12 planen.', 'Vorderbeine bei Level 4 oder 5. Pflege mit erfahrener Hilfe für alle Füße, die dann noch nicht bei Level 9 sind.'], ['C', 'Erfahrene Alpaka-Person für eine Trainingsbegleitung dazuholen.', 'Kaum Fortschritt oder häufig STOPP. Pflege mit Hilfe planen. Kein Scheitern: eine Kurskorrektur.']];
  return `<div class="card">
    <div class="eyebrow">Ehrlich hinschauen, gemeinsam entscheiden</div>
    <h3>Woche-8-Check</h3>
    <p class="small muted">In Woche 8 schaut ihr gemeinsam auf die Levelkarte und entscheidet nach einer von drei Linien. Das schützt das Training vor Zeitdruck in Woche 11.</p>
    <div class="field"><label>Datum</label><input type="date" data-w8="date" value="${esc(w.date || today())}"></div>
    <div class="row"><div class="field grow"><label>Level vorn L / R</label><input type="text" data-w8="front" value="${esc(w.front ?? cl.front)}"></div><div class="field grow"><label>Level hinten L / R</label><input type="text" data-w8="hind" value="${esc(w.hind ?? cl.hind)}"></div></div>
    ${f('easier', 'Was ist seit Woche 1 objektiv leichter geworden?')}
    ${f('signal', 'Welches Signal sehen wir jetzt früher?')}
    ${f('hard', 'Was war bisher zu schwer?')}
    ${f('us', 'Wie geht es uns beiden mit dem Training?')}
    <div class="flabel">Unsere Entscheidung</div>
    <div class="abc3">${dec.map(([k, t, d]) => `<button style="display:block;width:100%;text-align:left" class="${w.decision === k ? 'on' : ''}" data-act="w8dec" data-arg="${k}"><div style="${w.decision === k ? 'border-color:var(--accent);background:var(--accent-soft)' : ''}"><b>${k}</b>${w.decision === k ? '✓ ' : ''}<strong>${t}</strong><br><span class="muted">${d}</span></div></button>`).join('')}</div>
    ${f('steps', 'Nächste Schritte und Termine')}
    <button class="btn primary block" data-act="saveW8">Speichern</button>
    ${w.updatedAt ? `<p class="small muted center">Zuletzt gespeichert ${new Date(w.updatedAt).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })}</p>` : ''}
  </div>`;
}

// ----- Muster
function viewMuster() {
  const animal = sub.muster;
  const ss = sessionsOf(animal);
  const hasStupsi = sessionsOf('stupsi').length > 0;
  const seg = hasStupsi ? `<div class="seg"><button class="${animal === 'stevie' ? 'on' : ''}" data-act="musterAnimal" data-arg="stevie">Stevie</button><button class="${animal === 'stupsi' ? 'on' : ''}" data-act="musterAnimal" data-arg="stupsi">Stupsi</button></div>` : '';
  if (ss.length === 0) return seg + `<div class="card empty"><svg viewBox="0 0 64 64"><use href="#alpaca"/></svg>Hier erscheinen Verläufe und Muster, sobald ihr Sessions eintragt.</div>`;
  const last10 = ss.slice(-10);
  const calm = ss.filter(s => s.baro <= 1).length / ss.length;
  const tr = analyze(animal);
  const ups = Object.values(tr).reduce((n, t) => n + Object.keys(t.achieved).length, 0);
  const kpis = `<div class="kpis">
    <div class="kpi"><b>${ss.length}</b><span>Sessions gesamt</span></div>
    <div class="kpi"><b>${Math.round(calm * 100)}%</b><span>ruhig oder aufmerksam (0–1)</span></div>
    <div class="kpi"><b>${ups}</b><span>Level geschafft${Object.keys(tr).length > 1 ? ' (inkl. Beine)' : ''}</span></div></div>`;
  const dist = [0, 1, 2, 3].map(b => ss.filter(s => s.baro === b).length);
  const maxd = Math.max(...dist, 1);
  const bars = `<div class="bars">${dist.map((n, b) => `<div><span>${b} · ${P.baro[b].name}</span><em class="bg${b}" style="width:${Math.round(n / maxd * 100)}%"></em><b>${n}</b></div>`).join('')}</div>`;
  return seg + kpis + `
    <div class="card"><h3>Was die Daten sagen</h3>${insights(ss, animal).map(i => `<div class="ins"><i>${i.i}</i><div>${i.t}</div></div>`).join('')}</div>
    <div class="card"><h3>Barometer pro Session</h3><p class="small muted" style="margin:0">Höchste Stufe je Session, letzte ${Math.min(30, ss.length)}. Ziel: meistens unten im grünen Bereich.</p>${baroChart(ss.slice(-30))}</div>
    <div class="card"><h3>Level-Verlauf</h3>${levelChart(ss.slice(-30))}</div>
    <div class="card"><h3>Sessions pro Woche</h3><p class="small muted" style="margin:0">Ziel 4–5, höchstens eine am Tag.</p>${weekChart(ss)}</div>
    <div class="card"><h3>Verteilung</h3>${bars}<p class="small muted">Ø letzte 10 Sessions: <b>${f1(avg(last10.map(s => s.baro)))}</b></p></div>
    ${signalCard(ss)}`;
}
function signalCard(ss) {
  const c = {};
  for (const s of ss) for (const x of s.signals || []) c[x] = (c[x] || 0) + 1;
  const e = Object.entries(c).sort((a, b) => b[1] - a[1]);
  if (!e.length) return `<div class="card"><h3>Signale</h3><p class="small muted">Beim Eintragen könnt ihr unter „Mehr“ die gesehenen Signale antippen. Dann zeigt sich hier, was Stevie am häufigsten zeigt.</p></div>`;
  const m = e[0][1];
  return `<div class="card"><h3>Häufigste Signale</h3><div class="bars">${e.slice(0, 8).map(([k, n]) => `<div><span>${esc(k)}</span><em style="background:var(--terra);width:${Math.round(n / m * 100)}%"></em><b>${n}</b></div>`).join('')}</div></div>`;
}
function insights(ss, animal) {
  const out = [];
  const name = ANIMAL[animal];
  if (ss.length < 3) return [{ i: '🌱', t: 'Ab drei eingetragenen Sessions tauchen hier erste Muster auf.' }];
  const b = s => s.baro;
  if (ss.length >= 6) {
    const h = Math.floor(ss.length / 2);
    const a1 = avg(ss.slice(0, h).map(b)), a2 = avg(ss.slice(h).map(b));
    if (a2 < a1 - 0.2) out.push({ i: '📉', t: `<b>${name} wird ruhiger:</b> Das Barometer ist im Schnitt von ${f1(a1)} auf ${f1(a2)} gesunken.` });
    else if (a2 > a1 + 0.2) out.push({ i: '⚠️', t: `<b>Das Barometer steigt</b> (${f1(a1)} → ${f1(a2)}). Vielleicht geht es gerade etwas zu schnell – eine Stufe leichter tut gut.` });
    else out.push({ i: '〰️', t: `Das Barometer ist stabil um ${f1(a2)}. ${a2 <= 1 ? 'Genau so soll es sein.' : ''}` });
  }
  const F = ss.filter(s => s.who === 'F'), J = ss.filter(s => s.who === 'J');
  if (F.length >= 3 && J.length >= 3) {
    const af = avg(F.map(b)), aj = avg(J.map(b));
    const diff = Math.abs(af - aj);
    out.push({ i: '👥', t: `Bei Fabi Ø ${f1(af)}, bei Judith Ø ${f1(aj)} (Barometer).` + (diff >= 0.4 ? ` Zeigt ${name} bei einer Person früher ACHTUNG, braucht es dort keine „Konsequenz“, sondern eine leichtere gemeinsame Geschichte – also dort eine Stufe tiefer arbeiten.` : ' Er vertraut euch ähnlich – super für zwei Vertrauenspersonen.') });
  }
  const sh = ss.filter(s => s.minutes <= 3), lo = ss.filter(s => s.minutes >= 5);
  if (sh.length >= 3 && lo.length >= 3) {
    const a = avg(sh.map(b)), c = avg(lo.map(b));
    if (c > a + 0.3) out.push({ i: '⏱️', t: `Längere Sessions (5+ Min.) enden unruhiger (Ø ${f1(c)}) als kurze bis 3 Min. (Ø ${f1(a)}). <b>Kurz und oft</b> gewinnt.` });
    else if (a > c + 0.3) out.push({ i: '⏱️', t: `Interessant: Kurze Sessions enden hier unruhiger (Ø ${f1(a)}) als längere (Ø ${f1(c)}). Vielleicht fehlt bei kurzen das ruhige Ankommen?` });
    else out.push({ i: '⏱️', t: `Die Dauer macht bisher keinen großen Unterschied (kurz Ø ${f1(a)}, lang Ø ${f1(c)}).` });
  }
  const buckets = { morgens: [], mittags: [], nachmittags: [], abends: [] };
  for (const s of ss) { if (!s.time) continue; const h = +s.time.slice(0, 2); (h < 11 ? buckets.morgens : h < 15 ? buckets.mittags : h < 18 ? buckets.nachmittags : buckets.abends).push(s.baro); }
  const bk = Object.entries(buckets).filter(([, v]) => v.length >= 3).map(([k, v]) => [k, avg(v)]);
  if (bk.length >= 2) {
    bk.sort((x, y) => x[1] - y[1]);
    const [best, worst] = [bk[0], bk[bk.length - 1]];
    if (worst[1] - best[1] >= 0.4) out.push({ i: '🕰️', t: `Tageszeit: <b>${best[0]}</b> läuft es am ruhigsten (Ø ${f1(best[1])}), <b>${worst[0]}</b> am unruhigsten (Ø ${f1(worst[1])}).` });
  }
  const after1 = [], afterRest = [];
  for (let i = 1; i < ss.length; i++) { const g = daysBetween(ss[i - 1].date, ss[i].date); (g <= 1 ? after1 : afterRest).push(ss[i].baro); }
  if (after1.length >= 3 && afterRest.length >= 3) {
    const a = avg(after1), r = avg(afterRest);
    if (Math.abs(a - r) >= 0.3) out.push({ i: '🛌', t: a > r ? `Nach einem Ruhetag ist ${name} entspannter (Ø ${f1(r)}) als an Folgetagen (Ø ${f1(a)}). Ruhetage einplanen lohnt sich.` : `An Folgetagen läuft es sogar ruhiger (Ø ${f1(a)}) als nach Pausen (Ø ${f1(r)}). Regelmäßigkeit hilft ihm.` });
  }
  const recent = ss.filter(s => daysBetween(s.date, today()) <= 14);
  const st = recent.filter(s => s.baro === 3).length, ac = recent.filter(s => s.baro === 2).length;
  if (recent.length) out.push({ i: st ? '🛑' : ac ? '🟠' : '🟢', t: `Letzte 14 Tage: ${recent.length} Sessions, davon ${ac}× ACHTUNG und ${st}× STOPP.` + (st >= 2 ? ' Häufiges STOPP heißt: Aufgabe kleiner machen. Wird es über zwei bis drei Wochen eher schlechter, erfahrene Hilfe dazuholen.' : '') });
  const hum = ss.map(s => (s.signals || []).includes('Summen') ? 1 : 0);
  if (hum.length >= 8 && hum.some(Boolean)) {
    const h = Math.floor(hum.length / 2); const a = avg(hum.slice(0, h)), c = avg(hum.slice(h));
    if (c < a - 0.15) out.push({ i: '🎵', t: `Er summt seltener als am Anfang (${Math.round(a * 100)}% → ${Math.round(c * 100)}% der Sessions).` });
    else if (c > a + 0.15) out.push({ i: '🎵', t: `Er summt in letzter Zeit häufiger (${Math.round(a * 100)}% → ${Math.round(c * 100)}%). Summen heißt: Die Aufgabe ist im Moment zu groß.` });
  }
  const perDay = {};
  for (const s of ss) perDay[s.date] = (perDay[s.date] || 0) + 1;
  const dbl = Object.values(perDay).filter(n => n > 1).length;
  if (dbl) out.push({ i: '📅', t: `An ${dbl} Tag${dbl > 1 ? 'en' : ''} gab es mehr als eine Session. Regel: höchstens eine am Tag.` });
  return out.length ? out : [{ i: '🌱', t: 'Noch zu wenige Daten für klare Muster. Weiter eintragen!' }];
}
function baroChart(ss) {
  const W = 340, H = 150, pl = 22, pr = 8, pt = 8, pb = 22;
  const iw = W - pl - pr, ih = H - pt - pb;
  const x = i => pl + (ss.length === 1 ? iw / 2 : i * iw / (ss.length - 1));
  const y = b => pt + ih - b * ih / 3;
  let g = '';
  const cols = ['var(--b0s)', 'var(--b1s)', 'var(--b2s)', 'var(--b3s)'];
  for (let b = 0; b < 4; b++) { const y0 = y(b) - ih / 6, hh = ih / 3; g += `<rect x="${pl}" y="${Math.max(pt, y0)}" width="${iw}" height="${Math.min(hh, pt + ih - Math.max(pt, y0)) + (b === 3 ? 0 : 0)}" fill="${cols[b]}" opacity=".7"/>`; g += `<text x="4" y="${y(b) + 3}">${b}</text>`; }
  const pts = ss.map((s, i) => `${x(i)},${y(s.baro)}`).join(' ');
  g += `<polyline points="${pts}" fill="none" stroke="var(--muted)" stroke-width="1.2" stroke-linejoin="round" opacity=".6"/>`;
  ss.forEach((s, i) => { g += `<circle cx="${x(i)}" cy="${y(s.baro)}" r="4.2" fill="var(--b${s.baro})" stroke="var(--card)" stroke-width="1.5"/>`; });
  g += `<text x="${pl}" y="${H - 6}">${fmtShort(ss[0].date)}</text><text x="${W - pr}" y="${H - 6}" text-anchor="end">${fmtShort(ss[ss.length - 1].date)}</text>`;
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Barometer-Verlauf">${g}</svg>`;
}
function levelChart(ss) {
  const W = 340, H = 140, pl = 22, pr = 8, pt = 8, pb = 22;
  const iw = W - pl - pr, ih = H - pt - pb;
  const x = i => pl + (ss.length === 1 ? iw / 2 : i * iw / (ss.length - 1));
  const y = l => pt + ih - l * ih / 9;
  let g = '';
  for (const l of [0, 3, 6, 9]) g += `<line x1="${pl}" x2="${W - pr}" y1="${y(l)}" y2="${y(l)}" stroke="var(--line)"/><text x="4" y="${y(l) + 3}">${l}</text>`;
  let d = '';
  ss.forEach((s, i) => { d += (i ? `L${x(i)},${y(ss[i - 1].level)} L${x(i)},${y(s.level)}` : `M${x(i)},${y(s.level)}`); });
  g += `<path d="${d}" fill="none" stroke="var(--accent)" stroke-width="2.4" stroke-linejoin="round"/>`;
  ss.forEach((s, i) => { g += `<circle cx="${x(i)}" cy="${y(s.level)}" r="3.4" fill="var(--b${s.baro})"/>`; });
  g += `<text x="${pl}" y="${H - 6}">${fmtShort(ss[0].date)}</text><text x="${W - pr}" y="${H - 6}" text-anchor="end">${fmtShort(ss[ss.length - 1].date)}</text>`;
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Level-Verlauf">${g}</svg>`;
}
function weekChart(ss) {
  const ws = weekStart(today());
  const weeks = []; for (let i = 7; i >= 0; i--) weeks.push(addDays(ws, -7 * i));
  const counts = weeks.map(w => ss.filter(s => weekStart(s.date) === w).length);
  const W = 340, H = 126, pl = 18, pb = 20, pt = 16, ih = H - pt - pb, iw = W - pl - 4;
  const mx = Math.max(6, ...counts);
  const y = n => pt + ih - n * ih / mx;
  let g = `<rect x="${pl}" y="${y(5)}" width="${iw}" height="${y(4) - y(5)}" fill="var(--b0s)"/><text x="2" y="${y(4.5) + 3}">4–5</text>`;
  const bw = iw / 8;
  counts.forEach((n, i) => { g += `<rect x="${pl + i * bw + 6}" y="${y(n)}" width="${bw - 12}" height="${pt + ih - y(n)}" rx="4" fill="${i === 7 ? 'var(--terra)' : 'var(--accent)'}"/><text x="${pl + i * bw + bw / 2}" y="${H - 6}" text-anchor="middle">${fmtShort(weeks[i])}</text>${n ? `<text x="${pl + i * bw + bw / 2}" y="${y(n) - 3}" text-anchor="middle">${n}</text>` : ''}`; });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Sessions pro Woche">${g}</svg>`;
}

// ----- Erfolge
function viewErfolge() {
  const un = lettersUnlocked();
  const letters = P.letters.map(L => {
    const open = un[L.id]; const read = S.letters[L.id] && S.letters[L.id].read;
    return `<button class="letter ${open ? '' : 'locked'} ${open && !read ? 'new' : ''}" data-act="${open ? 'letter' : 'letterLocked'}" data-arg="${L.id}">
      <span class="env">${open ? '✉️' : '🔒'}</span><span class="grow"><b>${esc(L.title)}</b><br><span class="small muted">${open ? (read ? 'Gelesen' : 'Neu! Jetzt lesen') : 'Erst lesen, wenn ' + esc(L.unlock)}</span></span></button>`;
  }).join('');
  const notes = Object.values(S.notes).filter(n => !n.deleted).sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.createdAt - a.createdAt);
  const tr = analyze('stevie');
  const levelDone = n => n < 4 ? (tr.gesamt && tr.gesamt.achieved[n] !== undefined) : LEGS.some(l => tr[l] && tr[l].achieved[n] !== undefined);
  const minis = P.levels.map(L => {
    const done = L.minis.filter((_, i) => S.minis[L.n + '-' + i] && S.minis[L.n + '-' + i].done).length;
    return `<details class="acc"><summary><span class="lvbubble ${levelDone(L.n) ? 'done' : ''}">${L.n}</span><b>${esc(L.name)}</b><span class="cnt">${done}/${L.minis.length}</span></summary>
      ${L.minis.map((m, i) => { const k = L.n + '-' + i; const o = S.minis[k] && S.minis[k].done; return `<button class="mini ${o ? 'on' : ''}" data-act="mini" data-arg="${k}"><span class="box">${o ? '✓' : ''}</span><span>${esc(m)}${o ? `<small>${fmtShort(S.minis[k].date)}${S.minis[k].who ? ' · ' + WHO[S.minis[k].who] : ''}</small>` : ''}</span></button>`; }).join('')}
    </details>`;
  }).join('');
  return `
    <div class="card"><h3>Post von Stevie</h3><p class="small muted" style="margin:0">Briefe schalten sich frei, sobald ihr das jeweilige Level geschafft habt.</p>${letters}</div>
    <div class="card"><div class="row between"><h3>Erfolge & Erkenntnisse</h3><button class="btn sm primary" data-act="newNote">＋ Neu</button></div>
      ${notes.length ? notes.map(n => `<button class="note" style="display:block;width:100%;text-align:left" data-act="editNote" data-arg="${n.id}"><div class="kind ${n.type}">${n.type === 'erfolg' ? '★ Erfolg' : '💡 Erkenntnis'}</div><p>${esc(n.text)}</p><div class="small muted">${fmtLong(n.date)} · ${WHO[n.who] || ''}</div></button>`).join('') : '<p class="small muted">Haltet hier fest, was euch auffällt und was gelungen ist – „Er hat heute zum ersten Mal wiedergekäut“, „Summen kommt immer, wenn …“.</p>'}
    </div>
    <div class="card"><h3>Mini-Erfolge</h3><p class="small muted" style="margin:0 0 6px">Jeder Haken zählt.</p>${minis}</div>`;
}

// ----- Wissen
function baroHTML() {
  return P.baro.map(b => `<div class="barotab" style="background:var(--b${b.n}s)"><h4><span class="bdot bg${b.n}" style="width:30px;height:30px;font-size:15px">${b.n}</span>${b.name}</h4><ul>${b.signs.map(s => `<li>${esc(s)}</li>`).join('')}</ul><p>→ ${esc(b.todo)}</p></div>`).join('') +
    `<div class="callout red"><b>Zwei Signale, die man leicht übersieht</b><br>Summen ist bei Alpakas eines der wichtigsten leisen Zeichen für Unbehagen. Summt Stevie, ist die Aufgabe im Moment zu groß. Einfrieren ist kein Bravsein: Ein Alpaka, das plötzlich ganz still wird, kann stark gestresst sein. Achtet auf die Körperspannung, nicht nur auf Bewegung.</div>
    <h4>Stevie macht X, ihr macht Y</h4><div class="xy">${P.xy.map(([a, b]) => `<div>${esc(a)}</div><div>${esc(b)}</div>`).join('')}</div>
    <div class="stevie-says"><b>Stevie meint</b>Ich sag euch ja Bescheid. Meistens schon ziemlich früh. Man muss nur hinschauen.</div>`;
}
function roadmapHTML() {
  return `<table class="rtbl"><tr><th>Woche</th><th>Phase</th><th>Level</th></tr>${P.roadmap.map(r => `<tr><td><b>${r.w}</b></td><td>${esc(r.phase)}<br><span class="small muted">${esc(r.side)}</span></td><td>${esc(r.lv)}</td></tr>`).join('')}</table>
  <p class="small muted">Level 0 (Alltag) und Judiths Futterschale laufen die ganze Zeit mit. Die Wochen sind Richtwerte. Manche Level dauern drei Tage, manche zwei Wochen. Beides ist normal. Ein Level, das länger dauert, ist kein Rückstand, sondern ein Fundament.</p>
  <h4>Der Woche-8-Check: ehrlich entscheiden</h4>
  <div class="abc3"><div><b>A</b><strong>Vorderbeine bei Level 6 oder weiter.</strong> Plan läuft. Die Vorderfüße bis Woche 12 sind realistisch. Hinterbeine weiter im eigenen Tempo.</div><div><b>B</b><strong>Vorderbeine bei Level 4 oder 5.</strong> Weiter trainieren. Für etwa Woche 12 eine Nagelpflege mit erfahrener Hilfe einplanen, für alle Füße, die dann noch nicht bei Level 9 sind.</div><div><b>C</b><strong>Kaum Fortschritt oder häufig STOPP.</strong> Eine erfahrene Alpaka-Person für eine Trainingsbegleitung dazuholen und die Nagelpflege mit Hilfe planen. Kein Scheitern: eine Kurskorrektur.</div></div>
  <button class="btn block" data-act="tab" data-arg="protokoll" data-sub="woche8">Zum Woche-8-Check</button>`;
}
function ratchetSVG() {
  return `<svg class="chart" viewBox="0 0 340 120" aria-label="Ratchet-Signal"><g fill="none" stroke="var(--terra)" stroke-width="2.5" stroke-linejoin="round"><path d="M20 100 L40 100 L40 84 L66 84 L66 90 L74 90 L74 68 L100 68 L100 74 L108 74 L108 50 L134 50 L134 56 L142 56 L142 30 L170 30"/></g><text x="40" y="78">+1</text><text x="74" y="62">+2</text><text x="108" y="44">+3</text><text x="142" y="24">+4</text><path d="M178 30 q20 0 26 30 t26 40" fill="none" stroke="var(--b0)" stroke-width="2.5" stroke-dasharray="4 4"/><text x="210" y="28" style="font-weight:700;fill:var(--b0)">Fuß hebt ab →</text><text x="236" y="104" style="font-weight:700;fill:var(--b0)">sofort zurück!</text><line x1="20" y1="112" x2="320" y2="112" stroke="var(--line)"/><text x="20" y="10">Druck</text></svg><p class="small muted center" style="margin:0">kleiner Impuls · kurz minimal nachlassen · nächster Impuls etwas mehr (etwa 1 Sekunde pro Stufe)</p>`;
}
function stallkarteHTML() {
  return `<div class="barogrid" style="margin:6px 0 14px">${P.baro.map(b => `<div class="baro b${b.n}"><b>${b.n}</b>${b.name}<span style="font-weight:600;font-size:10.5px;text-align:center">${b.short}</span></div>`).join('')}</div>
  <h4>Vor der Session</h4><ul class="checks">${P.precheck.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
  <h4>Während der Session</h4><div class="xy">${[['Er summt', 'leichter'], ['Er geht weg', 'nicht folgen'], ['Er schaut zur Treppe', 'leichter werden'], ['Er ist hinter der Treppe', 'Session endet'], ['Fuß geht von selbst hoch', 'nicht greifen'], ['Fuß wird zurückgefordert', 'sofort zurückgeben'], ['Er lehnt sich an', 'Fuß zurück, mit der Hüfte sanft wegschieben'], ['Kraft gegen Kraft', 'Aufgabe ist zu schwer'], ['Er kusht', 'nicht am Boden weitermachen']].map(([a, b]) => `<div>${a}</div><div>→ ${b}</div>`).join('')}</div>
  <h4>Nach der Session</h4><ul class="checks">${P.postcheck.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
  <div class="stopword" style="margin-top:14px"><span>Stop-Wort</span><b>${esc(S.settings.stopWord || 'STOPP')}</b><span class="small" style="font-weight:600">Hände sofort weg. Besprochen wird hinterher.</span></div>
  <div class="golden">Wir hören so früh auf, dass Stevie nicht lernen muss, uns mit stärkerem Verhalten zum Aufhören zu bringen.</div>`;
}
function levelDetail(n) {
  const L = lv(n);
  return `<div class="lvcard">
    <div class="eyebrow">Level ${L.n} · ${esc(L.meta)}</div>
    <h2>${esc(L.name)}</h2>
    <p class="goal">${esc(L.goal)}</p>
    <div class="think">„${esc(L.think)}“ <span class="small muted" style="font-style:normal">– Stevie denkt</span></div>
    <h4>So geht’s</h4><ol class="steps">${L.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    <h4>Weiter, wenn …</h4><ul class="checks done">${L.next.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
    <h4>Wenn es hakt</h4><div class="hakt">${L.hakt.map(([a, b]) => `<div><b>${esc(a)}</b><span>→ ${esc(b)}</span></div>`).join('')}</div>
    <h4>Mini-Erfolge</h4>${L.minis.map((m, i) => { const k = L.n + '-' + i; const o = S.minis[k] && S.minis[k].done; return `<button class="mini ${o ? 'on' : ''}" data-act="mini" data-arg="${k}"><span class="box">${o ? '✓' : ''}</span><span>${esc(m)}${o ? `<small>${fmtShort(S.minis[k].date)}</small>` : ''}</span></button>`; }).join('')}
    ${L.box ? `<div class="callout"><b>${esc(L.box[0])}</b><br>${esc(L.box[1])}</div>` : ''}
    <div class="btns"><button class="btn" ${L.n === 0 ? 'disabled style="opacity:.4"' : ''} data-act="level" data-arg="${L.n - 1}">← Level ${Math.max(0, L.n - 1)}</button><button class="btn" ${L.n === 9 ? 'disabled style="opacity:.4"' : ''} data-act="level" data-arg="${L.n + 1}">Level ${Math.min(9, L.n + 1)} →</button></div>
  </div>`;
}
function viewWissen() {
  if (sub.wlevel !== null && sub.wlevel !== undefined) {
    return `<button class="back" data-act="wback">‹ Zurück</button><div class="doc card">${levelDetail(sub.wlevel)}</div>`;
  }
  if (sub.wissen) {
    const c = window.WISSEN.find(x => x.id === sub.wissen);
    let html = c.html
      .replace('{{STOP}}', esc(S.settings.stopWord || 'STOPP'))
      .replace('{{BARO}}', baroHTML())
      .replace('{{PRE}}', P.precheck.map(x => `<li>${esc(x)}</li>`).join(''))
      .replace('{{POST}}', P.postcheck.map(x => `<li>${esc(x)}</li>`).join(''))
      .replace('{{GOOD}}', P.goodday.map(x => `<li>${esc(x)}</li>`).join(''))
      .replace('{{ROADMAP}}', roadmapHTML())
      .replace('{{RATCHET}}', ratchetSVG())
      .replace('{{STALLKARTE}}', stallkarteHTML())
      .replace('{{LEVELS}}', `<p>Jedes Level hat ein Ziel, eine Anleitung, ein Weiter-Kriterium und eine Notbremse. Ab Level 5 zählt jedes Bein einzeln. Die Vorderbeine gehen voraus, die Hinterbeine dürfen ein oder zwei Level hinterherlaufen.</p><div class="zones" style="margin:8px 0 12px"><span>1 Schulter</span><span>2 Widerrist und Rücken</span><span>3 Brust und Flanke</span><span>4 oberes Bein</span><span>5 unteres Bein bis Fessel</span></div><div class="lvlist">${P.levels.map(L => `<button data-act="level" data-arg="${L.n}"><span class="wno">${L.n}</span><span><b>${esc(L.name)}</b><small class="muted">${esc(L.meta)}</small></span><span class="chev">›</span></button>`).join('')}</div>`);
    return `<button class="back" data-act="wback">‹ Alle Kapitel</button><div class="doc card"><div class="eyebrow">${esc(c.sub)}</div><h2>${esc(c.title)}</h2>${html}</div>`;
  }
  return `<div class="card" style="padding:6px 16px"><div class="wlist">${window.WISSEN.map(c => `<button data-act="wissen" data-arg="${c.id}"><span class="wno">${c.no}</span><span><b>${esc(c.title)}</b><small>${esc(c.sub)}</small></span><span class="chev">›</span></button>`).join('')}</div></div>
  <div class="stevie-says"><b>Stevie meint</b>Ihr müsst nicht alles auf einmal lesen. Für den Alltag reichen Kapitel 1, Kapitel 2 und die Seite zu dem Level, an dem ihr gerade arbeitet.</div>`;
}

// ---------- sheets ----------
function openSheet(html) {
  sheetOpen = true;
  $('#sheet').innerHTML = '<div class="grab"></div>' + html;
  $('#sheetWrap').hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeSheet() {
  sheetOpen = false;
  $('#sheetWrap').hidden = true;
  document.body.style.overflow = '';
  if (timer) { clearInterval(timer.iv); timer = null; }
  if (pendingRender) render();
}
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toast.tm); toast.tm = setTimeout(() => t.hidden = true, 2600);
}

// Session-Formular
let F = null;
function defaultForm(animal = 'stevie', minutes) {
  const ov = overview(animal);
  let level = 1, legs = [];
  if (!ov.legPhase) level = ov.main.level ?? (animal === 'stupsi' ? 2 : 1);
  else { level = ov.legs[ov.focus].level; legs = [ov.focus]; }
  return { id: null, date: today(), time: nowTime(), who: me || 'F', animal, level, legs, minutes: minutes || 4, baro: null, signals: [], good: '', next: '', erfolg: false };
}
function sessionForm() {
  const f = F;
  const L = lv(f.level);
  return `<h2>${f.id ? 'Session bearbeiten' : 'Session eintragen'}</h2>
  <p class="small muted" style="margin:0">Eine Zeile pro Session. Stichworte reichen.</p>
  <div class="row" style="margin-top:12px"><div class="grow"><label class="flabel">Datum</label><input type="date" data-f="date" value="${f.date}"></div><div style="width:120px"><label class="flabel">Uhrzeit</label><input type="time" data-f="time" value="${f.time || ''}"></div></div>
  <div class="row" style="margin-top:14px;align-items:flex-start"><div class="grow"><div class="flabel">Wer?</div><div class="chips">${['F', 'J'].map(w => `<button class="chip ${f.who === w ? 'on' : ''}" data-act="f" data-k="who" data-arg="${w}">${WHO[w]}</button>`).join('')}</div></div>
  <div><div class="flabel">Tier</div><div class="chips">${['stevie', 'stupsi'].map(a => `<button class="chip ${f.animal === a ? 'on' : ''}" data-act="f" data-k="animal" data-arg="${a}">${ANIMAL[a]}</button>`).join('')}</div></div></div>
  <div class="field"><div class="flabel">Level</div><div class="lvgrid">${P.levels.map(x => `<button class="chip ${f.level === x.n ? 'on' : ''}" data-act="f" data-k="level" data-arg="${x.n}">${x.n}</button>`).join('')}</div><div class="lvname"><b>${esc(L.name)}</b> · ${esc(L.goal)}</div></div>
  ${f.level >= 4 || overview(f.animal).legPhase ? `<div class="field"><div class="flabel">Heute geübt <small>(Bein, mehrere möglich${f.level < 4 ? ', optional' : ''})</small></div><div class="chips">${LEGS.map(l => `<button class="chip ${f.legs.includes(l) ? 'on' : ''}" data-act="fleg" data-arg="${l}">${l}</button>`).join('')}</div></div>` : ''}
  <div class="field"><div class="flabel">Minuten</div><div class="stepper"><button data-act="fmin" data-arg="-1">−</button><b>${f.minutes} Min.</b><button data-act="fmin" data-arg="1">＋</button></div></div>
  <div class="field"><div class="flabel">Barometer <small>– höchste erreichte Stufe</small></div><div class="barogrid">${P.baro.map(b => `<button class="baro b${b.n} ${f.baro === b.n ? 'on' : ''}" data-act="f" data-k="baro" data-arg="${b.n}"><b>${b.n}</b>${b.name}</button>`).join('')}</div>${f.baro !== null ? `<div class="barohint">→ ${esc(P.baro[f.baro].todo)}</div>` : ''}</div>
  <div class="field"><label>Was lief gut?</label><textarea data-f="good" placeholder="z. B. Hand lag 3 Sek. auf der Topline">${esc(f.good)}</textarea></div>
  <div class="field"><label>Nächstes Mal</label><textarea data-f="next" placeholder="z. B. mit Schulter-Kreisen beginnen">${esc(f.next)}</textarea></div>
  <details class="more" ${f.signals.length ? 'open' : ''}><summary>Mehr: gesehene Signale</summary><div class="chips">${P.signals.map(s => `<button class="chip ${f.signals.includes(s) ? 'on' : ''}" data-act="fsig" data-arg="${esc(s)}" style="min-height:36px;font-size:14px">${esc(s)}</button>`).join('')}</div></details>
  ${!f.id ? `<label class="toggle"><input type="checkbox" data-fc="erfolg" ${f.erfolg ? 'checked' : ''}> „Was lief gut“ auch als Erfolg festhalten</label>` : ''}
  ${f.fromTimer ? `<div class="callout green" style="margin-top:14px"><b>Nachher-Check</b><ul>${P.postcheck.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
  <div class="btns">${f.id ? '<button class="btn" data-act="delSession">Löschen</button>' : '<button class="btn" data-act="closeSheet">Abbrechen</button>'}<button class="btn primary" data-act="saveSession">Speichern</button></div>`;
}
function openSessionForm(animal, minutes, fromTimer) {
  F = defaultForm(animal, minutes); F.fromTimer = !!fromTimer;
  openSheet(sessionForm());
}
function rerenderForm() { const sc = $('#sheet').scrollTop; $('#sheet').innerHTML = '<div class="grab"></div>' + sessionForm(); $('#sheet').scrollTop = sc; }
function saveSession() {
  if (F.baro === null) { toast('Bitte noch das Barometer antippen.'); return; }
  if (F.level >= 4 && !F.legs.length) { toast('Bitte mindestens ein Bein auswählen.'); return; }
  const isNew = !F.id;
  const beforeAch = achievementsSet(F.animal);
  const beforeLetters = lettersUnlocked();
  const id = F.id || uid();
  const prev = S.sessions[id] || {};
  S.sessions[id] = { id, date: F.date || today(), time: F.time || '', who: F.who, animal: F.animal, level: F.level, legs: F.legs.slice(), minutes: F.minutes, baro: F.baro, signals: F.signals.slice(), good: F.good.trim(), next: F.next.trim(), createdAt: prev.createdAt || Date.now(), updatedAt: Date.now() };
  if (isNew && F.erfolg && F.good.trim()) {
    const nid = uid(); S.notes[nid] = { id: nid, type: 'erfolg', text: F.good.trim(), date: F.date, who: F.who, createdAt: Date.now(), updatedAt: Date.now() };
  }
  const afterAch = achievementsSet(F.animal);
  const newAch = [...afterAch].filter(x => !beforeAch.has(x));
  const afterLetters = lettersUnlocked();
  const newLetters = Object.keys(afterLetters).filter(k => !beforeLetters[k]);
  closeSheet();
  commit(isNew ? 'Gespeichert ✓' : 'Geändert ✓');
  if (newAch.length) celebrate(F.animal, newAch, newLetters);
  else if (isNew) {
    const ov = overview(F.animal);
    const r = ov.legPhase ? ov.legs[(F.legs[0]) || ov.focus] : ov.main;
    if (r && r.kind !== 'start') toast(r.label + ': ' + (r.level !== null ? 'nächstes Mal Level ' + r.level : ''));
  }
}
function celebrate(animal, ach, newLetters) {
  const items = ach.map(x => { const [leg, n] = x.split(':'); return `Level ${n} · ${esc(lv(+n).name)}${leg !== 'gesamt' ? ' (' + leg + ')' : ''}`; });
  const top = Math.max(...ach.map(x => +x.split(':')[1]));
  openSheet(`<div class="celebrate"><div class="em">🎉🦙</div><h2>${ANIMAL[animal]} hat es geschafft!</h2><p>${items.join('<br>')}</p><p class="muted small">2 gute Sessions in Folge. Nächstes Mal geht es mit ${top >= 9 ? 'dem nächsten Fuß' : 'Level ' + (top + 1) + ' · ' + esc(lv(top + 1).name)} weiter.</p>
    ${newLetters.length ? `<div class="callout" style="text-align:left"><b>✉️ Post von Stevie ist da!</b><br>Ein neuer Brief wartet unter „Erfolge“.</div><div class="btns"><button class="btn" data-act="closeSheet">Später</button><button class="btn terra" data-act="letter" data-arg="${newLetters[0]}">Brief lesen</button></div>` : `<div class="btns"><button class="btn primary" data-act="closeSheet">Super</button></div>`}</div>`);
}

// Timer
function startTimerSheet() {
  const ov = overview('stevie');
  const L = lv(ov.legPhase ? ov.legs[ov.focus].level : (ov.main.level ?? 1));
  openSheet(`<h2>Vorher: 30-Sekunden-Check</h2><p class="small muted" style="margin:0">Heute dran: <b>Level ${L.n} · ${esc(L.name)}</b>${ov.legPhase ? ' (' + ov.focus + ')' : ''}</p>
    <ul class="checks pre" id="pre">${P.precheck.map((x, i) => `<li data-act="pre" data-arg="${i}">${esc(x)}</li>`).join('')}</ul>
    <div class="stopword"><span>Stop-Wort</span><b>${esc(S.settings.stopWord || 'STOPP')}</b></div>
    <div class="btns"><button class="btn" data-act="closeSheet">Abbrechen</button><button class="btn primary" data-act="goTimer">Los geht’s</button></div>`);
}
function runTimer() {
  const ov = overview('stevie');
  const L = lv(ov.legPhase ? ov.legs[ov.focus].level : (ov.main.level ?? 1));
  timer = { start: Date.now(), L };
  const ph = P.phases;
  openSheet(`<div class="timer"><div class="eyebrow">Level ${L.n} · ${esc(L.name)}</div><div class="clock" id="tClock">0:00</div><div class="ph" id="tPh"></div><div class="phh" id="tPhh"></div>
    <div class="phbar" id="tBar">${ph.slice(0, 5).map((p, i) => `<span style="flex:${ph[i + 1].t - p.t}"></span>`).join('')}</div>
    <div class="row between small muted"><span>0:00</span><span>5:00</span></div></div>
    <div class="callout"><b>Das Neue heute:</b> ${esc(L.goal)}</div>
    <div class="stopword"><span>Stop-Wort</span><b>${esc(S.settings.stopWord || 'STOPP')}</b><span class="small" style="font-weight:600">Lieber früher aufhören.</span></div>
    <div class="btns"><button class="btn" data-act="closeSheet">Abbrechen</button><button class="btn primary" data-act="stopTimer">Session beenden</button></div>`);
  sheetOpen = true;
  const tick = () => {
    if (!timer) return;
    const s = Math.floor((Date.now() - timer.start) / 1000);
    $('#tClock') && ($('#tClock').textContent = Math.floor(s / 60) + ':' + pad(s % 60));
    let idx = 0; for (let i = 0; i < ph.length; i++) if (s >= ph[i].t) idx = i;
    const p = ph[idx];
    if ($('#tPh')) { $('#tPh').textContent = p.name; $('#tPhh').textContent = p.hint; }
    document.querySelectorAll('#tBar span').forEach((el, i) => el.className = i < idx ? 'past' : i === idx ? 'now' : '');
    if (idx !== timer.lastIdx) { timer.lastIdx = idx; if (idx > 0 && navigator.vibrate) navigator.vibrate(idx === 5 ? [200, 100, 200] : 120); }
  };
  tick(); timer.iv = setInterval(tick, 500);
}

// Notizen
let N = null;
function noteForm() {
  return `<h2>${N.id ? 'Eintrag bearbeiten' : 'Neuer Eintrag'}</h2>
  <div class="field"><div class="chips"><button class="chip ${N.type === 'erfolg' ? 'on' : ''}" data-act="n" data-k="type" data-arg="erfolg">★ Erfolg</button><button class="chip ${N.type === 'erkenntnis' ? 'on' : ''}" data-act="n" data-k="type" data-arg="erkenntnis">💡 Erkenntnis</button></div></div>
  <div class="field"><textarea data-n="text" style="min-height:110px" placeholder="${N.type === 'erfolg' ? 'Was ist gelungen?' : 'Was habt ihr gemerkt oder verstanden?'}">${esc(N.text)}</textarea></div>
  <div class="row"><div class="grow"><label class="flabel">Datum</label><input type="date" data-n="date" value="${N.date}"></div><div><div class="flabel">Wer?</div><div class="chips">${['F', 'J'].map(w => `<button class="chip ${N.who === w ? 'on' : ''}" data-act="n" data-k="who" data-arg="${w}">${WHO[w]}</button>`).join('')}</div></div></div>
  <div class="btns">${N.id ? '<button class="btn" data-act="delNote">Löschen</button>' : '<button class="btn" data-act="closeSheet">Abbrechen</button>'}<button class="btn primary" data-act="saveNote">Speichern</button></div>`;
}

// Einstellungen
function shareLink() { return location.origin + location.pathname + '?s=' + encodeURIComponent(code); }
function settingsSheet() {
  const size = JSON.stringify(S).length;
  openSheet(`<h2>Einstellungen</h2>
    <div class="field"><div class="flabel">Wer nutzt dieses Handy?</div><div class="chips">${['F', 'J'].map(w => `<button class="chip ${me === w ? 'on' : ''}" data-act="setMe" data-arg="${w}">${WHO[w]}</button>`).join('')}</div></div>
    <div class="card"><h3>Judith (oder Fabi) einladen</h3><p class="small muted">Wer diesen Link öffnet, sieht und bearbeitet dieselben Daten. Am besten danach im Browser „Zum Home-Bildschirm“ wählen.</p><div class="code">${esc(shareLink())}</div><div class="btns"><button class="btn primary" data-act="share">Link teilen</button><button class="btn" data-act="copy">Kopieren</button></div></div>
    <div class="field"><label>Startdatum des 12-Wochen-Plans</label><input type="date" id="setStart" value="${esc(S.settings.startDate || today())}"></div>
    <div class="field"><label>Stop-Wort</label><input type="text" id="setStop" value="${esc(S.settings.stopWord || 'STOPP')}"></div>
    <button class="btn primary block" data-act="saveSettings">Speichern</button>
    <hr class="sep">
    <div class="card"><h3>Sync & Sicherung</h3>
      <p class="small muted">Status: ${syncState.ok ? 'synchron' : syncState.ok === false ? 'nicht erreichbar (' + esc(syncState.err) + ') – alles ist lokal gespeichert und wird nachgeholt' : '…'}${syncState.last ? ' · zuletzt ' + new Date(syncState.last).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : ''}<br>Speicher belegt: ${Math.round(size / 1000)} von ~195 KB</p>
      <p class="small muted">Die Daten liegen in einem kostenlosen Online-Speicher (textdb.online) unter eurem geheimen Stall-Code und zusätzlich auf jedem Handy. Ab und zu exportieren schadet nicht.</p>
      <div class="btns"><button class="btn" data-act="sync">Jetzt synchronisieren</button></div>
      <div class="btns"><button class="btn" data-act="export">Exportieren</button><label class="btn" style="position:relative">Importieren<input type="file" accept="application/json" id="importFile" style="position:absolute;inset:0;opacity:0"></label></div>
    </div>
    <p class="small muted center">Stall-Code: <span class="code" style="display:inline">${esc(code)}</span></p>
    <button class="btn ghost block small" data-act="leave">Diesen Stall auf dem Handy abmelden</button>`);
}

// ---------- events ----------
document.addEventListener('click', async e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act, arg = el.dataset.arg;
  switch (act) {
    case 'tab': tab = arg; lsSet('stevie.tab', tab); if (el.dataset.sub) sub.protokoll = el.dataset.sub; if (tab === 'wissen' && !el.dataset.keep) { sub.wissen = null; sub.wlevel = null; } if (sheetOpen) closeSheet(); render(); window.scrollTo(0, 0); break;
    case 'sub': sub.protokoll = arg; render(); break;
    case 'musterAnimal': sub.muster = arg; render(); break;
    case 'sync': syncState.ok = null; await sync(); if (sheetOpen && $('#setStart')) settingsSheet(); toast(syncState.ok ? 'Synchron ✓' : 'Gerade nicht erreichbar – lokal gespeichert'); break;
    case 'settings': settingsSheet(); break;
    case 'closeSheet': closeSheet(); break;
    case 'newStall': {
      code = 'stevie' + Array.from(crypto.getRandomValues(new Uint8Array(12)), b => (b % 36).toString(36)).join('');
      lsSet('stevie.code', code); history.replaceState(null, '', '?s=' + code);
      S = emptyData(); S.settings.updatedAt = Date.now(); saveLocal(); dirty = true;
      render(); askWho(); sync(); break;
    }
    case 'joinStall': {
      let v = ($('#joinCode').value || '').trim();
      const m = v.match(/[?&]s=([a-z0-9]+)/i); if (m) v = m[1];
      if (!/^[a-z0-9]{10,40}$/i.test(v)) { toast('Das sieht nicht nach einem Stall-Code aus.'); return; }
      code = v; lsSet('stevie.code', code); history.replaceState(null, '', '?s=' + code);
      S = loadLocal(); render(); askWho(); await sync(); break;
    }
    case 'setMe': me = arg; lsSet('stevie.me', me); if ($('#setStart')) settingsSheet(); else closeSheet(); toast('Hallo ' + WHO[me] + '!'); break;
    case 'newSession': openSessionForm(arg || 'stevie'); break;
    case 'editSession': { const s = S.sessions[arg]; if (!s) return; F = Object.assign(defaultForm(s.animal), JSON.parse(JSON.stringify(s)), { erfolg: false }); F.legs = F.legs || []; F.signals = F.signals || []; openSheet(sessionForm()); break; }
    case 'f': { const k = el.dataset.k; let v = arg; if (k === 'level' || k === 'baro') v = +v; F[k] = v; if (k === 'level' && v >= 4 && !F.legs.length) { const ov = overview(F.animal); F.legs = [ov.focus || 'VL']; } if (k === 'animal') { const d = defaultForm(v, F.minutes); F.level = d.level; F.legs = d.legs; } rerenderForm(); break; }
    case 'fleg': F.legs = F.legs.includes(arg) ? F.legs.filter(x => x !== arg) : [...F.legs, arg]; rerenderForm(); break;
    case 'fsig': F.signals = F.signals.includes(arg) ? F.signals.filter(x => x !== arg) : [...F.signals, arg]; rerenderForm(); break;
    case 'fmin': F.minutes = Math.max(1, Math.min(30, F.minutes + +arg)); rerenderForm(); break;
    case 'saveSession': saveSession(); break;
    case 'delSession': if (confirm('Diese Session löschen?')) { S.sessions[F.id] = Object.assign({}, S.sessions[F.id], { deleted: true, updatedAt: Date.now() }); closeSheet(); commit('Gelöscht'); } break;
    case 'bowl': { const d = today(); const on = !(S.bowl[d] && S.bowl[d].done); S.bowl[d] = { done: on, who: me || 'J', updatedAt: Date.now() }; commit(on ? 'Futterschale ✓ – Stevie freut sich' : 'Zurückgenommen'); break; }
    case 'level': tab = 'wissen'; lsSet('stevie.tab', tab); sub.wlevel = +arg; if (sheetOpen) closeSheet(); render(); window.scrollTo(0, 0); break;
    case 'wissen': tab = 'wissen'; lsSet('stevie.tab', tab); sub.wissen = arg; sub.wlevel = null; render(); window.scrollTo(0, 0); break;
    case 'wback': if (sub.wlevel !== null) sub.wlevel = null; else sub.wissen = null; render(); window.scrollTo(0, 0); break;
    case 'mini': { const o = S.minis[arg] && S.minis[arg].done; S.minis[arg] = { done: !o, date: today(), who: me || '', updatedAt: Date.now() }; commit(o ? '' : 'Mini-Erfolg ✓'); break; }
    case 'letter': openLetter(arg); break;
    case 'letterLocked': { const L = P.letters.find(x => x.id === arg); if (arg === 'l5') { openSheet(`<h2>${esc(L.title)}</h2><p>Zum Lesen, wenn ihr bei Level 9 angekommen seid. Oder an einem Tag, an dem ihr ihn braucht.</p><div class="btns"><button class="btn" data-act="closeSheet">Noch warten</button><button class="btn terra" data-act="forceL5">Heute brauch ich ihn</button></div>`); } else toast('Erst lesen, wenn ' + L.unlock + '. Stevie besteht darauf.'); break; }
    case 'forceL5': S.letters.l5 = Object.assign({}, S.letters.l5, { forced: true, updatedAt: Date.now() }); openLetter('l5'); break;
    case 'newNote': N = { id: null, type: 'erfolg', text: '', date: today(), who: me || 'F' }; openSheet(noteForm()); break;
    case 'editNote': N = Object.assign({}, S.notes[arg]); openSheet(noteForm()); break;
    case 'n': N[el.dataset.k] = arg; $('#sheet').innerHTML = '<div class="grab"></div>' + noteForm(); break;
    case 'saveNote': { if (!N.text.trim()) { toast('Bitte etwas eintragen.'); return; } const id = N.id || uid(); S.notes[id] = { id, type: N.type, text: N.text.trim(), date: N.date || today(), who: N.who, createdAt: (S.notes[id] && S.notes[id].createdAt) || Date.now(), updatedAt: Date.now() }; closeSheet(); commit('Festgehalten ✓'); break; }
    case 'delNote': if (confirm('Eintrag löschen?')) { S.notes[N.id] = Object.assign({}, S.notes[N.id], { deleted: true, updatedAt: Date.now() }); closeSheet(); commit('Gelöscht'); } break;
    case 'w8dec': { const w = collectW8(); w.decision = arg; S.week8 = Object.assign({}, w, { updatedAt: Date.now() }); commit(); break; }
    case 'saveW8': { const w = collectW8(); S.week8 = Object.assign({}, w, { updatedAt: Date.now() }); commit('Woche-8-Check gespeichert ✓'); break; }
    case 'startTimer': startTimerSheet(); break;
    case 'pre': el.parentElement.classList.add('done'); el.style.opacity = '.55'; el.style.textDecoration = 'line-through'; break;
    case 'goTimer': runTimer(); break;
    case 'stopTimer': { const s = Math.max(1, Math.round((Date.now() - timer.start) / 60000)); clearInterval(timer.iv); timer = null; F = defaultForm('stevie', Math.min(30, s)); F.fromTimer = true; $('#sheet').innerHTML = '<div class="grab"></div>' + sessionForm(); $('#sheet').scrollTop = 0; break; }
    case 'saveSettings': S.settings = { startDate: $('#setStart').value || today(), stopWord: ($('#setStop').value || 'STOPP').trim().slice(0, 20), updatedAt: Date.now() }; closeSheet(); commit('Gespeichert ✓'); break;
    case 'share': { const url = shareLink(); if (navigator.share) { try { await navigator.share({ title: 'Stevies Training', text: 'Unser gemeinsames Trainingsprotokoll für Stevie 🦙', url }); } catch { } } else { copy(url); } break; }
    case 'copy': copy(shareLink()); break;
    case 'export': { const blob = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'stevie-backup-' + today() + '.json'; document.body.appendChild(a); a.click(); a.remove(); break; }
    case 'leave': if (confirm('Stall auf diesem Handy abmelden? Die Daten bleiben online unter dem Stall-Code erhalten.')) { lsSet('stevie.code', ''); code = ''; history.replaceState(null, '', location.pathname); closeSheet(); render(); } break;
  }
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.f && F) F[t.dataset.f] = t.value;
  if (t.dataset.n && N) N[t.dataset.n] = t.value;
  if (t.dataset.fc && F) F[t.dataset.fc] = t.checked;
});
document.addEventListener('change', async e => {
  if (e.target.dataset.fc && F) F[e.target.dataset.fc] = e.target.checked;
  if (e.target.id === 'importFile') {
    const file = e.target.files[0]; if (!file) return;
    try { const d = JSON.parse(await file.text()); S = merge(S, d); closeSheet(); commit('Import zusammengeführt ✓'); } catch { toast('Datei konnte nicht gelesen werden.'); }
  }
});
function openLetter(id) {
  const L = P.letters.find(x => x.id === id); if (!L) return;
  S.letters[id] = Object.assign({}, S.letters[id], { read: true, updatedAt: Date.now() });
  saveLocal(); dirty = true; clearTimeout(pushTimer); pushTimer = setTimeout(sync, 800);
  openSheet(`<div class="paper"><span class="stamp">STALL<br>${esc(L.unlock.split(' –')[0].toUpperCase())}</span>${esc(L.body)}</div><div class="btns"><button class="btn primary" data-act="closeSheet">❤️ Schön</button></div>`);
  pendingRender = true;
}
function collectW8() {
  const w = Object.assign({}, S.week8 || {});
  document.querySelectorAll('[data-w8]').forEach(el => w[el.dataset.w8] = el.value);
  return w;
}
function copy(t) {
  (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast('Link kopiert ✓')).catch(() => { prompt('Link kopieren:', t); });
}
function askWho() {
  if (me) return;
  openSheet(`<h2>Wer bist du?</h2><p class="muted small">Damit Sessions automatisch der richtigen Person zugeordnet werden. Lässt sich in den Einstellungen ändern.</p><div class="who">${['F', 'J'].map(w => `<button data-act="setMe" data-arg="${w}">${WHO[w]}</button>`).join('')}</div>`);
}

// ---------- start ----------
if (code) { lsSet('stevie.code', code); if (params.get('s') !== code) history.replaceState(null, '', '?s=' + code); }
S = code ? loadLocal() : emptyData();
render();
if (code) { if (!me) askWho(); sync(); }
setInterval(() => { if (document.visibilityState === 'visible' && !syncState.busy) sync(); }, 30000);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') sync(); });
window.addEventListener('online', sync);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => { });
