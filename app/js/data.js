/* data.js — Data contoh Keluarga Wijaya + format angka.
   Satu-satunya sumber kebenaran: semua halaman menghitung dari data ini,
   jadi pemasukan, pengeluaran, dan sisa selalu konsisten antar halaman. */
window.LK = window.LK || {};
(function () {
  LK.FAMILY = {
    name: "Keluarga Wijaya",
    members: "Budi & Sari Wijaya + 2 anak",
    city: "Semarang",
    today: "26 November 2026",
  };

  LK.CATEGORIES = [
    { id: "belanja",    name: "Belanja Harian",     color: "#2e7d4f", icon: "🧺" },
    { id: "makanan",    name: "Makanan & Minuman",  color: "#d9a441", icon: "🍽️" },
    { id: "transport",  name: "Transportasi",       color: "#3f6fb5", icon: "🛵" },
    { id: "tagihan",    name: "Tagihan Rumah",      color: "#7a5fb0", icon: "🏠" },
    { id: "pendidikan", name: "Pendidikan",         color: "#c96f3f", icon: "📚" },
    { id: "kesehatan",  name: "Kesehatan",          color: "#3f9d8f", icon: "💊" },
    { id: "hiburan",    name: "Hiburan",            color: "#b04a6e", icon: "🎬" },
  ];

  LK.MONTHS = [
    { id: "2026-10", label: "Oktober 2026",  state: "Selesai" },
    { id: "2026-11", label: "November 2026", state: "Berjalan" },
    { id: "2026-12", label: "Desember 2026", state: "Berjalan" },
  ];

  LK.BUDGETS = {
    belanja: 2500000, makanan: 1800000, transport: 900000, tagihan: 1600000,
    pendidikan: 1200000, kesehatan: 500000, hiburan: 600000,
  };

  LK.INCOME = {
    "2026-10": [
      { source: "Gaji Budi (Ayah)", amount: 8500000 },
      { source: "Gaji Sari (Ibu)", amount: 4000000 },
      { source: "Usaha sampingan", amount: 750000 },
    ],
    "2026-11": [
      { source: "Gaji Budi (Ayah)", amount: 8500000 },
      { source: "Gaji Sari (Ibu)", amount: 4000000 },
      { source: "Usaha sampingan", amount: 750000 },
    ],
    "2026-12": [
      { source: "Gaji Budi (Ayah)", amount: 8500000 },
      { source: "Gaji Sari (Ibu)", amount: 4000000 },
      { source: "Usaha sampingan", amount: 750000 },
    ],
  };

  /* Transaksi = pengeluaran. id unik per bulan. */
  LK.TX = {
    "2026-10": [
      { id: "okt-01", date: "2026-10-02", desc: "Belanja mingguan pasar", cat: "belanja", amount: 420000 },
      { id: "okt-02", date: "2026-10-03", desc: "SPP anak", cat: "pendidikan", amount: 650000 },
      { id: "okt-03", date: "2026-10-05", desc: "Iuran RT", cat: "tagihan", amount: 50000 },
      { id: "okt-04", date: "2026-10-06", desc: "Bensin mobil", cat: "transport", amount: 250000 },
      { id: "okt-05", date: "2026-10-09", desc: "Belanja mingguan Super Indo", cat: "belanja", amount: 445000 },
      { id: "okt-06", date: "2026-10-10", desc: "Air PDAM", cat: "tagihan", amount: 185000 },
      { id: "okt-07", date: "2026-10-12", desc: "Makan siang keluarga", cat: "makanan", amount: 230000 },
      { id: "okt-08", date: "2026-10-15", desc: "Internet rumah", cat: "tagihan", amount: 350000 },
      { id: "okt-09", date: "2026-10-16", desc: "Beras 10 kg + minyak goreng", cat: "belanja", amount: 235000 },
      { id: "okt-10", date: "2026-10-18", desc: "Les bahasa Inggris", cat: "pendidikan", amount: 300000 },
      { id: "okt-11", date: "2026-10-20", desc: "Listrik PLN", cat: "tagihan", amount: 425000 },
      { id: "okt-12", date: "2026-10-21", desc: "Buku & alat tulis", cat: "pendidikan", amount: 145000 },
      { id: "okt-13", date: "2026-10-23", desc: "Belanja mingguan pasar", cat: "belanja", amount: 510000 },
      { id: "okt-14", date: "2026-10-24", desc: "Nonton bioskop keluarga", cat: "hiburan", amount: 195000 },
      { id: "okt-15", date: "2026-10-25", desc: "Bensin motor + tol", cat: "transport", amount: 312000 },
      { id: "okt-16", date: "2026-10-26", desc: "Pesan antar makan malam", cat: "makanan", amount: 148000 },
      { id: "okt-17", date: "2026-10-27", desc: "Daging & ayam", cat: "belanja", amount: 290000 },
      { id: "okt-18", date: "2026-10-28", desc: "Obat & vitamin", cat: "kesehatan", amount: 210000 },
      { id: "okt-19", date: "2026-10-29", desc: "Langganan streaming", cat: "hiburan", amount: 79000 },
      { id: "okt-20", date: "2026-10-30", desc: "Jajan anak sekolah", cat: "makanan", amount: 95000 },
      { id: "okt-21", date: "2026-10-31", desc: "Belanja akhir bulan", cat: "belanja", amount: 710000 },
      { id: "okt-22", date: "2026-10-31", desc: "Bensin mobil", cat: "transport", amount: 250000 },
      { id: "okt-23", date: "2026-10-31", desc: "Makan malam akhir pekan", cat: "makanan", amount: 577000 },
      { id: "okt-24", date: "2026-10-31", desc: "Mainan anak", cat: "hiburan", amount: 246000 },
    ],
    "2026-11": [
      { id: "nov-01", date: "2026-11-01", desc: "Belanja mingguan Pasar Gede", cat: "belanja", amount: 385000 },
      { id: "nov-02", date: "2026-11-01", desc: "Bensin motor", cat: "transport", amount: 55000 },
      { id: "nov-03", date: "2026-11-02", desc: "Makan siang keluarga", cat: "makanan", amount: 165000 },
      { id: "nov-04", date: "2026-11-03", desc: "Sayur & buah pasar", cat: "belanja", amount: 142000 },
      { id: "nov-05", date: "2026-11-03", desc: "SPP anak", cat: "pendidikan", amount: 650000 },
      { id: "nov-06", date: "2026-11-05", desc: "Kopi & camilan", cat: "makanan", amount: 48000 },
      { id: "nov-07", date: "2026-11-05", desc: "Iuran RT", cat: "tagihan", amount: 50000 },
      { id: "nov-08", date: "2026-11-06", desc: "Bensin mobil", cat: "transport", amount: 250000 },
      { id: "nov-09", date: "2026-11-07", desc: "Buku & alat tulis", cat: "pendidikan", amount: 145000 },
      { id: "nov-10", date: "2026-11-08", desc: "Belanja mingguan Super Indo", cat: "belanja", amount: 412000 },
      { id: "nov-11", date: "2026-11-08", desc: "Nonton bioskop keluarga", cat: "hiburan", amount: 185000 },
      { id: "nov-12", date: "2026-11-09", desc: "Makan malam luar", cat: "makanan", amount: 240000 },
      { id: "nov-13", date: "2026-11-10", desc: "Beras 10 kg + minyak goreng", cat: "belanja", amount: 218000 },
      { id: "nov-14", date: "2026-11-10", desc: "Air PDAM", cat: "tagihan", amount: 185000 },
      { id: "nov-15", date: "2026-11-11", desc: "Obat & vitamin", cat: "kesehatan", amount: 128000 },
      { id: "nov-16", date: "2026-11-12", desc: "Ojek online", cat: "transport", amount: 36000 },
      { id: "nov-17", date: "2026-11-13", desc: "Langganan streaming", cat: "hiburan", amount: 79000 },
      { id: "nov-18", date: "2026-11-14", desc: "Jajan anak sekolah", cat: "makanan", amount: 75000 },
      { id: "nov-19", date: "2026-11-15", desc: "Belanja mingguan pasar", cat: "belanja", amount: 398000 },
      { id: "nov-20", date: "2026-11-15", desc: "Internet rumah", cat: "tagihan", amount: 350000 },
      { id: "nov-21", date: "2026-11-16", desc: "Bensin motor", cat: "transport", amount: 55000 },
      { id: "nov-22", date: "2026-11-17", desc: "Daging & ayam", cat: "belanja", amount: 265000 },
      { id: "nov-23", date: "2026-11-18", desc: "Les bahasa Inggris", cat: "pendidikan", amount: 300000 },
      { id: "nov-24", date: "2026-11-19", desc: "Pesan antar makan malam", cat: "makanan", amount: 132000 },
      { id: "nov-25", date: "2026-11-20", desc: "Listrik PLN", cat: "tagihan", amount: 425000 },
      { id: "nov-26", date: "2026-11-20", desc: "Parkir & tol", cat: "transport", amount: 84000 },
      { id: "nov-27", date: "2026-11-21", desc: "Periksa gigi anak", cat: "kesehatan", amount: 200000 },
      { id: "nov-28", date: "2026-11-22", desc: "Belanja mingguan pasar", cat: "belanja", amount: 376000 },
      { id: "nov-29", date: "2026-11-22", desc: "Mainan anak", cat: "hiburan", amount: 150000 },
      { id: "nov-30", date: "2026-11-23", desc: "Makan siang akhir pekan", cat: "makanan", amount: 210000 },
      { id: "nov-31", date: "2026-11-24", desc: "Susu & kebutuhan anak", cat: "belanja", amount: 186000 },
      { id: "nov-32", date: "2026-11-25", desc: "Bensin mobil", cat: "transport", amount: 250000 },
    ],
    "2026-12": [
      { id: "des-01", date: "2026-12-01", desc: "Belanja mingguan pasar", cat: "belanja", amount: 390000 },
      { id: "des-02", date: "2026-12-02", desc: "Bensin motor", cat: "transport", amount: 55000 },
      { id: "des-03", date: "2026-12-03", desc: "SPP anak", cat: "pendidikan", amount: 650000 },
      { id: "des-04", date: "2026-12-04", desc: "Makan siang keluarga", cat: "makanan", amount: 175000 },
      { id: "des-05", date: "2026-12-05", desc: "Iuran RT", cat: "tagihan", amount: 50000 },
      { id: "des-06", date: "2026-12-05", desc: "Bensin mobil", cat: "transport", amount: 250000 },
    ],
  };

  /* Tagihan bulanan yang berulang. paid: id tagihan yang sudah lunas per bulan. */
  LK.BILLS = [
    { id: "air",      name: "Air PDAM",       amount: 185000, due: 10 },
    { id: "internet", name: "Internet Rumah", amount: 350000, due: 15 },
    { id: "listrik",  name: "Listrik PLN",    amount: 425000, due: 20 },
    { id: "iuran",    name: "Iuran RT",       amount: 50000,  due: 5 },
    { id: "cicilan",  name: "Cicilan Motor",  amount: 875000, due: 25 },
    { id: "asuransi", name: "Asuransi Jiwa",  amount: 650000, due: 28 },
  ];
  LK.PAID_BILLS = {
    "2026-10": ["air", "internet", "listrik", "iuran", "cicilan", "asuransi"],
    "2026-11": ["air", "internet", "listrik", "iuran"],
    "2026-12": ["iuran"],
  };

  LK.GOALS = [
    { id: "darurat", name: "Dana Darurat",        target: 20000000, saved: 12400000, note: "6 bulan biaya hidup — jaring pengaman keluarga" },
    { id: "liburan", name: "Liburan Yogyakarta",  target: 5000000,  saved: 2150000,  note: "Liburan sekolah Juni 2027 — 4 hari 3 malam" },
    { id: "laptop",  name: "Laptop Anak",         target: 7500000,  saved: 3900000,  note: "Untuk belajar & tugas sekolah anak pertama" },
  ];

  /* ---- format bantu ---- */
  LK.rupiah = function (n) {
    return "Rp " + Math.round(n).toLocaleString("id-ID");
  };
  LK.rupiahShort = function (n) {
    if (n >= 1000000) return "Rp " + (n / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 2 }) + " jt";
    if (n >= 1000) return "Rp " + Math.round(n / 1000) + " rb";
    return LK.rupiah(n);
  };
  LK.pct = function (part, whole) {
    if (!whole) return 0;
    return Math.round((part / whole) * 100);
  };
  LK.catById = function (id) {
    for (var i = 0; i < LK.CATEGORIES.length; i++)
      if (LK.CATEGORIES[i].id === id) return LK.CATEGORIES[i];
    return { id: id, name: id, color: "#888888", icon: "•" };
  };
  LK.monthLabel = function (id) {
    for (var i = 0; i < LK.MONTHS.length; i++)
      if (LK.MONTHS[i].id === id) return LK.MONTHS[i].label;
    return id;
  };
  LK.dayLabel = function (iso) {
    var parts = iso.split("-");
    return parseInt(parts[2], 10) + " " +
      ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][parseInt(parts[1], 10) - 1];
  };
})();
