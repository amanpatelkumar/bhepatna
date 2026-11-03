    // ===== Search ranking: synonyms (Hindi and common words), spelling tolerance, relevance order =====
    // rankProducts(query, products, labelOf) -> products that match, best match first. Pure function (no page state).
    const SR_PHRASES = [["water heater", "geyser"], ["air cooler", "cooler"], ["mixer grinder", "mixer"], ["steam iron", "iron"], ["ceiling fan", "fan"], ["table fan", "fan"], ["wall fan", "fan"], ["exhaust fan", "fan"], ["induction cooktop", "induction"], ["copper wire", "wire"], ["house wire", "wire"], ["modular switch", "switch"], ["led bulb", "led"], ["tube light", "led"], ["tubelight", "led"], ["switch board", "switch"]];
    const SR_WORDS = { pankha: "fan", pankhe: "fan", fans: "fan", cooling: "cooler", coolers: "cooler", geysers: "geyser", heater: "geyser", garam: "geyser", istri: "iron", irons: "iron", grinder: "mixer", blender: "mixer", juicer: "mixer", mixers: "mixer", cooktop: "induction", stove: "induction", cable: "wire", wires: "wire", cables: "wire", bulb: "led", bulbs: "led", light: "led", lights: "led", tube: "led", socket: "switch", sockets: "switch", switches: "switch", board: "switch" };
    const SR_STOP = new Set(["the", "a", "an", "and", "of", "for", "in", "with", "to", "me", "my", "show", "find", "best", "price", "buy", "get"]);
    const srNorm = s => String(s || "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
    function srTokens(q) {
      let s = " " + srNorm(q) + " ";
      SR_PHRASES.forEach(([a, b]) => { s = s.split(" " + a + " ").join(" " + b + " ") });
      return s.trim().split(" ").filter(t => t && !SR_STOP.has(t)).map(t => SR_WORDS[t] || (t.length > 3 && t.endsWith("s") ? t.slice(0, -1) : t));
    }
    function srDist(a, b) {
      if (Math.abs(a.length - b.length) > 2) return 9;
      let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
      for (let i = 1; i <= a.length; i++) {
        const cur = [i];
        for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = cur;
      }
      return prev[b.length];
    }
    const srWords = text => srNorm(text).split(" ").filter(Boolean);
    function srFieldScore(token, words, weight) {
      let best = 0;
      for (const w of words) {
        if (w === token) return weight;
        if (token.length >= 2 && w.startsWith(token)) best = Math.max(best, weight * 0.8);
        else if (token.length >= 5 && best < weight * 0.5 && srDist(w, token) <= (token.length >= 8 ? 2 : 1)) best = Math.max(best, weight * 0.5);
      }
      return best;
    }
    function srScore(p, tokens, labelOf, anyMode) {
      const label = labelOf ? labelOf(p) : "";
      const fields = [[srWords(p.name), 5], [srWords(p.brand), 5], [srWords(label + " " + String(p.group).replace(/-/g, " ")), 3], [srWords(p.specs.join(" ")), 3], [srWords(p.desc), 1]];
      let total = 0;
      for (const t of tokens) {
        let best = 0;
        for (const [words, w] of fields) best = Math.max(best, srFieldScore(t, words, w));
        if (best === 0 && !anyMode) return 0;
        total += best;
      }
      return total;
    }
    function rankProducts(q, list, labelOf) {
      const tokens = srTokens(q);
      if (!tokens.length) return list.slice();
      let scored = list.map(p => ({ p, s: srScore(p, tokens, labelOf, false) })).filter(x => x.s > 0);
      if (!scored.length && tokens.length > 1) scored = list.map(p => ({ p, s: srScore(p, tokens, labelOf, true) })).filter(x => x.s > 0);
      scored.sort((a, b) => b.s - a.s || (a.p.pos || 0) - (b.p.pos || 0));
      return scored.map(x => x.p);
    }
    const srLabel = p => ((BHE.sections || []).find(s => s.id === p.group) || {}).label || "";
