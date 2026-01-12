// Minimal, lightweight helix animation for decorative effect
// Respects prefers-reduced-motion and hides on small screens via CSS.

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  return dpr;
}

function drawHelix(ctx, w, h, t) {
  ctx.clearRect(0, 0, w, h);

  const centerX = w / 2;
  const centerY = h / 2;
  const amplitude = Math.min(w * 0.35, 60);
  const spacing = 12; // vertical spacing between strands
  const turns = 3;
  const color = 'rgba(79,70,229,0.22)'; // muted violet
  ctx.lineWidth = Math.max(1, w / 200);
  ctx.lineCap = 'round';

  // Draw two strands offset in phase
  for (let strand = 0; strand < 2; strand++) {
    ctx.beginPath();
    for (let y = -h; y <= h * 2; y += 2) {
      const progress = (y / (h * 2));
      const angle = (progress * turns * Math.PI * 2) + t * 0.2 + strand * Math.PI;
      const x = centerX + Math.sin(angle) * amplitude * (1 - Math.abs(progress - 0.5));
      const drawY = centerY + (y / 2) - h / 4;
      if (y === -h) ctx.moveTo(x, drawY);
      else ctx.lineTo(x, drawY);
    }
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.95; // base alpha, overall wrapper controls opacity
    ctx.stroke();
  }

  // Draw base connector circles (simple ladder rungs)
  ctx.fillStyle = 'rgba(79,70,229,0.06)';
  const rungCount = Math.floor(h / spacing) + 2;
  for (let i = -rungCount; i <= rungCount; i++) {
    const progress = (i / rungCount + 1) / 2;
    const angle = (progress * turns * Math.PI * 2) + t * 0.2;
    const x1 = centerX + Math.sin(angle) * amplitude * (1 - Math.abs(progress - 0.5));
    const x2 = centerX + Math.sin(angle + Math.PI) * amplitude * (1 - Math.abs(progress - 0.5));
    const y = (i * spacing) + h / 2 - rungCount * spacing / 2;
    const cx = (x1 + x2) / 2;
    // short, muted rect
    ctx.fillRect(cx - 0.5 * (w / 40), y - 1, w / 20, 2);
  }
}

(function init() {
  const canvas = document.getElementById('helix-canvas');
  if (!canvas) return;
  // If the canvas is hidden via CSS on small screens, still avoid heavy work.
  const wrapper = canvas.parentElement;
  if (window.matchMedia('(max-width: 768px)').matches) return;
  let dpr = setupCanvas(canvas);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  let rafId = null;
  let start = performance.now();

  function render(now) {
    const t = (now - start) / 1000; // seconds
    const rect = canvas.getBoundingClientRect();
    // On resize, adjust
    if (canvas.width !== Math.max(1, Math.floor(rect.width * dpr)) || canvas.height !== Math.max(1, Math.floor(rect.height * dpr))) {
      dpr = setupCanvas(canvas);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    // Respect reduced motion: draw static frame and stop animating
    if (prefersReduced) {
      drawHelix(ctx, canvas.width / dpr, canvas.height / dpr, 0);
      return;
    }

    drawHelix(ctx, canvas.width / dpr, canvas.height / dpr, t);
    rafId = requestAnimationFrame(render);
  }

  rafId = requestAnimationFrame(render);

  // Resize observer to update canvas when wrapper size changes
  const ro = new ResizeObserver(() => {
    const rect = canvas.getBoundingClientRect();
    setupCanvas(canvas);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  });
  ro.observe(canvas.parentElement);

  // Cleanup on unload
  window.addEventListener('beforeunload', () => {
    if (rafId) cancelAnimationFrame(rafId);
    ro.disconnect();
  });
})();
