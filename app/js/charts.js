/* charts.js — Gambar chart di <canvas> dengan Canvas 2D murni.
   Tanpa library: donat pengeluaran per kategori + batang perbandingan bulan. */
(function () {
  function setup(canvas, w, h) {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    var ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    return ctx;
  }

  /* Donat: slices = [{label, value, color}]. Tulis total di tengah. */
  LK.drawDonut = function (canvas, slices, centerTop, centerBottom) {
    var size = 200;
    var ctx = setup(canvas, size, size);
    var total = slices.reduce(function (s, x) { return s + x.value; }, 0);
    var cx = size / 2, cy = size / 2, r = 96, inner = 62;
    var a0 = -Math.PI / 2;
    slices.forEach(function (sl) {
      if (!sl.value) return;
      var a1 = a0 + (sl.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, a0, a1);
      ctx.closePath();
      ctx.fillStyle = sl.color;
      ctx.fill();
      a0 = a1;
    });
    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.fillStyle = "#fffdf8";
    ctx.fill();
    ctx.fillStyle = "#22301f";
    ctx.textAlign = "center";
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.fillText(centerTop, cx, cy - 4);
    ctx.font = "700 17px system-ui, sans-serif";
    ctx.fillText(centerBottom, cx, cy + 18);
  };

  /* Batang vertikal: items = [{label, value, color}]. maxValue = skala. */
  LK.drawBars = function (canvas, items, maxValue) {
    var w = 560, h = 220, padL = 8, padB = 26, padT = 30;
    var ctx = setup(canvas, w, h);
    var max = maxValue || Math.max.apply(null, items.map(function (x) { return x.value; }));
    var bw = (w - padL * 2) / items.length;
    items.forEach(function (it, i) {
      var bh = Math.max(3, ((h - padB - padT) * it.value) / max);
      var x = padL + i * bw + bw * 0.18;
      var y = h - padB - bh;
      ctx.fillStyle = it.color;
      ctx.beginPath();
      ctx.roundRect(x, y, bw * 0.64, bh, [5, 5, 0, 0]);
      ctx.fill();
      ctx.fillStyle = "#22301f";
      ctx.textAlign = "center";
      ctx.font = "700 12px system-ui, sans-serif";
      ctx.fillText(LK.rupiahShort(it.value), x + bw * 0.32, y - 8);
      ctx.font = "12px system-ui, sans-serif";
      ctx.fillStyle = "#5c6b58";
      ctx.fillText(it.label, x + bw * 0.32, h - 8);
    });
  };

  /* Batang horizontal anggaran vs realisasi, digambar sebagai div di pages.js;
     fungsi ini hanya menggambar tren garis sederhana bila dibutuhkan. */
})();
