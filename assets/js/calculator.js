    // ===== Room Space Pills & Expandable Room Size Recommender =====
    const ROOM_CONFIG = {
      bedroom: { label: "🛏️ Bedroom Cooling & Light", fn: p => (p.cat === 'fans' && p.specs[0] === '1200mm') || (p.cat === 'coolers' && p.specs[0] === '36L') || (p.t === 'led' && p.specs[0] === '9W') },
      hall: { label: "🛋️ Living Hall Cooling", fn: p => (p.cat === 'fans' && (p.specs[0] === '1400mm' || p.specs[0] === '400mm')) || (p.cat === 'coolers' && (p.specs[0] === '50L' || p.specs[0] === '65L')) || (p.t === 'led' && p.specs[0] === '18W') },
      kitchen: { label: "🍳 Kitchen Appliances", fn: p => p.cat === 'mixer' || p.cat === 'induction' || p.name.includes('Exhaust') },
      winter: { label: "🚿 Geysers & Irons", fn: p => p.cat === 'iron' },
      wiring: { label: "⚡ House Wiring & LED", fn: p => p.cat === 'elec' }
    };

    const CALC_PRESETS = [
      { id: "sm", title: "10×10 ft Small Room", rec: "900mm Fan, 300mm Table Fan or 36L Cooler", tag: "900mm / 36L", fn: p => p.specs.includes("900mm") || p.specs.includes("300mm") || p.specs.includes("36L") },
      { id: "md", title: "12×15 ft Bedroom", rec: "1200mm 5-Star Ceiling Fan & 50L Cooler", tag: "1200mm / 50L", fn: p => p.specs.includes("1200mm") || p.specs.includes("50L") },
      { id: "lg", title: "15×20 ft Living Hall", rec: "1400mm Fan, 400mm Pedestal & 65L Desert Cooler", tag: "1400mm / 65L", fn: p => p.specs.includes("1400mm") || p.specs.includes("65L") || p.specs.includes("400mm") },
      { id: "wr", title: "AC / Geyser Power Line", rec: "2.5 sq mm FR Copper Wire + 16A Socket", tag: "2.5 sq mm / 16A", fn: p => p.specs.includes("2.5 sq mm") || p.specs.includes("16A") }
    ];

    function renderCalcOptions() {
      $("#calcOptions").innerHTML = CALC_PRESETS.map(c => `
        <button type="button" data-calc="${c.id}" class="text-left bg-white hover:bg-amber-50 border border-amber-300 hover:border-amber-500 rounded-xl p-2.5 transition-all shadow-2xs flex flex-col justify-between">
          <div>
            <span class="inline-block text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 rounded-full px-2 py-0.5">${c.tag}</span>
            <h4 class="font-extrabold text-xs text-ink mt-1.5">${c.title}</h4>
            <p class="text-[11px] text-slate-600 mt-0.5 leading-snug">${c.rec}</p>
          </div>
          <span class="mt-2 text-[11px] font-extrabold text-blue-700">Show matches →</span>
        </button>
      `).join("");

      $$("[data-calc]").forEach(btn => {
        btn.onclick = () => {
          const preset = CALC_PRESETS.find(x => x.id === btn.dataset.calc);
          if (!preset) return;
          cat = "all";
          F.specMatch = preset.fn;
          F.specLabel = preset.title;
          $("#calcBox").classList.add("hidden");
          $("#calcToggleBtn").setAttribute("aria-expanded", "false");
          renderTabs();
          renderGrid();
          toast(`Filtered for ${preset.title}`);
        };
      });
    }

    $("#calcToggleBtn").onclick = () => {
      const box = $("#calcBox");
      const open = box.classList.toggle("hidden");
      $("#calcToggleBtn").setAttribute("aria-expanded", !open);
      $("#calcCaret").style.transform = open ? "rotate(0deg)" : "rotate(180deg)";
    };
    $("#calcCloseBtn").onclick = () => {
      $("#calcBox").classList.add("hidden");
      $("#calcToggleBtn").setAttribute("aria-expanded", "false");
      $("#calcCaret").style.transform = "rotate(0deg)";
    };

    function syncRoomPills() {
      $$(".room-pill").forEach(p => {
        const on = p.dataset.room === activeRoom;
        p.className = "room-pill shrink-0 text-xs font-bold rounded-full px-3 py-1.5 transition-all border " +
          (on ? "bg-blue-600 text-white border-blue-600 shadow-xs" : "bg-white hover:bg-blue-50 border-line text-slate-700");
      });
    }

    $$("[data-room]").forEach(btn => {
      btn.onclick = () => {
        const key = btn.dataset.room;
        if (activeRoom === key) {
          activeRoom = null;
          F.specMatch = null;
          F.specLabel = "";
        } else {
          activeRoom = key;
          cat = "all";
          F.specMatch = ROOM_CONFIG[key].fn;
          F.specLabel = ROOM_CONFIG[key].label;
        }
        syncRoomPills();
        renderTabs();
        renderGrid();
      };
    });

