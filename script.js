/* ===================================================================
   Jaqueline & Lucas — Interatividade
   =================================================================== */
(function () {
  'use strict';

  // Configuração editável -------------------------------------------------
  const CONFIG = {
    weddingDate: '2026-09-26T00:00:00',
    eventTitle: 'Casamento de Jaqueline & Lucas',
    eventLocation: 'Quinta de Marzovelos, R. Qta de Baixo n.º 2 B, 3510-014 Viseu',
    iban: 'PT50 0000 0000 0000 0000 0000 0',
    galleryCount: 10,
  };

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Loader ---------- */
  window.addEventListener('load', () => {
    setTimeout(() => $('#loader').classList.add('is-done'), 1600);
  });

  /* ---------- Navegação ---------- */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = $('#burger');
  const navLinks = $('#navLinks');
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('is-open');
    burger.classList.toggle('is-active');
  });
  $$('#navLinks a').forEach((a) =>
    a.addEventListener('click', () => navLinks.classList.remove('is-open'))
  );

  /* ---------- Pétalas a cair ---------- */
  const petals = $('#petals');
  if (petals && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('span');
      p.className = 'petal';
      const size = 8 + Math.random() * 12;
      p.style.left = Math.random() * 100 + '%';
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.animationDuration = 7 + Math.random() * 9 + 's';
      p.style.animationDelay = Math.random() * 10 + 's';
      p.style.opacity = 0.3 + Math.random() * 0.4;
      petals.appendChild(p);
    }
  }

  /* ---------- Contagem decrescente ---------- */
  const target = new Date(CONFIG.weddingDate).getTime();
  const cd = {
    d: $('#cd-days'), h: $('#cd-hours'), m: $('#cd-min'), s: $('#cd-sec'),
  };
  const pad = (n) => String(n).padStart(2, '0');
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      cd.d.textContent = cd.h.textContent = cd.m.textContent = cd.s.textContent = '00';
      $('#contagem .script-title').textContent = 'Hoje é o grande dia! 🎉';
      return;
    }
    cd.d.textContent = pad(Math.floor(diff / 864e5));
    cd.h.textContent = pad(Math.floor((diff % 864e5) / 36e5));
    cd.m.textContent = pad(Math.floor((diff % 36e5) / 6e4));
    cd.s.textContent = pad(Math.floor((diff % 6e4) / 1e3));
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Galeria (Unsplash) ---------- */
  const galleryGrid = $('#galleryGrid');
  const photos = [
    'galeria-06.jpg', 'galeria-01.jpg', 'galeria-02.jpg', 'galeria-03.jpg',
    'galeria-04.jpg', 'galeria-07.jpg', 'galeria-05.jpg', 'galeria-08.jpg',
    'galeria-09.jpg', 'galeria-10.jpg',
  ];
  const galleryUrls = [];
  photos.slice(0, CONFIG.galleryCount).forEach((url, i) => {
    galleryUrls.push(url);
    const item = document.createElement('div');
    item.className = 'gallery__item reveal-up';
    item.style.setProperty('--d', i * 0.06 + 's');
    item.dataset.index = i;
    item.innerHTML = `<img src="${url}" alt="Momento ${i + 1} de Jaqueline e Lucas" loading="lazy" />`;
    galleryGrid.appendChild(item);
  });

  /* ---------- Lightbox ---------- */
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightboxImg');
  let currentIdx = 0;
  function openLightbox(idx) {
    currentIdx = idx;
    lightboxImg.src = galleryUrls[idx];
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function navLightbox(dir) {
    currentIdx = (currentIdx + dir + galleryUrls.length) % galleryUrls.length;
    lightboxImg.src = galleryUrls[currentIdx];
  }
  galleryGrid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery__item');
    if (item) openLightbox(Number(item.dataset.index));
  });
  $('.lightbox__close').addEventListener('click', closeLightbox);
  $('.lightbox__nav--prev').addEventListener('click', () => navLightbox(-1));
  $('.lightbox__nav--next').addEventListener('click', () => navLightbox(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  $$('.reveal, .reveal-up').forEach((el) => io.observe(el));

  /* ---------- FAQ acordeão ---------- */
  $$('.faq__item').forEach((item) => {
    const q = $('.faq__q', item);
    const a = $('.faq__a', item);
    q.addEventListener('click', () => {
      const open = item.classList.contains('is-open');
      $$('.faq__item').forEach((other) => {
        other.classList.remove('is-open');
        $('.faq__a', other).style.maxHeight = null;
      });
      if (!open) {
        item.classList.add('is-open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- RSVP ---------- */
  const form = $('#rsvpForm');
  const guestsField = $('#guestsField');
  const feedback = $('#rsvpFeedback');
  $$('input[name="attend"]').forEach((r) =>
    r.addEventListener('change', () => {
      guestsField.classList.toggle('is-visible', r.value === 'sim' && r.checked);
    })
  );
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#name').value.trim();
    const attend = (form.querySelector('input[name="attend"]:checked') || {}).value;
    if (!name) { showFeedback('Por favor, indique o seu nome. 🙏', false); return; }
    if (!attend) { showFeedback('Diga-nos se poderá estar connosco. 💌', false); return; }

    const data = {
      name,
      email: $('#email').value.trim(),
      attend,
      guests: attend === 'sim' ? $('#guests').value : 0,
      message: $('#message').value.trim(),
      diet: $('#diet').value.trim(),
      at: new Date().toISOString(),
    };
    // Guarda localmente (substitua por um endpoint real se desejar)
    try {
      const all = JSON.parse(localStorage.getItem('rsvps') || '[]');
      all.push(data);
      localStorage.setItem('rsvps', JSON.stringify(all));
    } catch (_) {}

    if (attend === 'sim') {
      showFeedback(`Obrigado, ${name.split(' ')[0]}! Mal podemos esperar por si. 🥂`, true);
      celebrate();
    } else {
      showFeedback(`Vamos sentir a sua falta, ${name.split(' ')[0]}. Obrigado por avisar. 💛`, true);
    }
    form.reset();
    guestsField.classList.remove('is-visible');
  });
  function showFeedback(msg, ok) {
    feedback.textContent = msg;
    feedback.className = 'rsvp__feedback ' + (ok ? 'is-ok' : 'is-err');
  }

  /* ---------- Confettis ---------- */
  function celebrate() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const colors = ['#c2a878', '#1f3b5c', '#5e7da6', '#fffdf9', '#a98c5b'];
    for (let i = 0; i < 90; i++) {
      const c = document.createElement('div');
      c.style.cssText = `position:fixed;z-index:700;top:-10px;left:${Math.random() * 100}vw;width:${6 + Math.random() * 8}px;height:${6 + Math.random() * 8}px;background:${colors[i % colors.length]};border-radius:${Math.random() > 0.5 ? '50%' : '2px'};pointer-events:none;opacity:.9;`;
      document.body.appendChild(c);
      const fall = 2500 + Math.random() * 2000;
      c.animate(
        [
          { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
          { transform: `translateY(105vh) rotate(${Math.random() * 720}deg)`, opacity: 0 },
        ],
        { duration: fall, easing: 'cubic-bezier(.2,.7,.3,1)' }
      ).onfinish = () => c.remove();
    }
  }

  /* ---------- Modal PIX/IBAN ---------- */
  const pixModal = $('#pixModal');
  $('#ibanValue').textContent = CONFIG.iban;
  $$('[data-modal="pix"]').forEach((b) =>
    b.addEventListener('click', () => {
      pixModal.classList.add('is-open');
      pixModal.setAttribute('aria-hidden', 'false');
    })
  );
  $$('[data-close]', pixModal).forEach((el) =>
    el.addEventListener('click', () => {
      pixModal.classList.remove('is-open');
      pixModal.setAttribute('aria-hidden', 'true');
    })
  );
  $('#copyIban').addEventListener('click', async (e) => {
    try {
      await navigator.clipboard.writeText(CONFIG.iban);
      e.target.textContent = 'IBAN copiado! ✓';
      setTimeout(() => (e.target.textContent = 'Copiar IBAN'), 2200);
    } catch (_) {
      e.target.textContent = CONFIG.iban;
    }
  });

  /* ---------- Adicionar à agenda (.ics) ---------- */
  $('#calBtn').addEventListener('click', (e) => {
    e.preventDefault();
    const start = new Date(CONFIG.weddingDate);
    start.setHours(11, 0, 0, 0); // cerimónia/receção às 11h00
    const end = new Date(start.getTime() + 7 * 36e5); // 11h00 → 18h00
    const fmt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//JL Wedding//PT',
      'BEGIN:VEVENT',
      'UID:' + Date.now() + '@jl-wedding',
      'DTSTAMP:' + fmt(new Date()),
      'DTSTART:' + fmt(start),
      'DTEND:' + fmt(end),
      'SUMMARY:' + CONFIG.eventTitle,
      'LOCATION:' + CONFIG.eventLocation,
      'DESCRIPTION:Com todo o nosso amor\\, esperamos por si!',
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'casamento-jaqueline-lucas.ics';
    link.click();
    URL.revokeObjectURL(link.href);
  });

  /* ---------- Música — "Só Você" (Anderson Freire) ----------
     Substitua o <source> do #bgMusic (no index.html) pelo ficheiro
     da vossa música. Os dois botões (flutuante e da secção "A Nossa
     Música") controlam o mesmo áudio e ficam sincronizados. */
  const music = $('#bgMusic');
  const musicBtn = $('#musicToggle');
  const songBtn = $('#songPlay');
  const songText = songBtn ? $('.song__play-text', songBtn) : null;

  function syncMusicUI() {
    const on = !music.paused;
    musicBtn.classList.toggle('is-playing', on);
    if (songBtn) {
      songBtn.classList.toggle('is-playing', on);
      if (songText) songText.textContent = on ? 'A tocar a nossa música' : 'Tocar a nossa música';
    }
  }
  function toggleMusic() {
    if (music.paused) {
      music.volume = 0.45;
      music.play().catch(() => {});
    } else {
      music.pause();
    }
  }
  musicBtn.addEventListener('click', toggleMusic);
  if (songBtn) songBtn.addEventListener('click', toggleMusic);
  music.addEventListener('play', syncMusicUI);
  music.addEventListener('pause', syncMusicUI);

  // Vídeo do pedido (YouTube) — pausa a música ambiente quando começa a tocar
  if ($('#proposalPlayer')) {
    window.onYouTubeIframeAPIReady = function () {
      new YT.Player('proposalPlayer', {
        videoId: 'lfA6qLqBcMU',
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onStateChange: function (e) {
            if (e.data === YT.PlayerState.PLAYING && !music.paused) music.pause();
          },
        },
      });
    };
    const yt = document.createElement('script');
    yt.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(yt);
  }
})();
