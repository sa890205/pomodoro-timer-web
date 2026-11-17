const savedMinutes = Number(localStorage.getItem('focusMinutes'));
const focusMinutes = savedMinutes >= 1 && savedMinutes <= 60 ? savedMinutes : 25;
const DURATIONS = { focus: focusMinutes*60, short: 5*60, long: 15*60 };
document.querySelector('[data-mode="focus"]').textContent = `집중 ${focusMinutes}분`;
const C = 2 * Math.PI * 100;
const bar = document.getElementById('bar');
const timeEl = document.getElementById('time');
const startBtn = document.getElementById('start');
const doneEl = document.getElementById('done');
bar.style.strokeDasharray = C;

let mode = 'focus', total = DURATIONS.focus, remaining = total, endAt = 0, timer = null, done = 0;

function render() {
  const m = String(Math.floor(remaining / 60)).padStart(2, '0');
  const s = String(remaining % 60).padStart(2, '0');
  timeEl.textContent = `${m}:${s}`;
  bar.style.strokeDashoffset = C * (1 - remaining / total);
  document.title = `${m}:${s} - 뽀모도로`;
}

function stop() { clearInterval(timer); timer = null; }

function setMode(next) {
  stop();
  mode = next; total = remaining = DURATIONS[next];
  document.body.classList.toggle('break', next !== 'focus');
  document.querySelectorAll('.modes button').forEach(b => b.classList.toggle('active', b.dataset.mode === next));
  render();
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, .25, .5].forEach(t => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(.2, ctx.currentTime + t);
      o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + .15);
    });
  } catch (e) {}
}

function tick() {
  remaining = Math.max(0, Math.round((endAt - Date.now()) / 1000));
  render();
  if (remaining === 0) {
    stop(); beep();
    if (mode === 'focus') { done++; doneEl.textContent = done; setMode(done % 4 === 0 ? 'long' : 'short'); }
    else setMode('focus');
  }
}

startBtn.onclick = () => {
  if (timer) return;
  endAt = Date.now() + remaining * 1000;
  timer = setInterval(tick, 250);
};
document.getElementById('stop').onclick = () => stop();
document.getElementById('reset').onclick = () => setMode(mode);
document.querySelectorAll('.modes button').forEach(b => b.onclick = () => setMode(b.dataset.mode));

render();
