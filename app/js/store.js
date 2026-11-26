/* store.js — State aplikasi + localStorage + semua hitungan.
   Semua angka halaman berasal dari sini, dihitung dari LK data. */
(function () {
  var KEY = "lumbungkeluarga-v1";
  var SHOT = new URLSearchParams(location.search).has("shot");

  function seedState() {
    return {
      month: "2026-11",
      budgets: JSON.parse(JSON.stringify(LK.BUDGETS)),
      tx: JSON.parse(JSON.stringify(LK.TX)),
      paidBills: JSON.parse(JSON.stringify(LK.PAID_BILLS)),
      goals: JSON.parse(JSON.stringify(LK.GOALS)),
    };
  }

  var state = seedState();
  if (!SHOT) {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        if (saved && saved.tx && saved.budgets) state = saved;
      }
    } catch (e) { /* localStorage tidak tersedia — pakai data contoh */ }
  }

  function save() {
    if (SHOT) return; /* mode screenshot: deterministik, jangan simpan */
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  LK.store = {
    isShot: SHOT,
    state: state,
    save: save,
    reset: function () { state = seedState(); save(); },

    month: function () { return state.month; },
    setMonth: function (m) { state.month = m; save(); },

    income: function (m) {
      m = m || state.month;
      return LK.INCOME[m].reduce(function (s, x) { return s + x.amount; }, 0);
    },
    txList: function (m) {
      m = m || state.month;
      return (state.tx[m] || []).slice().sort(function (a, b) {
        return b.date.localeCompare(a.date) || b.id.localeCompare(a.id);
      });
    },
    spent: function (m) {
      m = m || state.month;
      return (state.tx[m] || []).reduce(function (s, x) { return s + x.amount; }, 0);
    },
    spentByCat: function (m) {
      m = m || state.month;
      var out = {};
      LK.CATEGORIES.forEach(function (c) { out[c.id] = 0; });
      (state.tx[m] || []).forEach(function (t) {
        if (out[t.cat] === undefined) out[t.cat] = 0;
        out[t.cat] += t.amount;
      });
      return out;
    },
    remaining: function (m) { return LK.store.income(m) - LK.store.spent(m); },
    budgetTotal: function () {
      return LK.CATEGORIES.reduce(function (s, c) { return s + (state.budgets[c.id] || 0); }, 0);
    },
    budgetUsedPct: function (m) {
      return LK.pct(LK.store.spent(m), LK.store.budgetTotal());
    },

    addTx: function (tx) {
      tx.id = "u-" + Date.now().toString(36);
      state.tx[state.month] = state.tx[state.month] || [];
      state.tx[state.month].push(tx);
      save();
      return tx;
    },
    deleteTx: function (id) {
      var list = state.tx[state.month] || [];
      state.tx[state.month] = list.filter(function (t) { return t.id !== id; });
      save();
    },
    setBudget: function (cat, amount) {
      state.budgets[cat] = Math.max(0, Math.round(amount));
      save();
    },

    bills: function (m) {
      m = m || state.month;
      var paid = state.paidBills[m] || [];
      return LK.BILLS.map(function (b) {
        return {
          id: b.id, name: b.name, amount: b.amount, due: b.due,
          paid: paid.indexOf(b.id) !== -1,
        };
      });
    },
    billsDueTotal: function (m) {
      return LK.store.bills(m).filter(function (b) { return !b.paid; })
        .reduce(function (s, b) { return s + b.amount; }, 0);
    },
    payBill: function (id) {
      var m = state.month;
      state.paidBills[m] = state.paidBills[m] || [];
      if (state.paidBills[m].indexOf(id) === -1) state.paidBills[m].push(id);
      save();
    },

    goals: function () { return state.goals; },
    addToGoal: function (id, amount) {
      for (var i = 0; i < state.goals.length; i++) {
        if (state.goals[i].id === id) {
          state.goals[i].saved = Math.min(
            state.goals[i].target,
            state.goals[i].saved + Math.max(0, Math.round(amount)));
        }
      }
      save();
    },
    goalsSavedTotal: function () {
      return state.goals.reduce(function (s, g) { return s + g.saved; }, 0);
    },

    /* Ringkasan 3 bulan untuk halaman Laporan. */
    monthlySummary: function () {
      return LK.MONTHS.map(function (mo) {
        var byCat = LK.store.spentByCat(mo.id);
        var over = LK.CATEGORIES.filter(function (c) {
          return byCat[c.id] > state.budgets[c.id];
        }).map(function (c) { return c.name; });
        return {
          id: mo.id, label: mo.label,
          income: LK.store.income(mo.id),
          spent: LK.store.spent(mo.id),
          remaining: LK.store.remaining(mo.id),
          over: over,
        };
      });
    },
  };
})();
