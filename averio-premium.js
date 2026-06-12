/* ══════════════════════════════════════════════════════
   AVERIO MEDIA — PREMIUM JS
   GSAP · Lenis · Particles · Cursor · Magnetic · Reveal
══════════════════════════════════════════════════════ */

/* ── GSAP REGISTRATION ────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ── LENIS SMOOTH SCROLL ──────────────────────────────── */
const lenis = new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ── PRELOADER ────────────────────────────────────────── */
(function initPreloader() {
  const pl       = document.getElementById('preloader');
  const plBar    = document.querySelector('.pl-bar');
  const plCount  = document.querySelector('.pl-count');
  const plLogo   = document.querySelector('.pl-logo');
  if (!pl) return;

  const tl = gsap.timeline({
    onComplete: () => {
      pl.style.pointerEvents = 'none';
      // entry animations kick in after preloader leaves
      initEntryAnimations();
    }
  });

  // Logo fade in
  tl.to(plLogo, { opacity: 1, y: 0, duration: .7, ease: 'power3.out' }, 0.2);

  // Progress bar + counter
  let counted = { val: 0 };
  tl.to(plBar, { scaleX: 1, duration: 2, ease: 'power2.inOut' }, 0);
  tl.to(counted, {
    val: 100, duration: 2, ease: 'power2.inOut',
    onUpdate() { if (plCount) plCount.textContent = Math.round(counted.val) + '%'; }
  }, 0);

  // Slide preloader up
  tl.to(pl, { y: '-100%', duration: .9, ease: 'power4.inOut', delay: 0.25 });
})();

/* ── ENTRY ANIMATIONS ─────────────────────────────────── */
function initEntryAnimations() {
  // Nav
  gsap.from('.nav', { y: -30, opacity: 0, duration: .7, ease: 'power3.out' });

  // Hero content stagger
  const heroItems = ['.hero-eyebrow', '.hero-h1', '.hero-sub', '.hero-btns', '.hero-stats'];
  gsap.from(heroItems, {
    y: 40, opacity: 0, duration: .9, stagger: .12, ease: 'power3.out', delay: .1
  });

  // Hero float cards
  gsap.from('.hero-float-card', {
    y: 60, opacity: 0, duration: 1, stagger: .15, ease: 'power3.out', delay: .5
  });

  // Text split on hero H1
  splitText('.hero-h1', 'words');
}

/* ── CANVAS PARTICLES ─────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); build(); });

  canvas.parentElement.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.parentElement.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  class Particle {
    constructor() { this.init(); }
    init() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.vx = (Math.random() - .5) * .35;
      this.vy = (Math.random() - .5) * .35;
      this.r  = Math.random() * 1.4 + .3;
      this.a  = Math.random() * .45 + .05;
      this.isOrange = Math.random() > .65;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 20000) {
        const f = .004;
        this.vx += dx * f;
        this.vy += dy * f;
      }
      // damping
      this.vx *= .995;
      this.vy *= .995;
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
    }
    draw() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      ctx.save();
      ctx.globalAlpha = this.a * (isLight ? 2.2 : 1);
      ctx.fillStyle   = this.isOrange ? '#FF4D00' : (isLight ? '#64748B' : '#A8D8F0');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function build() {
    const count = Math.max(40, Math.floor(canvas.width * canvas.height / 7000));
    particles = Array.from({ length: count }, () => new Particle());
  }
  build();

  function drawConnections() {
    const maxDist = 110;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist) {
          const isLight = document.documentElement.getAttribute('data-theme') === 'light';
          ctx.save();
          ctx.globalAlpha = (1 - d / maxDist) * (isLight ? .13 : .07);
          ctx.strokeStyle = '#FF4D00';
          ctx.lineWidth = .6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  let running = true;
  function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }
  loop();

  // Pause when out of viewport
  const obs = new IntersectionObserver(entries => {
    running = entries[0].isIntersecting;
    if (running) loop();
  });
  obs.observe(canvas);
})();

/* ── CUSTOM CURSOR ────────────────────────────────────── */
(function initCursor() {
  const cur = document.getElementById('cursor');
  const fol = document.getElementById('cursor-follower');
  if (!cur || !fol || window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0) { if (cur) cur.style.display = 'none'; if (fol) fol.style.display = 'none'; return; }

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gsap.set(cur, { x: mx, y: my });
  });

  gsap.ticker.add(() => {
    fx += (mx - fx) * .075;
    fy += (my - fy) * .075;
    gsap.set(fol, { x: fx, y: fy });
  });

  document.addEventListener('mousedown', () => cur.classList.add('click'));
  document.addEventListener('mouseup',   () => cur.classList.remove('click'));

  const interactives = document.querySelectorAll('a, button, .service-card, .testi-card, .faq-q, .magnetic');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => { cur.classList.add('hover'); fol.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { cur.classList.remove('hover'); fol.classList.remove('hover'); });
  });
})();

/* ── MAGNETIC BUTTONS ─────────────────────────────────── */
(function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      gsap.to(btn, {
        x: (e.clientX - cx) * .3,
        y: (e.clientY - cy) * .3,
        duration: .35, ease: 'power2.out'
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: .65, ease: 'elastic.out(1, .4)' });
    });
  });
})();

/* ── GLITCH EFFECT ────────────────────────────────────── */
(function initGlitch() {
  const els = document.querySelectorAll('.glitch');
  els.forEach(el => {
    el.dataset.text = el.textContent;
    let timer;
    function glitch() {
      el.classList.add('glitching');
      setTimeout(() => el.classList.remove('glitching'), 180);
      timer = setTimeout(glitch, 2800 + Math.random() * 2000);
    }
    timer = setTimeout(glitch, 1500 + Math.random() * 1000);
  });
})();

/* ── TEXT SPLIT REVEAL ────────────────────────────────── */
function splitText(selector, type = 'words') {
  document.querySelectorAll(selector).forEach(el => {
    if (el.dataset.split) return;
    el.dataset.split = '1';
    const raw = el.textContent.trim();
    const chunks = type === 'chars' ? [...raw] : raw.split(' ');
    el.innerHTML = chunks.map((ch, i) =>
      `<span class="split-unit"><span class="split-inner">${ch}</span></span>${type === 'words' && i < chunks.length - 1 ? ' ' : ''}`
    ).join('');
  });
}

function revealSplit(el) {
  const inners = el.querySelectorAll('.split-inner');
  if (!inners.length) return;
  gsap.fromTo(inners,
    { y: '110%', opacity: 0 },
    { y: '0%', opacity: 1, duration: .85, stagger: .035, ease: 'power3.out' }
  );
}

/* ── SCROLL ANIMATIONS ────────────────────────────────── */
(function initScrollAnimations() {

  /* Generic reveal */
  document.querySelectorAll('.reveal').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      onEnter: () => el.classList.add('in-view'),
      once: true,
    });
  });

  /* Section titles with text split */
  document.querySelectorAll('.sec-title[data-split-scroll]').forEach(el => {
    splitText('#' + el.id || el, 'words');
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => revealSplit(el),
      once: true,
    });
  });

  /* Pain cards stagger */
  gsap.fromTo('.pain-card',
    { y: 60, opacity: 0 },
    {
      y: 0, opacity: 1,
      duration: .75, stagger: .1, ease: 'power3.out',
      scrollTrigger: { trigger: '.pain-grid', start: 'top 78%' }
    }
  );

  /* Service cards */
  gsap.fromTo('.service-card',
    { y: 80, opacity: 0, scale: .96 },
    {
      y: 0, opacity: 1, scale: 1,
      duration: .85, stagger: .12, ease: 'power3.out',
      scrollTrigger: { trigger: '.services-grid', start: 'top 72%' }
    }
  );

  /* Process steps */
  gsap.fromTo('.process-step',
    { opacity: 0, x: -36 },
    {
      opacity: 1, x: 0,
      duration: .7, stagger: .15, ease: 'power3.out',
      scrollTrigger: { trigger: '.process-steps', start: 'top 75%' }
    }
  );

  /* Testimonials */
  gsap.fromTo('.testi-card',
    { y: 56, opacity: 0 },
    {
      y: 0, opacity: 1,
      duration: .8, stagger: .13, ease: 'power3.out',
      scrollTrigger: { trigger: '.testi-grid', start: 'top 72%' }
    }
  );

  /* About section */
  gsap.fromTo('.about-img-card',
    { x: -48, opacity: 0 },
    {
      x: 0, opacity: 1,
      duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-section', start: 'top 72%' }
    }
  );
  gsap.fromTo('.about-text',
    { x: 48, opacity: 0 },
    {
      x: 0, opacity: 1,
      duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-section', start: 'top 72%' }
    }
  );

  /* CTA reveal */
  gsap.fromTo('.cta-h, .cta-sub, .cta-btns',
    { y: 40, opacity: 0 },
    {
      y: 0, opacity: 1,
      duration: .8, stagger: .15, ease: 'power3.out',
      scrollTrigger: { trigger: '.cta-section', start: 'top 72%' }
    }
  );

  /* Count-up on stats */
  document.querySelectorAll('.count-up').forEach(el => {
    const target  = parseInt(el.dataset.target, 10);
    const suffix  = el.dataset.suffix || '';
    const obj     = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 82%',
      once: true,
      onEnter() {
        gsap.to(obj, {
          val: target, duration: 2, ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(obj.val) + suffix; }
        });
      }
    });
  });

})();

/* ── PARALLAX LAYERS ──────────────────────────────────── */
(function initParallax() {
  // Hero background parallax
  gsap.to('.hero-parallax-bg', {
    y: '28%',
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
    }
  });

  // CTA background parallax
  gsap.to('.cta-parallax-bg', {
    y: '-22%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
    }
  });

  // Ticker parallax (subtle scale)
  gsap.from('.ticker', {
    scaleY: 0,
    transformOrigin: 'top',
    duration: .6,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.ticker', start: 'top 90%', once: true }
  });
})();

/* ── NAV SCROLL STATE ─────────────────────────────────── */
(function initNav() {
  const nav = document.querySelector('.nav');
  ScrollTrigger.create({
    start: 'top -60',
    onUpdate(self) { nav.classList.toggle('scrolled', self.progress > 0); }
  });

  // Smooth scroll nav links
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) lenis.scrollTo(target, { offset: -80, duration: 1.4 });
    });
  });
})();

/* ── FAQ ACCORDION ────────────────────────────────────── */
(function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const qEl = item.querySelector('.faq-q');
    if (!qEl) return;

    // Remove any inline onclick to avoid double-handler conflicts
    qEl.removeAttribute('onclick');

    qEl.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // close all
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        const closeAns = o.querySelector('.faq-a, .faq-answer');
        if (closeAns) gsap.to(closeAns, { maxHeight: 0, duration: .3, ease: 'power2.in' });
      });

      if (!isOpen) {
        item.classList.add('open');
        const ans = item.querySelector('.faq-a, .faq-answer');
        if (ans) {
          gsap.fromTo(ans,
            { maxHeight: 0 },
            { maxHeight: ans.scrollHeight + 40, duration: .45, ease: 'power2.out' }
          );
        }
      }
    });
  });
})();

/* ── HOVER TRAIL ──────────────────────────────────────── */
(function initTrail() {
  const hero = document.getElementById('hero');
  if (!hero || window.innerWidth < 768) return;

  const trail = [];
  const maxDots = 8;
  for (let i = 0; i < maxDots; i++) {
    const d = document.createElement('div');
    d.style.cssText = `
      position:fixed;width:4px;height:4px;border-radius:50%;
      background:rgba(255,77,0,${0.6 - i * .07});
      pointer-events:none;z-index:99996;transform:translate(-50%,-50%);
      will-change:transform;
    `;
    document.body.appendChild(d);
    trail.push({ el: d, x: 0, y: 0 });
  }

  let headX = 0, headY = 0;
  document.addEventListener('mousemove', e => { headX = e.clientX; headY = e.clientY; });

  gsap.ticker.add(() => {
    trail[0].x += (headX - trail[0].x) * .4;
    trail[0].y += (headY - trail[0].y) * .4;
    for (let i = 1; i < trail.length; i++) {
      trail[i].x += (trail[i-1].x - trail[i].x) * .35;
      trail[i].y += (trail[i-1].y - trail[i].y) * .35;
    }
    trail.forEach((t, i) => {
      const scale = 1 - i * .1;
      gsap.set(t.el, { x: t.x, y: t.y, scale });
    });
  });
})();

/* ── SERVICE CARD 3D TILT (desktop only) ──────────────── */
(function initCardTilt() {
  if (window.innerWidth <= 768) return;
  document.querySelectorAll('.service-card, .testi-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const cx  = r.left + r.width  / 2;
      const cy  = r.top  + r.height / 2;
      const rx  = ((e.clientY - cy) / (r.height / 2)) * -6;
      const ry  = ((e.clientX - cx) / (r.width  / 2)) *  6;
      gsap.to(card, {
        rotationX: rx, rotationY: ry,
        transformPerspective: 800,
        duration: .35, ease: 'power2.out'
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotationX: 0, rotationY: 0, duration: .6, ease: 'elastic.out(1, .5)' });
    });
  });
})();

/* ── WINDOW RESIZE ────────────────────────────────────── */
window.addEventListener('resize', () => ScrollTrigger.refresh());
