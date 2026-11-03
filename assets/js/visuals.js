    // ===== Category Visual Themes & Gradients =====
    const COL = {
      fans: ['#0284C7', '#E0F2FE', 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)', 'rgba(2, 132, 199, 0.2)'],
      coolers: ['#0D9488', '#CCFBF1', 'linear-gradient(135deg, #0D9488 0%, #2DD4BF 100%)', 'rgba(13, 148, 136, 0.2)'],
      mixer: ['#EA580C', '#FFEDD5', 'linear-gradient(135deg, #EA580C 0%, #FB923C 100%)', 'rgba(234, 88, 12, 0.2)'],
      induction: ['#E11D48', '#FFE4E6', 'linear-gradient(135deg, #E11D48 0%, #FB7185 100%)', 'rgba(225, 29, 72, 0.2)'],
      iron: ['#7C3AED', '#EDE9FE', 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)', 'rgba(124, 58, 237, 0.2)'],
      elec: ['#D97706', '#FEF3C7', 'linear-gradient(135deg, #D97706 0%, #FBBF24 100%)', 'rgba(217, 119, 6, 0.2)']
    };

    // ===== Curated Real Product Photography with Automatic Animated SVG Fallback =====
    const REAL_PHOTOS = {
      ceiling_fan: "https://commons.wikimedia.org/wiki/Special:FilePath/Ceiling_fan_without_lights.jpg?width=560",
      stand_fan: "https://commons.wikimedia.org/wiki/Special:FilePath/Oscillating_table_fan.jpg?width=560",
      exhaust_fan: "https://commons.wikimedia.org/wiki/Special:FilePath/Kitchen_exhaust_fan.jpg?width=560",
      cooler: "https://commons.wikimedia.org/wiki/Special:FilePath/Evaporative_cooler.jpg?width=560",
      mixer: "https://commons.wikimedia.org/wiki/Special:FilePath/Mixer_grinder.jpg?width=560",
      juicer: "https://commons.wikimedia.org/wiki/Special:FilePath/Electric_blender.jpg?width=560",
      induction: "https://commons.wikimedia.org/wiki/Special:FilePath/Induction_cooker_top.jpg?width=560",
      iron: "https://commons.wikimedia.org/wiki/Special:FilePath/Electric_iron.jpg?width=560",
      geyser: "https://commons.wikimedia.org/wiki/Special:FilePath/Storage_water_heater.jpg?width=560",
      wire: "https://commons.wikimedia.org/wiki/Special:FilePath/Electrical_wires.jpg?width=560",
      switch: "https://commons.wikimedia.org/wiki/Special:FilePath/Light_switches.jpg?width=560",
      led: "https://commons.wikimedia.org/wiki/Special:FilePath/LED_bulbs.jpg?width=560"
    };

    const ART = {
      fan: `<g class="spin-on-hover" fill="#fff">${[0, 120, 240].map(a => `<ellipse cx="60" cy="31" rx="10" ry="22" transform="rotate(${a} 60 60)"/>`).join("")}</g><circle cx="60" cy="60" r="8" fill="#F59E0B" stroke="#fff" stroke-width="2"/>`,
      cooler: `<rect x="32" y="14" width="56" height="86" rx="8" fill="#fff"/><path d="M32 30h56M40 42h40M40 50h40M40 58h40M40 66h40M40 74h40"/><circle cx="44" cy="106" r="4"/><circle cx="76" cy="106" r="4"/><rect x="48" y="20" width="24" height="5" rx="2" fill="#2DD4BF"/>`,
      mixer: `<path d="M42 16h36l-5 52H47z" fill="#fff"/><path d="M40 16h40M54 10h12M44 68v10h32V68"/><rect x="35" y="78" width="50" height="26" rx="6" fill="#fff"/><circle cx="60" cy="91" r="6" fill="#FB923C"/>`,
      induction: `<path d="M22 56h76l8 32H14z" fill="#1E293B"/><path d="M14 88v8a3 3 0 0 0 3 3h86a3 3 0 0 0 3-3v-8" fill="#fff"/><ellipse cx="60" cy="72" rx="23" ry="9" stroke="#FB7185" stroke-width="2.5"/><ellipse cx="60" cy="72" rx="12" ry="4.5" stroke="#F43F5E" stroke-width="2"/><circle cx="88" cy="93" r="2" fill="#F43F5E"/><circle cx="76" cy="93" r="2" fill="#F43F5E"/>`,
      iron: `<path d="M20 82h80c0-18-12-32-32-32H44c-8 0-14 4-18 12z" fill="#fff"/><path d="M20 82v8h80v-8" fill="#DDD6FE"/><path d="M44 50c0-12 8-18 20-18h4"/><circle cx="54" cy="66" r="5" fill="#A78BFA"/>`,
      geyser: `<rect x="34" y="14" width="52" height="84" rx="14" fill="#fff"/><path d="M34 34h52M34 80h52M48 98v10M72 98v10"/><circle cx="60" cy="56" r="9" fill="#DDD6FE"/><path d="M60 51v6" stroke="#EF4444" stroke-width="2.5"/>`,
      wire: `<circle cx="60" cy="60" r="38" fill="#FEF3C7"/><circle cx="60" cy="60" r="26" fill="#FDE68A"/><circle cx="60" cy="60" r="12" fill="#fff"/><path d="M98 60h12" stroke="#D97706" stroke-width="3"/>`,
      switch: `<rect x="26" y="22" width="68" height="76" rx="8" fill="#fff"/><rect x="40" y="36" width="16" height="22" rx="3" fill="#FEF3C7"/><rect x="64" y="36" width="16" height="22" rx="3" fill="#FDE68A"/><circle cx="48" cy="78" r="6"/><circle cx="72" cy="78" r="6"/>`,
      led: `<path d="M60 14a28 28 0 0 0-14 52v8h28v-8a28 28 0 0 0-14-52z" fill="#FEF9C3"/><path d="M48 82h24M50 90h20M54 98h12"/><path d="M52 40l8 14 8-14" stroke="#F59E0B" stroke-width="2.5"/>`
    };

    function getPhotoUrl(p) {
      if (p.img) return BASE + p.img; // local photo dropped into assets/img/products/<slug>.jpg|png|webp
      if (p.t === 'fan') {
        if (p.name.includes('Exhaust')) return REAL_PHOTOS.exhaust_fan;
        if (p.name.includes('Pedestal') || p.name.includes('Table') || p.name.includes('Wall')) return REAL_PHOTOS.stand_fan;
        return REAL_PHOTOS.ceiling_fan;
      }
      if (p.t === 'mixer' && p.name.includes('Juicer')) return REAL_PHOTOS.juicer;
      return REAL_PHOTOS[p.t] || REAL_PHOTOS.ceiling_fan;
    }

    const pic = (p, sw = 1.65) => {
      const url = getPhotoUrl(p);
      return `<div class="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg sm:rounded-xl">
        <svg viewBox="0 0 120 120" class="w-4/5 h-4/5" fill="#fff" fill-opacity=".85" stroke="${COL[p.cat][0]}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ART[p.t]}</svg>
        <img src="${url}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'" class="prod-img absolute inset-0 w-full h-full object-cover rounded-lg sm:rounded-xl">
      </div>`;
    };

