/* ====== CONFIG ====== */
const COMPANY_NAME = "";   // e.g. "Your Brand"
const REGISTER_URL = "https://jayakaya99a.com/register/SMSRegister?utm_source=jk1668";   // e.g. "https://yourshop.com/register"
const REVEAL_AT    = 55;   // % scratched before popup opens
const OFFER_END    = "";   // real end date, e.g. "2026-12-31T23:59:59" (empty = timer hidden)
// Use verified claim records here when available. Empty means labeled illustrative samples below.
const TICKER_ITEMS = []; // e.g. [{name:"Aina",voucher:"RM99 Welcome Bonus"}]
const SAMPLE_CLAIM_NAMES = ["Aina", "Amir", "Siti", "Daniel", "Farah", "Haziq", "Mei Ling", "Nadia", "Kumar", "Izzat", "Sarah", "Hakim"];
/* ==================== */

const $ = id => document.getElementById(id);
const canvas = $('scratch'), ctx = canvas.getContext('2d', { willReadFrequently: true });
const hint = $('hint'), pctEl = $('pct'), fill = $('fill'), overlay = $('overlay');
/* ===== effects: sparkles while scratching + confetti on reveal ===== */
const fx = $('fx'), fctx = fx.getContext('2d'), parts = [];
const COLORS = ['#fbe39a','#e8b84a','#fff6c8','#fb8c4d','#f4f1e1'];
function sizeFx(){ fx.width = innerWidth; fx.height = innerHeight; }
sizeFx(); addEventListener('resize', sizeFx);
function sparkle(x, y){
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 2; i++) parts.push({ x, y, vx:(Math.random()-.5)*2.2, vy:-Math.random()*2-.4, g:.07, life:28+Math.random()*14, max:42, s:2+Math.random()*3, c:COLORS[Math.random()*3|0], star:true });
}
function confetti(){
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 110; i++) parts.push({ x:innerWidth/2, y:innerHeight*.4, vx:(Math.random()-.5)*14, vy:-Math.random()*13-3, g:.32, life:90+Math.random()*50, max:140, s:5+Math.random()*5, c:COLORS[Math.random()*COLORS.length|0], rot:Math.random()*6, vr:(Math.random()-.5)*.4 });
}
function loop(){
  fctx.clearRect(0, 0, fx.width, fx.height);
  for (let i = parts.length - 1; i >= 0; i--){
    const p = parts[i];
    p.x += p.vx; p.y += p.vy; p.vy += p.g; p.life--;
    if (p.life <= 0){ parts.splice(i, 1); continue; }
    fctx.globalAlpha = Math.min(1, p.life / 25);
    fctx.fillStyle = p.c;
    if (p.star){
      fctx.beginPath();
      for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4, r = k % 2 ? p.s * .4 : p.s * 1.6; fctx.lineTo(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r); }
      fctx.fill();
    } else {
      p.rot += p.vr; fctx.save(); fctx.translate(p.x, p.y); fctx.rotate(p.rot); fctx.fillRect(-p.s/2, -p.s/3, p.s, p.s * .6); fctx.restore();
    }
  }
  fctx.globalAlpha = 1;
  requestAnimationFrame(loop);
}
loop();

let drawing = false, done = false, lastCheck = 0, lastW = 0;

$('company').textContent = COMPANY_NAME;
$('year').textContent = new Date().getFullYear();
if (REGISTER_URL) $('register').href = REGISTER_URL;

/* Voucher activity ticker: random examples are explicitly labeled, not real claims. */
{
  const ticker = $('ticker'), text = $('tickerText');
  const verified = TICKER_ITEMS.length > 0;
  let lastIndex = -1;
  function showClaim(){
    const items = verified ? TICKER_ITEMS : SAMPLE_CLAIM_NAMES;
    let index = Math.floor(Math.random() * items.length);
    if (items.length > 1 && index === lastIndex) index = (index + 1) % items.length;
    lastIndex = index;
    const record = verified ? items[index] : {name:items[index],voucher:'FREE RM99'};
    const name = typeof record === 'string' ? record : String(record.name || 'Pengguna');
    const voucher = typeof record === 'string' ? 'FREE RM99' : String(record.voucher || 'voucher');
    text.replaceChildren();
    if (!verified){const label=document.createElement('span');label.className='activity-label';}
    const person=document.createElement('b');person.textContent=name;
    const reward=document.createElement('b');reward.textContent=voucher;
    text.append(person,document.createTextNode(' telah menebus '),reward,document.createTextNode(' 🎁'));
    text.classList.remove('changing');
  }
  ticker.hidden = false;
  showClaim();
  
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {

  text.style.transition = "none";
  text.style.opacity = "1";
  text.style.transform = "translateY(0)";

  function animateTicker() {

    // Smoothly slide old message upward
    text.style.transition =
      "opacity 250ms ease, transform 250ms ease";

    text.style.opacity = "0";
    text.style.transform = "translateY(-8px)";

    setTimeout(() => {

      // Keep your original message generation
      showClaim();

      // Position next message below, invisible
      text.style.transition = "none";
      text.style.opacity = "0";
      text.style.transform = "translateY(8px)";

      // Animate new message into place
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          text.style.transition =
            "opacity 350ms ease-out, transform 350ms ease-out";

          text.style.opacity = "1";
          text.style.transform = "translateY(0)";
        });
      });

    }, 250);
  }

  setInterval(animateTicker, 4500);
}

}

/* countdown to a real end date */
if (OFFER_END){
  const end = new Date(OFFER_END).getTime();
  if (!isNaN(end)){
    $('timerWrap').hidden = false;
    const p = n => String(n).padStart(2,'0');
    const tick = () => {
      const s = Math.max(0, Math.floor((end - Date.now()) / 1000));
      const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600);
      $('timer').textContent = (d ? d + 'd ' : '') + (d || h ? p(h) + ':' : '') + p(Math.floor(s % 3600 / 60)) + ':' + p(s % 60);
    };
    tick(); setInterval(tick, 1000);
  }
}

/* scratch layer */

function paintCover() {
  const r = canvas.getBoundingClientRect();
  if (!r.width || !r.height) return;

  const d = window.devicePixelRatio || 1;
  canvas.width = Math.round(r.width * d);
  canvas.height = Math.round(r.height * d);

  lastW = r.width;
  ctx.setTransform(d, 0, 0, d, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;

  const w = r.width;
  const h = r.height;

  // Bright metallic gold
  const gold = ctx.createLinearGradient(0, 0, w, h);
  gold.addColorStop(0, "#D99B22");
  gold.addColorStop(0.25, "#FFE68A");
  gold.addColorStop(0.5, "#F7CA4C");
  gold.addColorStop(0.75, "#FFE88F");
  gold.addColorStop(1, "#C58A1C");

  ctx.fillStyle = gold;
  ctx.fillRect(0, 0, w, h);

  // Subtle diagonal gold stripes
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 7;

  for (let x = -h; x < w + h; x += 19) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + h, h);
    ctx.stroke();
  }
  ctx.restore();

  // Thin inner border
  ctx.strokeStyle = "rgba(255,245,190,0.75)";
  ctx.lineWidth = 2;
  ctx.strokeRect(9, 9, w - 18, h - 18);
}


function pos(e){
  const r = canvas.getBoundingClientRect(), t = e.touches ? e.touches[0] : e;
  return { x: t.clientX - r.left, y: t.clientY - r.top };
}

function scratch(e) {
    if (!drawing || done) return;

    e.preventDefault();

    const p = pos(e);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
    ctx.fill();

    hint.classList.add('hide');
    $('shine').classList.add('hide');

    const t = e.touches ? e.touches[0] : e;
    sparkle(t.clientX, t.clientY);

    const now = Date.now();
    if (now - lastCheck > 80) {
        lastCheck = now;
        measure();
    }
}

function measure(){
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let clear = 0, total = 0;
  for (let i = 3; i < data.length; i += 40){ total++; if (data[i] < 200) clear++; }
  const pct = Math.min(100, Math.round(clear / total * 100));
  pctEl.textContent = pct; fill.style.width = pct + '%';
  if (pct >= REVEAL_AT) finish();
}
function finish(){
  if (done) return;
  done = true; drawing = false;
  canvas.style.transition = 'opacity .5s'; canvas.style.opacity = 0;
  pctEl.textContent = 100; fill.style.width = '100%'; hint.classList.add('hide'); $('shine').classList.add('hide'); confetti();
  setTimeout(() => { canvas.style.display = 'none'; overlay.classList.add('open'); }, 600);
}

canvas.addEventListener('mousedown', e => { drawing = true; scratch(e); });
canvas.addEventListener('touchstart', e => { drawing = true; scratch(e); }, { passive:false });
canvas.addEventListener('mousemove', scratch);
canvas.addEventListener('touchmove', scratch, { passive:false });
window.addEventListener('mouseup', () => drawing = false);
window.addEventListener('touchend', () => drawing = false);
$('skip').addEventListener('click', finish);
$('close').addEventListener('click', () => overlay.classList.remove('open'));
overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
window.addEventListener('resize', () => {
  // only repaint when the width really changes (mobile address-bar scroll fires height-only resizes)
  if (done || Math.abs(canvas.getBoundingClientRect().width - lastW) < 1) return;
  paintCover(); pctEl.textContent = 0; fill.style.width = '0%'; hint.classList.remove('hide'); $('shine').classList.remove('hide');
});
paintCover();

/* Real notices only: no simulated claims. */
/* The five-minute display is a session countdown, not a fixed offer deadline. */
if (!OFFER_END) {
  let remaining = 300;
  $('timerWrap').hidden = false;
  function tickSession() {
    const mm = String(Math.floor(remaining / 60)).padStart(2,'0');
    const ss = String(remaining % 60).padStart(2,'0');
    $('timer').textContent = $('popupTimer').textContent = `${mm}:${ss}`;
    if (remaining > 0) remaining--;
  }
  tickSession(); setInterval(tickSession, 1000);
}

/* Cinematic celebration, isolated from game logic. */
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const coinLayer = $('coinRain');
let celebrationTimers = [], celebrationToken = 0;
function clearCelebration() {
  celebrationToken++;
  celebrationTimers.forEach(clearTimeout);
  celebrationTimers = [];
  coinLayer.replaceChildren();
  document.body.classList.remove('celebrating');
}
function coinBurst(count, burst = false) {
  if (!overlay.classList.contains('open') || motionPreference.matches) return;
  const fragment = document.createDocumentFragment();
  for (let i=0; i<count; i++) {
    const coin = document.createElement('span');
    const sparkle = Math.random() < .25;
    coin.className = sparkle ? 'falling-spark' : 'falling-coin';
    coin.textContent = sparkle ? '✦' : 'RM';
    const x = Math.random() * 100;
    coin.style.setProperty('--x', x + 'vw');
    coin.style.setProperty('--drift', (Math.random()*180-90) + 'px');
    coin.style.setProperty('--spin', ((Math.random()>.5?1:-1)*(360+Math.random()*1100))+'deg');
    coin.style.setProperty('--duration', (2.3+Math.random()*2.1)+'s');
    coin.style.setProperty('--delay', (burst ? 0 : Math.random()*.5)+'s');
    coin.style.setProperty('--size', (sparkle ? 9+Math.random()*15 : 16+Math.random()*23)+'px');
    if (burst) {
      coin.style.setProperty('--start-x', '50vw');
      coin.style.setProperty('--start-y', '44vh');
      coin.style.setProperty('--end-x', (Math.random()*100)+'vw');
    }
    fragment.appendChild(coin);
  }
  coinLayer.appendChild(fragment);
}
function celebrate() {
  clearCelebration();
  if (motionPreference.matches) return;
  document.body.classList.add('celebrating');
  coinBurst(54, true);
  const token = celebrationToken;
  for (let i=0;i<4;i++) celebrationTimers.push(setTimeout(()=>{
    if (token === celebrationToken) coinBurst(25);
  }, 350+i*650));
  celebrationTimers.push(setTimeout(clearCelebration, 5500));
}
const modalObserver = new MutationObserver(() => {
  if (overlay.classList.contains('open')) {
    celebrate();
    $('close').focus({preventScroll:true});
  } else clearCelebration();
});
modalObserver.observe(overlay, {attributes:true,attributeFilter:['class']});
addEventListener('keydown', e => { if (e.key==='Escape' && overlay.classList.contains('open')) $('close').click(); });