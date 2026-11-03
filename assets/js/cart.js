    // ===== Shopping Bag & WhatsApp Checkout =====
    function renderCart() {
      const ids = Object.keys(cart).map(Number).filter(i => byId(i));
      const count = ids.reduce((s, i) => s + cart[i], 0);
      const total = ids.reduce((s, i) => s + cart[i] * byId(i).price, 0);
      const totalMrp = ids.reduce((s, i) => s + cart[i] * byId(i).mrp, 0);
      const savedAmt = totalMrp - total;

      $("#cartCount").textContent = count;
      $("#cartTotal").textContent = inr(total);
      $("#total").textContent = inr(total);
      $("#savedSummary").textContent = savedAmt > 0 ? `You save ${inr(savedAmt)} on MRP!` : "Incl. GST";
      $("#clearBagBtn").classList.toggle("hidden", !ids.length);

      $("#cartItems").innerHTML = ids.length
        ? ids.map(i => {
            const p = byId(i);
            return `<div class="flex gap-2.5 items-center bg-white border border-line rounded-xl p-2.5 shadow-2xs">
              <button type="button" data-qv="${i}" class="w-14 h-14 shrink-0 rounded-lg p-1 relative overflow-hidden" style="background:${COL[p.cat][1]}" aria-label="View ${p.name}">${pic(p, 2)}</button>
              <div class="flex-1 min-w-0">
                <div class="text-xs sm:text-sm font-extrabold leading-snug clamp1 text-ink">${p.name}</div>
                <div class="text-[11px] text-slate-500 mt-0.5">${cap(p.brand)} · ${p.specs[0]} · <span class="font-mono font-bold text-ink">${inr(p.price)}</span></div>
                <div class="mt-1.5 flex items-center justify-between">
                  <div class="flex items-center border border-line rounded-full bg-slate-100">
                    <button type="button" data-d="${i}" class="w-6 h-6 grid place-items-center hover:bg-slate-200 rounded-full" aria-label="Decrease quantity">${ic("minus", 12)}</button>
                    <span class="w-6 text-center text-xs font-mono font-extrabold">${cart[i]}</span>
                    <button type="button" data-u="${i}" class="w-6 h-6 grid place-items-center hover:bg-slate-200 rounded-full" aria-label="Increase quantity">${ic("plus", 12)}</button>
                  </div>
                  <div class="text-right">
                    <b class="text-xs sm:text-sm font-mono font-extrabold text-ink block">${inr(p.price * cart[i])}</b>
                    <span class="text-[10px] font-bold text-emerald-700">Save ${inr(saveOf(p) * cart[i])}</span>
                  </div>
                </div>
              </div>
            </div>`;
          }).join("")
        : `<div class="text-center text-slate-500 text-xs sm:text-sm py-16">
            <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto mb-2.5 grid place-items-center">${ic("bag", 22)}</div>
            <p class="font-extrabold text-sm text-ink">Your bag is empty</p>
            <p class="text-xs text-slate-500 mt-1">Add appliances to send your order on WhatsApp.</p>
          </div>`;
    }

    $("#cartItems").addEventListener("click", e => {
      const u = e.target.closest("[data-u]"), d = e.target.closest("[data-d]");
      if (u) cart[u.dataset.u]++;
      if (d) {
        const i = d.dataset.d;
        if (--cart[i] <= 0) delete cart[i];
      }
      save();
      renderCart();
      renderGrid();
      renderSpotlight();
    });

    $("#clearBagBtn").onclick = () => {
      cart = {};
      save();
      renderCart();
      renderGrid();
      renderSpotlight();
      toast("Bag cleared");
    };

    function setMode(m) {
      mode = m;
      [["#dHome", "Home Delivery (Patna)"], ["#dPick", "Store Pickup (Bhootnath Rd)"]].forEach(([s, v]) => {
        const on = v === m;
        $(s).className = "rounded-full py-1.5 text-xs transition-all " + (on ? "bg-blue-600 text-white font-extrabold shadow-2xs" : "text-slate-600 font-semibold");
      });
      const h = m.startsWith("Home");
      $("#addr").disabled = !h;
      $("#addr").classList.toggle("opacity-50", !h);
    }

    $("#dHome").onclick = () => setMode("Home Delivery (Patna)");
    $("#dPick").onclick = () => setMode("Store Pickup (Bhootnath Rd)");

    const openCart = () => {
      $("#drawer").classList.remove("translate-x-full");
      $("#overlay").classList.remove("hidden");
    };
    const closeCart = () => {
      $("#drawer").classList.add("translate-x-full");
      $("#overlay").classList.add("hidden");
    };

    $("#cartBtn").onclick = openCart;
    $("#closeCart").onclick = closeCart;
    $("#overlay").onclick = closeCart;

    const newOrderId = () => { const d = new Date(), z = n => String(n).padStart(2, "0"); return "BHE" + String(d.getFullYear()).slice(2) + z(d.getMonth() + 1) + z(d.getDate()) + "-" + Math.random().toString(36).slice(2, 6).toUpperCase(); };
    function saveOrder(order) {
      const url = (BHE.site && BHE.site.ordersUrl) || ""; if (!url) return;
      try { fetch(url, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ ...order, when: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }), page: location.href }) }).catch(() => {}); } catch (e) {}
    }
    $("#checkout").onclick = () => {
      const ids = Object.keys(cart).map(Number).filter(i => byId(i));
      const err = $("#formErr");
      const name = $("#custName").value.trim();
      const phone = $("#custPhone").value.trim();
      const addr = $("#addr").value.trim();
      const fail = m => {
        err.textContent = m;
        err.classList.remove("hidden");
      };
      if (!ids.length) return fail("Your bag is empty. Add a product first.");
      if (!name) return fail("Please enter your name.");
      if (phone.replace(/\D/g, "").length < 10) return fail("Enter a valid 10-digit mobile number.");
      if (mode.startsWith("Home") && !addr) return fail("Enter a delivery landmark or address.");
      err.classList.add("hidden");
      const orderId = newOrderId();
      saveOrder({ id: orderId, name, phone, mode, flags: checkOrderDetails(name, phone), address: mode.startsWith("Home") ? addr : "", total: ids.reduce((s, i) => s + cart[i] * byId(i).price, 0), items: ids.map(i => ({ name: byId(i).name, brand: cap(byId(i).brand), specs: byId(i).specs.join(" / "), qty: cart[i], price: byId(i).price })) });

      const total = ids.reduce((s, i) => s + cart[i] * byId(i).price, 0);
      const lines = ids.map((i, n) => {
        const p = byId(i);
        return (n + 1) + ". " + p.name + " (" + cap(p.brand) + " - " + p.specs.join(", ") + ") x " + cart[i] + " = " + inr(p.price * cart[i]);
      }).join("\n");

      toast("Order " + orderId + " sent to WhatsApp. Keep this reference.");
      window.open(
        waLink(
          "Hello " + STORE + ", I would like to order.\nOrder ID: " + orderId + "\n\n" +
          lines +
          "\n\nTotal Estimated Value: " + inr(total) +
          "\n\nName: " + name +
          "\nPhone: " + phone +
          "\nDelivery: " + mode +
          (mode.startsWith("Home") ? "\nAddress/Landmark: " + addr : "")
        ),
        "_blank"
      );
    };

