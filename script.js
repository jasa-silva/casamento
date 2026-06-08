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
    mbway: '+351 900 000 000',
    // URL do Google Apps Script (Web App) que grava na planilha e envia e-mail.
    // Cole aqui o link terminado em /exec depois de fazer o deploy.
    rsvpEndpoint: 'https://script.google.com/macros/s/AKfycbztJ4U-eNtFOI3KAwkxVgwVSEWAyJiKFSB7x7t4M4aRzhvfQRlH9BnZ6ipbPQ4cfCzS/exec',
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
  const submitBtn = $('button[type="submit"]', form);
  form.addEventListener('submit', async (e) => {
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
    // Cópia de segurança local
    try {
      const all = JSON.parse(localStorage.getItem('rsvps') || '[]');
      all.push(data);
      localStorage.setItem('rsvps', JSON.stringify(all));
    } catch (_) {}

    // Envia para o Google Apps Script (planilha + e-mail), se configurado
    if (CONFIG.rsvpEndpoint) {
      submitBtn.disabled = true;
      showFeedback('A enviar a sua confirmação…', true);
      try {
        await fetch(CONFIG.rsvpEndpoint, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(data),
        });
      } catch (_) {
        /* a cópia local fica guardada de qualquer forma */
      }
      submitBtn.disabled = false;
    }

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

  /* ---------- Presentes: copiar IBAN / MB WAY ---------- */
  const ibanEl = $('#ibanValue');
  const mbwayEl = $('#mbwayValue');
  if (ibanEl) ibanEl.textContent = CONFIG.iban;
  if (mbwayEl) mbwayEl.textContent = CONFIG.mbway;
  $$('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const val = btn.dataset.copy === 'mbway' ? CONFIG.mbway : CONFIG.iban;
      const original = btn.textContent;
      try {
        await navigator.clipboard.writeText(val);
        btn.textContent = 'Copiado! ✓';
      } catch (_) {
        btn.textContent = val;
      }
      setTimeout(() => (btn.textContent = original), 2200);
    });
  });

  /* ---------- Adicionar à agenda ---------- */
  {
    // Hora de Portugal (WEST, UTC+1 em setembro): 11h00 → 18h00
    const start = new Date('2026-09-26T11:00:00+01:00');
    const end = new Date('2026-09-26T18:00:00+01:00');
    const fmt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const desc = 'Com todo o nosso amor, esperamos por si!';

    // Google Agenda — abre o evento pré-preenchido
    const gcal =
      'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(CONFIG.eventTitle) +
      '&dates=' + fmt(start) + '/' + fmt(end) +
      '&details=' + encodeURIComponent(desc) +
      '&location=' + encodeURIComponent(CONFIG.eventLocation);
    const gBtn = $('#gcalBtn');
    if (gBtn) gBtn.href = gcal;

    // Apple Agenda / Outlook — descarrega o ficheiro .ics
    const iBtn = $('#icalBtn');
    if (iBtn) {
      iBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const ics = [
          'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//JL Wedding//PT',
          'BEGIN:VEVENT',
          'UID:' + Date.now() + '@jl-wedding',
          'DTSTAMP:' + fmt(new Date()),
          'DTSTART:' + fmt(start),
          'DTEND:' + fmt(end),
          'SUMMARY:' + CONFIG.eventTitle,
          'LOCATION:' + CONFIG.eventLocation,
          'DESCRIPTION:' + desc.replace(/,/g, '\\,'),
          'END:VEVENT', 'END:VCALENDAR',
        ].join('\r\n');
        const blob = new Blob([ics], { type: 'text/calendar' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'casamento-jaqueline-lucas.ics';
        link.click();
        URL.revokeObjectURL(link.href);
      });
    }
  }

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

  // Vídeo do pedido (YouTube) com capa personalizada.
  // Carrega só ao clicar e pausa a música ambiente quando começa a tocar.
  const facade = $('#proposalFacade');
  if (facade) {
    const VIDEO_ID = 'dwF2Nyhmpdg';
    function createPlayer() {
      new YT.Player('proposalPlayer', {
        videoId: VIDEO_ID,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1, autoplay: 1 },
        events: {
          onReady: function (e) { e.target.playVideo(); },
          onStateChange: function (e) {
            if (e.data === YT.PlayerState.PLAYING && !music.paused) music.pause();
          },
        },
      });
    }
    window.onYouTubeIframeAPIReady = createPlayer;
    facade.addEventListener('click', function () {
      facade.classList.add('is-hidden');
      if (!music.paused) music.pause();
      if (window.YT && window.YT.Player) {
        createPlayer();
      } else {
        const yt = document.createElement('script');
        yt.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(yt);
      }
    });
  }
})();
