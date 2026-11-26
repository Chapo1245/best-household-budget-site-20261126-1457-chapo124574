/* controls.js — Semua kontrol interaktif: tambah/hapus transaksi,
   saring daftar, ubah batas anggaran, tandai tagihan lunas, isi tabungan.
   Delegasi event di document: tetap bekerja setiap kali halaman di-render ulang. */
(function () {
  function rerender() { LK.renderPage(LK.currentRoute || "dashboard"); LK.renderMonthBar(); }

  document.addEventListener("submit", function (ev) {
    var form = ev.target;
    var action = form.getAttribute("data-action");
    if (form.id === "add-tx") {
      ev.preventDefault();
      var fd = new FormData(form);
      var amount = parseInt(fd.get("amount"), 10);
      var desc = String(fd.get("desc") || "").trim();
      var date = String(fd.get("date") || "");
      if (!desc || !date || !(amount > 0)) return;
      LK.store.addTx({ date: date, desc: desc, cat: String(fd.get("cat")), amount: amount });
      rerender();
      var note = document.getElementById("page");
      if (note) note.insertAdjacentHTML("afterbegin",
        '<p class="flash">✓ Transaksi "' + desc.replace(/</g, "&lt;") + '" (' + LK.rupiah(amount) +
        ') ditambahkan — total & chart ikut berubah.</p>');
      return;
    }
    if (action === "save-budget") {
      ev.preventDefault();
      var val = parseInt(new FormData(form).get("limit"), 10);
      if (!(val >= 0)) return;
      LK.store.setBudget(form.getAttribute("data-cat"), val);
      rerender();
      return;
    }
    if (action === "add-goal") {
      ev.preventDefault();
      var amt = parseInt(new FormData(form).get("amount"), 10);
      if (!(amt > 0)) return;
      LK.store.addToGoal(form.getAttribute("data-id"), amt);
      rerender();
      return;
    }
  });

  document.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-action]");
    if (!el) return;
    var action = el.getAttribute("data-action");
    if (action === "del-tx") {
      if (!window.confirm("Hapus transaksi ini?")) return;
      LK.store.deleteTx(el.getAttribute("data-id"));
      rerender();
    } else if (action === "pay-bill") {
      LK.store.payBill(el.getAttribute("data-id"));
      rerender();
    } else if (action === "month") {
      LK.store.setMonth(el.getAttribute("data-month"));
      rerender();
    } else if (action === "reset") {
      if (!window.confirm("Kembalikan semua data ke contoh awal?")) return;
      LK.store.reset();
      rerender();
    }
  });

  /* Saring transaksi: kategori + kata kunci, tanpa reload halaman. */
  document.addEventListener("input", function (ev) {
    if (ev.target.id !== "filter-cat" && ev.target.id !== "filter-q") return;
    var cat = (document.getElementById("filter-cat") || {}).value || "";
    var q = ((document.getElementById("filter-q") || {}).value || "").toLowerCase();
    var rows = document.querySelectorAll("#tx-body tr");
    rows.forEach(function (tr) {
      var text = tr.textContent.toLowerCase();
      var catOk = !cat || tr.querySelector(".chip").textContent.indexOf(LK.catById(cat).name) !== -1;
      tr.style.display = (!catOk || (q && text.indexOf(q) === -1)) ? "none" : "";
    });
  });
})();
