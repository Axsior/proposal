'use strict';
/* ===== Konfigurasi (mudah diubah) ===== */
const CONFIG = {
  compliments: [
    'You have the prettiest smile.',
    'You make ordinary days feel special.',
    "You're my favorite notification.",
    'I think you’re ridiculously cute.',
    'Your existence makes my world better.'
  ],
  letter: "Nabila Daffa Salsabila Asroriyah Honestly, I’ve been wanting to tell you something for a while. Every time I talk to you, my day somehow gets better. I don’t know how you do it, but you make me smile without even trying.",
  noMessages: ['Are you sure? 🥺', 'My heart is buffering…', 'Please reconsider, pretty please? 💗', 'Wrong button, maybe? 👀'],
  maxDodges: 6 // setelah ini tombol NO diam & bisa diklik
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const stages = $$('.stage');
const TOTAL_DOTS = 5; // stage 0-4
let current = 0, dodges = 0, typingTimer = null;

/* ===== Progress & navigasi ===== */
$('#progress').innerHTML = Array.from({ length: TOTAL_DOTS }, () => '<span class="dot"></span>').join('');
function show(n) {
  current = n;
  stages.forEach(s => s.classList.toggle('active', +s.dataset.step === n));
  $$('.dot').forEach((d, i) => d.classList.toggle('on', i <= Math.min(n, TOTAL_DOTS - 1)));
  document.body.classList.toggle('happy', n === 5);
  if (n === 5) celebrate();
}
$$('[data-next]').forEach(b => b.addEventListener('click', () => {
  if (current === 0) startMusic();
  show(current + 1);
}));

/* ===== Floating hearts ===== */
const deco = ['💗', '💖', '🌸', '✨', '🌷', '⭐', '💕'];
function floatItem() {
  const el = document.createElement('span');
  el.className = 'float';
  el.textContent = deco[Math.random() * deco.length | 0];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.fontSize = 14 + Math.random() * 22 + 'px';
  el.style.animationDuration = 6 + Math.random() * 6 + 's';
  $('#hearts').appendChild(el);
  setTimeout(() => el.remove(), 12500);
}
setInterval(floatItem, 600);
for (let i = 0; i < 8; i++) setTimeout(floatItem, i * 150);

/* ===== Cursor trail (desktop) ===== */
if (matchMedia('(hover:hover)').matches) {
  let last = 0;
  addEventListener('pointermove', e => {
    const now = Date.now();
    if (now - last < 60) return;
    last = now;
    const t = document.createElement('span');
    t.className = 'trail';
    t.textContent = '💗';
    t.style.left = e.clientX + 'px';
    t.style.top = e.clientY + 'px';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 900);
  });
}

/* ===== Stage 1 ===== */
$('#notYet').addEventListener('click', () => {
  $('#readyMsg').textContent = 'Awww, please? Just a little bit 🥺';
  $('#notYet').classList.add('hidden');
  $('#readyContinue').classList.remove('hidden');
});

/* ===== Stage 2: kartu pujian ===== */
let flipped = 0;
$('#cards').innerHTML = CONFIG.compliments.map((t, i) => `
  <div class="card" tabindex="0" role="button" aria-label="Kartu ${i + 1}">
    <div class="card-in"><div class="face front">${['🌸', '💌', '🔔', '🐰', '🌟'][i]}</div><div class="face back">${t}</div></div>
  </div>`).join('');
$$('.card').forEach(c => {
  const flip = () => {
    if (c.classList.contains('flipped')) return;
    c.classList.add('flipped');
    $('#flipCount').textContent = ++flipped;
    if (flipped === CONFIG.compliments.length) $('#cardsContinue').classList.remove('hidden');
  };
  c.addEventListener('click', flip);
  c.addEventListener('keydown', e => (e.key === 'Enter' || e.key === ' ') && flip());
});

/* ===== Stage 3: amplop + typewriter ===== */
$('#envelope').addEventListener('click', function () {
  if (this.classList.contains('open')) return;
  this.classList.add('open');
  $('#envHint').classList.add('hidden');
  const p = $('#typed');
  p.classList.add('typing');
  let i = 0;
  setTimeout(function type() {
    p.textContent = CONFIG.letter.slice(0, ++i);
    if (i < CONFIG.letter.length) typingTimer = setTimeout(type, 35);
    else { p.classList.remove('typing'); $('#letterContinue').classList.remove('hidden'); }
  }, 1200);
});

/* ===== Stage 4: pertanyaan utama ===== */
const noBtn = $('#noBtn'), noMsg = $('#noMsg');
function dodge() {
  if (dodges >= CONFIG.maxDodges) return false;
  dodges++;
  noBtn.classList.add('dodging');
  const w = noBtn.offsetWidth, h = noBtn.offsetHeight, pad = 16;
  noBtn.style.left = pad + Math.random() * (innerWidth - w - pad * 2) + 'px';
  noBtn.style.top = 80 + Math.random() * (innerHeight - h - 120) + 'px';
  noMsg.textContent = CONFIG.noMessages[(dodges - 1) % CONFIG.noMessages.length];
  if (dodges >= CONFIG.maxDodges) noMsg.textContent = 'Okay okay, I’ll stop playing 😌 You can choose freely.';
  return true;
}
noBtn.addEventListener('pointerenter', e => e.pointerType === 'mouse' && dodge());
noBtn.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' && dodge()) e.preventDefault(); });
noBtn.addEventListener('click', e => {
  if (dodges < CONFIG.maxDodges && matchMedia('(hover:hover)').matches === false) return;
  if (dodges < CONFIG.maxDodges) { dodge(); return; }
  show(6);
});
$('#yesBtn').addEventListener('click', () => show(5));

/* ===== Perayaan ===== */
function celebrate() {
  const items = ['💗', '💖', '🎉', '🎊', '✨', '🌸', '💕', '🌷'];
  const colors = ['#FF69B4', '#FFC0CB', '#FFB6C1', '#fff'];
  for (let i = 0; i < 90; i++) setTimeout(() => {
    const c = document.createElement('span');
    c.className = 'confetti';
    if (i % 2) c.textContent = items[Math.random() * items.length | 0];
    else { c.style.cssText += `width:9px;height:14px;background:${colors[i % 4]};border-radius:2px`; }
    c.style.left = Math.random() * 100 + 'vw';
    c.style.fontSize = 18 + Math.random() * 18 + 'px';
    c.style.animationDuration = 2.5 + Math.random() * 2.5 + 's';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 5200);
  }, i * 30);
  for (let i = 0; i < 25; i++) setTimeout(floatItem, i * 80);
  chime();
}

/* ===== Replay ===== */
$$('.replay').forEach(b => b.addEventListener('click', () => {
  clearTimeout(typingTimer);
  dodges = 0; flipped = 0;
  noBtn.classList.remove('dodging'); noBtn.style.left = noBtn.style.top = '';
  noMsg.innerHTML = '&nbsp;';
  $('#flipCount').textContent = 0;
  $$('.card').forEach(c => c.classList.remove('flipped'));
  $('#cardsContinue').classList.add('hidden');
  $('#envelope').classList.remove('open');
  $('#typed').textContent = '';
  $('#envHint').classList.remove('hidden');
  $('#letterContinue').classList.add('hidden');
  $('#readyMsg').textContent = 'Take a deep breath… 🌸';
  $('#notYet').classList.remove('hidden');
  $('#readyContinue').classList.add('hidden');
  show(0);
}));

/* ===== Musik (Web Audio, tanpa file eksternal) ===== */
let ctx, musicOn = false, loop = null, step = 0;
const notes = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46, 523.25, 659.25, 783.99, 1046.5, 880, 783.99, 659.25, 587.33];
function tone(freq, dur = 0.9, vol = 0.05) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  o.connect(g).connect(ctx.destination);
  o.start(); o.stop(ctx.currentTime + dur);
}
function startMusic() {
  if (musicOn) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume();
    musicOn = true;
    loop = setInterval(() => tone(notes[step++ % notes.length]), 450);
    setMuteIcon();
  } catch (e) { /* audio tidak tersedia */ }
}
function chime() { if (musicOn) [784, 988, 1175, 1568].forEach((f, i) => setTimeout(() => tone(f, 1.2, 0.07), i * 120)); }
function setMuteIcon() {
  $('#muteBtn i').className = musicOn ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
}
$('#muteBtn').addEventListener('click', () => {
  if (musicOn) { clearInterval(loop); musicOn = false; setMuteIcon(); }
  else startMusic();
});

show(0);
