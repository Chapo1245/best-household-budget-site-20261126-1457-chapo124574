/* main.js — Init + router hash + bilah bulan.
   Route: #/dashboard #/anggaran #/transaksi #/tagihan #/tujuan #/laporan. */
(function () {
  LK.currentRoute = "dashboard";

  LK.renderMonthBar = function () {
    var bar = document.getElementById("month-bar");
    if (!bar) return;
    bar.innerHTML = LK.MONTHS.map(function (mo) {
      var active = mo.id === LK.store.month() ? " active" : "";
      return '<button class="month-btn' + active + '" data-action="month" data-month="' + mo.id + '">' +
        mo.label + ' <span>(' + mo.state + ")</span></button>";
    }).join("") + '<button class="month-btn ghost" data-action="reset" title="Kembalikan data contoh">↺ Reset Data</button>';
  };

  function route() {
    var h = location.hash || "#/dashboard";
    var name = h.replace(/^#\//, "").split("?")[0] || "dashboard";
    LK.currentRoute = LK.pages[name] ? name : "dashboard";
    document.querySelectorAll("nav a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#/" + LK.currentRoute);
    });
    LK.renderPage(LK.currentRoute);
  }

  window.addEventListener("hashchange", route);
  LK.renderMonthBar();
  route();
})();
