/* pages.js — Semua halaman situs (hash route) + komponen tampilan.
   Setiap halaman menghitung dari LK.store, jadi angka selalu konsisten. */
(function () {
  var TODAY_DAY = { "2026-10": 31, "2026-11": 26, "2026-12": 5 };

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function statCard(label, value, sub, tone) {
    return '<div class="stat ' + (tone || "") + '"><div class="stat-label">' + label +
      '</div><div class="stat-value">' + value + '</div><div class="stat-sub">' + sub + "</div></div>";
  }

  function budgetBar(cat, spent, limit) {
    var p = Math.min(100, LK.pct(spent, limit));
    var over = spent > limit;
    return '<div class="brow"><div class="brow-head"><span class="brow-name">' + cat.icon + " " + cat.name +
      '</span><span class="brow-nums">' + LK.rupiah(spent) + " / " + LK.rupiah(limit) + "</span></div>" +
      '<div class="bar"><div class="bar-fill' + (over ? " over" : "") + '" style="width:' + p + '%"></div></div>' +
      '<div class="brow-foot"><span>' + p + "% terpakai</span><span class='" + (over ? "bad" : "good") + "'>" +
      (over ? "Melebihi " + LK.rupiah(spent - limit) : "Sisa " + LK.rupiah(limit - spent)) + "</span></div></div>";
  }

  function txRow(t, withDel) {
    var c = LK.catById(t.cat);
    return '<tr><td class="d">' + LK.dayLabel(t.date) + '</td><td>' + esc(t.desc) +
      '</td><td><span class="chip" style="--c:' + c.color + '">' + c.icon + " " + c.name +
      '</span></td><td class="amt">− ' + LK.rupiah(t.amount) + "</td>" +
      (withDel ? '<td><button class="mini danger" data-action="del-tx" data-id="' + t.id +
        '" title="Hapus transaksi">✕</button></td>' : "") + "</tr>";
  }

  function billStatus(b, month) {
    if (b.paid) return '<span class="badge ok">Lunas</span>';
    var today = TODAY_DAY[month] || 26;
    if (b.due < today) return '<span class="badge bad">Terlambat ' + (today - b.due) + " hari</span>";
    if (b.due === today) return '<span class="badge warn">Jatuh tempo hari ini</span>';
    return '<span class="badge warn">Jatuh tempo ' + (b.due - today) + " hari lagi</span>";
  }

  /* ---------------- Dasbor ---------------- */
  function dashboard() {
    var m = LK.store.month();
    var income = LK.store.income(m), spent = LK.store.spent(m);
    var rem = income - spent;
    var byCat = LK.store.spentByCat(m);
    var slices = LK.CATEGORIES.map(function (c) {
      return { label: c.name, value: byCat[c.id], color: c.color };
    });
    var legend = LK.CATEGORIES.map(function (c) {
      return '<li><span class="dot" style="background:' + c.color + '"></span><span class="lg-name">' + c.icon + " " + c.name +
        '</span><b>' + LK.rupiah(byCat[c.id]) + "</b><span>" + LK.pct(byCat[c.id], spent) + "%</span></li>";
    }).join("");
    var bills = LK.store.bills(m).filter(function (b) { return !b.paid; });
    var billHtml = bills.length ? bills.map(function (b) {
      return '<li class="bill-mini"><span>' + b.name + " — jatuh tempo tgl " + b.due + "</span><b>" +
        LK.rupiah(b.amount) + "</b>" + billStatus(b, m) + "</li>";
    }).join("") : '<li class="bill-mini">Semua tagihan bulan ini sudah lunas. 🎉</li>';
    var topCats = LK.CATEGORIES.slice().sort(function (a, b) { return byCat[b.id] - byCat[a.id]; }).slice(0, 4);
    var recent = LK.store.txList(m).slice(0, 5);
    var goals = LK.store.goals();

    return '<h1>Dasbor Anggaran</h1>' +
      '<p class="lede">Ringkasan keuangan ' + LK.FAMILY.name + " — " + LK.monthLabel(m) +
      ". Pemasukan, pengeluaran, sisa uang, dan tagihan yang harus dibayar — semua dalam satu layar.</p>" +
      '<section class="stats">' +
      statCard("Pemasukan", LK.rupiah(income), "Gaji + usaha sampingan", "in") +
      statCard("Pengeluaran", LK.rupiah(spent), LK.store.txList(m).length + " transaksi tercatat") +
      statCard("Sisa Uang", LK.rupiah(rem), LK.pct(rem, income) + "% dari pemasukan belum terpakai", "in") +
      statCard("Anggaran Terpakai", LK.store.budgetUsedPct(m) + "%", "dari total batas " + LK.rupiahShort(LK.store.budgetTotal())) +
      "</section>" +
      '<section class="grid2">' +
      '<div class="card"><h2>Pengeluaran per Kategori</h2>' +
      '<div class="donut-wrap"><canvas id="donut" width="200" height="200" role="img" aria-label="Diagram donat pengeluaran per kategori"></canvas>' +
      '<ul class="legend">' + legend + "</ul></div></div>" +
      '<div class="card"><h2>Anggaran Bulan Ini</h2>' +
      topCats.map(function (c) { return budgetBar(c, byCat[c.id], LK.store.state.budgets[c.id]); }).join("") +
      '<p class="more"><a href="#/anggaran">Lihat semua anggaran &rarr;</a></p></div>' +
      "</section>" +
      '<section class="grid2">' +
      '<div class="card"><h2>Tagihan Belum Lunas</h2><ul class="bills">' + billHtml + "</ul>" +
      '<p class="more"><a href="#/tagihan">Kelola semua tagihan &rarr;</a></p></div>' +
      '<div class="card"><h2>Tujuan Tabungan</h2>' +
      goals.map(function (g) {
        var p = LK.pct(g.saved, g.target);
        return '<div class="brow"><div class="brow-head"><span class="brow-name">' + g.name +
          '</span><span class="brow-nums">' + LK.rupiahShort(g.saved) + " / " + LK.rupiahShort(g.target) +
          "</span></div>" + '<div class="bar"><div class="bar-fill gold" style="width:' + p + '%"></div></div>' +
          '<div class="brow-foot"><span>' + p + "% tercapai</span><span>Kurang " + LK.rupiahShort(g.target - g.saved) + "</span></div></div>";
      }).join("") + '<p class="more"><a href="#/tujuan">Tambah tabungan &rarr;</a></p></div>' +
      "</section>" +
      '<section class="card"><h2>Transaksi Terakhir</h2>' +
      '<table class="tx"><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th>Jumlah</th></tr></thead><tbody>' +
      recent.map(function (t) { return txRow(t, false); }).join("") +
      '</tbody></table><p class="more"><a href="#/transaksi">Lihat semua transaksi &rarr;</a></p></section>';
  }

  /* ---------------- Anggaran ---------------- */
  function anggaran() {
    var m = LK.store.month();
    var byCat = LK.store.spentByCat(m);
    var cards = LK.CATEGORIES.map(function (c) {
      var spent = byCat[c.id], limit = LK.store.state.budgets[c.id];
      return '<div class="card">' + budgetBar(c, spent, limit) +
        '<form class="budget-form" data-action="save-budget" data-cat="' + c.id + '">' +
        '<label>Ubah batas <input type="number" name="limit" min="0" step="50000" value="' + limit +
        '" aria-label="Batas anggaran ' + c.name + '"></label>' +
        '<button class="btn small" type="submit">Simpan Batas</button></form></div>';
    }).join("");
    return "<h1>Anggaran Bulanan</h1>" +
      '<p class="lede">Batas belanja tiap kategori untuk ' + LK.monthLabel(m) +
      ". Ubah batasnya kapan saja — progress bar dan total langsung berubah.</p>" +
      '<section class="stats">' +
      statCard("Total Batas Anggaran", LK.rupiah(LK.store.budgetTotal()), "7 kategori") +
      statCard("Sudah Terpakai", LK.rupiah(LK.store.spent(m)), LK.store.budgetUsedPct(m) + "% dari total batas") +
      statCard("Sisa Anggaran", LK.rupiah(Math.max(0, LK.store.budgetTotal() - LK.store.spent(m))),
        "Bisa dialihkan ke tabungan") +
      "</section>" +
      '<section class="grid3">' + cards + "</section>";
  }

  /* ---------------- Transaksi ---------------- */
  function transaksi() {
    var m = LK.store.month();
    var cats = ['<option value="">Semua kategori</option>'].concat(
      LK.CATEGORIES.map(function (c) { return '<option value="' + c.id + '">' + c.name + "</option>"; })).join("");
    var rows = LK.store.txList(m).map(function (t) { return txRow(t, true); }).join("");
    return "<h1>Transaksi</h1>" +
      '<p class="lede">Semua pengeluaran ' + LK.monthLabel(m) +
      " — tambah transaksi baru, saring per kategori, atau hapus yang salah catat. Total di dasbor ikut berubah.</p>" +
      '<section class="card"><h2>Tambah Transaksi</h2>' +
      '<form id="add-tx" class="form-grid">' +
      '<label>Tanggal<input type="date" name="date" value="' + m + '-26" required></label>' +
      '<label>Keterangan<input type="text" name="desc" placeholder="cth: Belanja mingguan pasar" maxlength="80" required></label>' +
      '<label>Kategori<select name="cat">' +
      LK.CATEGORIES.map(function (c) { return '<option value="' + c.id + '">' + c.name + "</option>"; }).join("") +
      '</select></label>' +
      '<label>Jumlah (Rp)<input type="number" name="amount" min="1000" step="1000" placeholder="150000" required></label>' +
      '<button class="btn" type="submit">+ Tambah Transaksi</button></form></section>' +
      '<section class="card"><h2>Daftar Transaksi — ' + LK.store.txList(m).length + ' entri</h2>' +
      '<div class="filters"><select id="filter-cat" aria-label="Saring kategori">' + cats + "</select>" +
      '<input id="filter-q" type="search" placeholder="Cari keterangan…" aria-label="Cari transaksi"></div>' +
      '<table class="tx"><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th>Jumlah</th><th></th></tr></thead>' +
      '<tbody id="tx-body">' + rows + "</tbody></table>" +
      '<p class="more">Total bulan ini: <b>' + LK.rupiah(LK.store.spent(m)) + "</b></p></section>";
  }

  /* ---------------- Tagihan ---------------- */
  function tagihan() {
    var m = LK.store.month();
    var bills = LK.store.bills(m).slice().sort(function (a, b) { return a.due - b.due; });
    var due = LK.store.billsDueTotal(m);
    var cards = bills.map(function (b) {
      return '<div class="card bill-card"><div class="bill-top"><b>' + b.name + "</b>" + billStatus(b, m) + "</div>" +
        '<div class="bill-amt">' + LK.rupiah(b.amount) + '</div><div class="bill-due">Jatuh tempo setiap tanggal ' + b.due + "</div>" +
        (b.paid ? '<p class="good">✓ Sudah dibayar bulan ini</p>'
          : '<button class="btn small" data-action="pay-bill" data-id="' + b.id + '">Tandai Sudah Bayar</button>') +
        "</div>";
    }).join("");
    return "<h1>Tagihan Rutin</h1>" +
      '<p class="lede">Tagihan yang jatuh tempo di ' + LK.monthLabel(m) +
      ". Tandai lunas begitu dibayar supaya tidak ada yang terlewat atau dobel bayar.</p>" +
      '<section class="stats">' +
      statCard("Belum Dibayar", LK.rupiah(due), bills.filter(function (b) { return !b.paid; }).length + " tagihan menunggu") +
      statCard("Total Tagihan Bulan Ini", LK.rupiah(LK.BILLS.reduce(function (s, b) { return s + b.amount; }, 0)), "6 tagihan rutin") +
      statCard("Paling Dekat", bills.filter(function (b) { return !b.paid; }).length ?
        bills.filter(function (b) { return !b.paid; })[0].name + " — tgl " + bills.filter(function (b) { return !b.paid; })[0].due : "Semua lunas 🎉",
        "Cek tanggal jatuh temponya") +
      "</section>" +
      '<section class="grid3">' + cards + "</section>";
  }

  /* ---------------- Tujuan ---------------- */
  function tujuan() {
    var goals = LK.store.goals();
    var cards = goals.map(function (g) {
      var p = LK.pct(g.saved, g.target);
      var monthsLeft = Math.max(1, Math.ceil((g.target - g.saved) / 1000000));
      return '<div class="card"><h2>' + g.name + "</h2>" +
        '<p class="note">' + g.note + "</p>" +
        '<div class="goal-big">' + LK.rupiah(g.saved) + ' <span>dari ' + LK.rupiah(g.target) + "</span></div>" +
        '<div class="bar big"><div class="bar-fill gold" style="width:' + p + '%"></div></div>' +
        '<div class="brow-foot"><span>' + p + "% tercapai</span><span>Kurang " + LK.rupiah(g.target - g.saved) + "</span></div>" +
        '<p class="note">Dengan menyisihkan Rp 1 jt/bulan, tercapai sekitar ' + monthsLeft + " bulan lagi.</p>" +
        '<form class="goal-form" data-action="add-goal" data-id="' + g.id + '">' +
        '<label>Tambah (Rp)<input type="number" name="amount" min="10000" step="10000" placeholder="500000" required></label>' +
        '<button class="btn small" type="submit">+ Masukkan ke Tabungan</button></form></div>';
    }).join("");
    return "<h1>Tujuan Tabungan</h1>" +
      '<p class="lede">Tiga tujuan keluarga — dana darurat, liburan, dan laptop anak. ' +
      "Setiap rupiah yang dimasukkan langsung menambah progress di bawah ini.</p>" +
      '<section class="stats">' +
      statCard("Total Tabungan", LK.rupiah(LK.store.goalsSavedTotal()), "Di tiga tujuan") +
      statCard("Dana Darurat", LK.pct(goals[0].saved, goals[0].target) + "%", LK.rupiahShort(goals[0].saved) + " dari " + LK.rupiahShort(goals[0].target)) +
      statCard("Sisa Bulan Ini", LK.rupiah(LK.store.remaining()), "Bisa dialihkan ke tujuan di atas") +
      "</section>" +
      '<section class="grid3">' + cards + "</section>";
  }

  /* ---------------- Laporan ---------------- */
  function laporan() {
    var sum = LK.store.monthlySummary();
    var rows = sum.map(function (s) {
      return "<tr><td>" + s.label + "</td><td>" + LK.rupiah(s.income) + "</td><td>" + LK.rupiah(s.spent) +
        "</td><td class='" + (s.remaining >= 0 ? "good" : "bad") + "'>" + LK.rupiah(s.remaining) + "</td><td>" +
        (s.over.length ? "⚠️ " + s.over.join(", ") : "Tidak ada") + "</td></tr>";
    }).join("");
    var m = LK.store.month();
    var byCat = LK.store.spentByCat(m);
    var top = LK.CATEGORIES.slice().sort(function (a, b) { return byCat[b.id] - byCat[a.id]; })[0];
    var overNow = LK.CATEGORIES.filter(function (c) { return byCat[c.id] > LK.store.state.budgets[c.id]; });
    var tips = [];
    tips.push("<b>" + top.name + "</b> adalah pengeluaran terbesar bulan ini (" + LK.rupiah(byCat[top.id]) +
      "). Coba cek struk mingguannya — biasanya ada 1–2 pembelian yang bisa ditunda.");
    if (overNow.length) tips.push("Kategori <b>" + overNow.map(function (c) { return c.name; }).join(", ") +
      "</b> sudah melewati batas. Naikkan batasnya atau kurangi belanja minggu depan.");
    else tips.push("Semua kategori masih dalam batas bulan ini — pertahankan sampai akhir bulan.");
    var oktOver = sum[0].over;
    if (oktOver.length) tips.push("Bulan Oktober, <b>" + oktOver.join(", ") +
      "</b> melewati batas. Bandingkan dengan November: belanja harian turun setelah belanja mingguan dijadwalkan.");
    tips.push("Sisa uang bulan ini <b>" + LK.rupiah(LK.store.remaining()) +
      "</b> — pindahkan ke Dana Darurat sebelum habis untuk hal lain.");
    return "<h1>Laporan Bulanan</h1>" +
      '<p class="lede">Perbandingan tiga bulan terakhir: pemasukan tetap, pengeluaran yang terkendali, dan sisa yang masuk tabungan.</p>' +
      '<section class="card"><h2>Pengeluaran per Bulan</h2>' +
      '<canvas id="bars" width="560" height="220" role="img" aria-label="Diagram batang pengeluaran tiga bulan"></canvas></section>' +
      '<section class="card"><h2>Ringkasan Bulanan</h2>' +
      '<table class="tx"><thead><tr><th>Bulan</th><th>Pemasukan</th><th>Pengeluaran</th><th>Sisa</th><th>Melewati Batas</th></tr></thead>' +
      "<tbody>" + rows + "</tbody></table></section>" +
      '<section class="card"><h2>Tips Hemat untuk Keluarga</h2><ul class="tips">' +
      tips.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul></section>";
  }

  LK.pages = {
    dashboard: dashboard, anggaran: anggaran, transaksi: transaksi,
    tagihan: tagihan, tujuan: tujuan, laporan: laporan,
  };
  LK.renderPage = function (route) {
    var fn = LK.pages[route] || dashboard;
    document.getElementById("page").innerHTML = fn();
    if (route === "dashboard" || !route) {
      var d = document.getElementById("donut");
      if (d) {
        var byCat = LK.store.spentByCat();
        LK.drawDonut(d, LK.CATEGORIES.map(function (c) {
          return { label: c.name, value: byCat[c.id], color: c.color };
        }), "Total keluar", LK.rupiahShort(LK.store.spent()));
      }
    }
    if (route === "laporan") {
      var b = document.getElementById("bars");
      if (b) {
        var cols = ["#7a5fb0", "#2e7d4f", "#d9a441"];
        LK.drawBars(b, LK.store.monthlySummary().map(function (s, i) {
          return { label: s.label.split(" ")[0] + " " + s.label.split(" ")[1].slice(2), value: s.spent, color: cols[i] };
        }));
      }
    }
    window.scrollTo(0, 0);
  };
})();
