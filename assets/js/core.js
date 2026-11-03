    // ===== Store Configuration =====
    const WA_NUMBER = (window.BHE && BHE.site && BHE.site.whatsapp) || "91XXXXXXXXXX";
    const STORE = "Bombay Hardware and Electricals (Bhootnath Road)";
    // Missing elements return a harmless stub so one shared codebase works on every page
    const NIL = new Proxy(function () {}, { get: (t, k) => k === Symbol.toPrimitive ? () => "" : k === "length" ? 0 : NIL, set: () => true, apply: () => NIL });
    const $ = s => document.querySelector(s) || NIL;
    const $$ = s => document.querySelectorAll(s);

    // ===== Icon Library =====
    const IC = {
      pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
      search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
      bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>',
      shield: '<path d="M12 2 4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5z"/><path d="m9 12 2 2 4-4"/>',
      truck: '<path d="M1 6h13v11H1zM14 10h4l3 3v4h-7"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
      award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/>',
      store: '<path d="M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6"/>',
      x: '<path d="M18 6 6 18M6 6l12 12"/>',
      minus: '<path d="M5 12h14"/>',
      plus: '<path d="M5 12h14M12 5v14"/>',
      check: '<path d="M20 6 9 17l-5-5"/>',
      phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9z"/>',
      clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
      zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
      wa: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-.8.8c-.8-.4-1.6-1.2-2-2l.8-.8-1-2z"/>',
      all: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
      fan: '<circle cx="12" cy="12" r="1.8"/><path d="M12 10c0-6 5-7 5-4s-3 4-5 4zM14 12c6 0 7 5 4 5s-4-3-4-5zM12 14c0 6-5 7-5 4s3-4 5-4zM10 12c-6 0-7-5-4-5s4 3 4 5z"/>',
      snow: '<path d="M12 2v20M4.9 7l14.2 10M4.9 17 19.1 7"/>',
      mixer: '<path d="M7 3h10l-1.5 11h-7zM9 14v3h6v-3M8 21h8"/>',
      pot: '<path d="M3 11h18v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM1 11h22M8 7V5M12 7V4M16 7V5"/>',
      plug: '<path d="M12 22v-5M9 8V2M15 8V2M18 8v5a6 6 0 0 1-12 0V8z"/>',
      filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5z"/>',
      heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
      layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>'
    };

    const ic = (n, s = 18, f) =>
      `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${f ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;

    const hydrate = r => r.querySelectorAll("[data-i]:empty").forEach(e => {
      e.innerHTML = ic(e.dataset.i, +e.dataset.s || 18);
    });

