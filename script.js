const THROTTLE = 100;
const POOL_SIZE = 20;
let lastTime = 0;
const pool = [];

async function loadPool() {
  for (let i = 0; i < POOL_SIZE; i++) {
    try {
      const res = await fetch('/cat?' + i);
      const blob = await res.blob();
      pool.push(URL.createObjectURL(blob));
    } catch (e) {
      i--;
    }
  }
}

loadPool();

document.addEventListener('mousemove', (e) => {
  if (pool.length === 0) return;
  const now = Date.now();
  if (now - lastTime < THROTTLE) return;
  lastTime = now;
  spawnCat(e.clientX, e.clientY);
});

function spawnCat(x, y) {
  const img = document.createElement('img');
  img.className = 'cat';
  img.src = pool[Math.floor(Math.random() * pool.length)];
  img.style.left = x + 'px';
  img.style.top = y + 'px';
  document.body.appendChild(img);

  requestAnimationFrame(() => img.classList.add('show'));

  setTimeout(() => {
    img.style.transition = 'opacity 2s ease';
    img.style.opacity = '0';
    setTimeout(() => img.remove(), 2000);
  }, 1400);
}
