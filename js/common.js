
// Wajib dimuat SETELAH data.js

// --- Baca & simpan data LocalStorage ---
function getData(key) {
  var text = localStorage.getItem(key);
  if (text === null) { return []; }
  return JSON.parse(text);
}
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// --- Sesi login ---
function getCurrentUser() {
  // Jika data.js gagal dimuat, KEYS tidak ada. Anggap belum login supaya navbar & footer tetap tampil.
  if (typeof KEYS === "undefined") {
    console.error("KEYS tidak ditemukan: pastikan js/data.js ada dan dimuat sebelum js/common.js");
    return null;
  }
  var id = localStorage.getItem(KEYS.session);
  if (id === null) { return null; }
  var users = getData(KEYS.users);
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === id) { return users[i]; }
  }
  return null;
}
// Panggil di awal halaman dashboard. Contoh: requireRole("admin")
function requireRole(role) {
  var user = getCurrentUser();
  if (user === null) { window.location.href = "login.html"; return null; }
  if (user.role !== role) { window.location.href = getDashboardPage(user.role); return null; }
  return user;
}
function getDashboardPage(role) {
  if (role === "admin") { return "admin-dashboard.html"; }
  if (role === "teknisi") { return "technician-dashboard.html"; }
  return "user-dashboard.html";
}
function logout() {
  localStorage.removeItem(KEYS.session);
  window.location.href = "login.html";
}

// --- Helper kecil ---
function generateId(prefix) { return prefix + Date.now(); }
function getToday() { return new Date().toISOString().slice(0, 10); }
function formatDate(text) {
  var bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  var d = new Date(text);
  return d.getDate() + " " + bulan[d.getMonth()] + " " + d.getFullYear();
}
// Cegah teks pengguna dianggap kode HTML
function escapeHtml(text) {
  var div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
function statusBadge(status) {
  return '<span class="badge badge-' + status.toLowerCase() + '">' + status + '</span>';
}
function priorityBadge(priority) {
  return '<span class="badge badge-' + priority.toLowerCase() + '">' + priority + '</span>';
}

// Nomor laporan baru, contoh: LRD-0244
function generateReportId() {
  var reports = getData(KEYS.reports);
  var terbesar = 0;
  for (var i = 0; i < reports.length; i++) {
    var angka = parseInt(reports[i].id.replace("LRD-", ""));
    if (angka > terbesar) { terbesar = angka; }
  }
  var baru = String(terbesar + 1);
  while (baru.length < 4) { baru = "0" + baru; }
  return "LRD-" + baru;
}

// --- Fungsi bersama untuk riwayat & notifikasi ---
function addStatusHistory(reportId, status, note, actorId) {
  var history = getData(KEYS.history);
  history.push({ reportId: reportId, status: status, note: note, date: getToday(), actorId: actorId });
  saveData(KEYS.history, history);
}
function addNotification(userId, title, message) {
  var list = getData(KEYS.notifications);
  list.push({ id: generateId("n"), userId: userId, title: title, message: message, date: getToday(), isRead: false });
  saveData(KEYS.notifications, list);
}

// --- Toast: showToast("Berhasil disimpan", "success") | "error" | "info" ---
function showToast(message, type) {
  var box = document.querySelector("#toast-box");
  if (box === null) {
    box = document.createElement("div");
    box.id = "toast-box";
    document.body.appendChild(box);
  }
  var toast = document.createElement("div");
  toast.className = "toast toast-" + (type || "info");
  toast.textContent = message;
  box.appendChild(toast);
  setTimeout(function () { toast.remove(); }, 3000);
}

// --- Modal konfirmasi: showConfirm("Hapus data?", function () { ... }) ---
function showConfirm(message, onYes) {
  var bg = document.createElement("div");
  bg.className = "modal-bg";
  bg.innerHTML = '<div class="modal-box"><p class="font-semibold text-slate-800 mb-5">' + message + '</p>' +
    '<div class="flex gap-3 justify-end"><button class="btn bg-slate-200" id="confirm-no">Batal</button>' +
    '<button class="btn btn-danger" id="confirm-yes">Ya, lanjutkan</button></div></div>';
  document.body.appendChild(bg);
  bg.querySelector("#confirm-no").addEventListener("click", function () { bg.remove(); });
  bg.querySelector("#confirm-yes").addEventListener("click", function () { bg.remove(); onYes(); });
}

// --- Navbar publik: <div id="navbar" data-active="home"></div> ---
// Layar lebar (lg ke atas, 1024px+): menu di tengah, huruf lebih besar di layar 1280px+.
// Layar kecil: tombol hamburger yang membuka menu ke bawah.
function renderNavbar() {
  var box = document.querySelector("#navbar");
  if (box === null) { return; }
  var active = box.getAttribute("data-active");
  var user = getCurrentUser();
  var menu = [
    ["home", "index.html", "Home"],
    ["tentang", "index.html#tentang", "Tentang"],
    ["cara", "index.html#cara-kerja", "Cara Kerja"],
    ["laporan", "reports.html", "Laporan"],
    ["buat", "create-report.html", "Buat Laporan"],
    ["bantuan", "help.html", "Bantuan"]
  ];
  
  var linksDesktop = "";
  var linksMobile = "";
  for (var i = 0; i < menu.length; i++) {
    var cls = menu[i][0] === active ? "nav-link active" : "nav-link";
    var link = '<a href="' + menu[i][1] + '" class="' + cls + '">' + menu[i][2] + '</a>';
    linksDesktop += link;
    linksMobile += link;
  }

  var tombolDesktop = '<a href="login.html" class="nav-login">Masuk</a>' +
                      '<a href="register.html" class="btn btn-primary btn-sm">Daftar</a>';
  var tombolMobile = '<a href="login.html" class="btn btn-outline">Masuk</a>' +
                     '<a href="register.html" class="btn btn-primary">Daftar</a>';
  if (user !== null) {
    tombolDesktop = '<a href="' + getDashboardPage(user.role) + '" class="nav-login">Dashboard</a>' +
                    '<button class="btn-logout btn btn-primary btn-sm">Keluar</button>';
    tombolMobile = '<a href="' + getDashboardPage(user.role) + '" class="btn btn-outline">Dashboard</a>' +
                   '<button class="btn-logout btn btn-primary">Keluar</button>';
  }

  // Gaya navbar ada di css/style.css bagian NAVBAR PUBLIK
  box.innerHTML = '<nav class="navbar"><div class="navbar-inner max-w-6xl mx-auto px-6">' +
    '<a href="index.html" class="nav-logo">Lapor<span>RusDi</span></a>' +
    '<div class="nav-menu">' + linksDesktop + '</div>' +
    '<div class="nav-right">' + tombolDesktop + '</div>' +
    '<button id="btn-menu" class="nav-burger" aria-label="Buka menu">' +
    '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" viewBox="0 0 24 24">' +
    '<path d="M4 6h16M4 12h16M4 18h16"/></svg></button></div>' +
    '<div id="menu-mobile" class="menu-mobile">' + linksMobile +
    '<div class="menu-mobile-actions">' + tombolMobile + '</div></div></nav>';

  // Buka/tutup menu HP (class "open" menampilkan menu)
  document.querySelector("#btn-menu").addEventListener("click", function () {
    document.querySelector("#menu-mobile").classList.toggle("open");
  });
  // Tombol keluar (ada 2: desktop & HP)
  var tombolKeluar = document.querySelectorAll(".btn-logout");
  for (var j = 0; j < tombolKeluar.length; j++) {
    tombolKeluar[j].addEventListener("click", logout);
  }
}

// --- Sidebar dashboard (dipakai Anggota 2-4): <div id="sidebar" data-active="reports.html"></div> ---
function renderSidebar() {
  var box = document.querySelector("#sidebar");
  var user = getCurrentUser();
  if (box === null || user === null) { return; }
  var menus = {
    pelapor: [["user-dashboard.html", "Dashboard"], ["create-report.html", "Buat Laporan"], ["reports.html", "Laporan Saya"], ["notifications.html", "Notifikasi"], ["profile.html", "Profil"]],
    admin: [
      ["admin-dashboard.html", "Dashboard"],
      ["admin-reports.html", "Kelola Laporan"],
      ["admin-technicians.html", "Teknisi"],
      ["admin-settings.html", "Kategori & Lokasi"],
      ["profile.html", "Profil"],
      ["page-testing.html", "Pengujian"],
      ["help.html", "Bantuan"]
    ],
    teknisi: [["technician-dashboard.html", "Dashboard"], ["profile.html", "Profil"]]
  };
  var active = box.getAttribute("data-active");
  var html = '<div class="sidebar"><a href="index.html" class="p-0! text-2xl font-extrabold text-white mb-8">Lapor<span class="text-[#3B82F6]">RusDi</span></a>' +
             '<p class="text-sm text-slate-400 mb-6">' + escapeHtml(user.name) + ' (' + user.role + ')</p>';
  var list = menus[user.role];
  for (var i = 0; i < list.length; i++) {
    html += '<a href="' + list[i][0] + '"' + (list[i][0] === active ? ' class="active"' : '') + '>' + list[i][1] + '</a>';
  }
  html += '<a href="#" id="sidebar-logout">Keluar</a></div>';
  box.innerHTML = html;
  document.querySelector("#sidebar-logout").addEventListener("click", function (e) { e.preventDefault(); logout(); });
}

function renderFooter() {
  var box = document.querySelector("#footer");
  if (box === null) { return; }
  box.innerHTML = '<footer class="bg-[#111827] text-slate-400 py-12"><div class="max-w-6xl mx-auto px-6">' +
    '<div class="grid md:grid-cols-3 gap-8">' +
    '<div><p class="text-xl font-extrabold text-white">Lapor<span class="text-[#3B82F6]">RusDi</span></p>' +
    '<p class="text-sm mt-2">Lapor kerusakan fasilitas kampus, pantau sampai beres.</p></div>' +
    '<div><p class="font-semibold text-white mb-2">Menu</p><div class="flex flex-col gap-1 text-sm">' +
    '<a href="index.html">Home</a><a href="reports.html">Laporan</a><a href="create-report.html">Buat Laporan</a><a href="login.html">Masuk</a></div></div>' +
    '<div><p class="font-semibold text-white mb-2">Tentang proyek</p>' +
    '<p class="text-sm">Proyek akhir Praktikum Web Programming. Data disimpan di LocalStorage browser (simulasi frontend).</p>' +
    '<a href="#" id="btn-reset" class="text-[#3B82F6] text-sm inline-block mt-2">Reset data demo</a></div></div>' +
    '<p class="text-xs border-t border-slate-700 mt-8 pt-5">&copy; 2026 Lapor RusDi</p></div></footer>';
  document.querySelector("#btn-reset").addEventListener("click", function (e) {
    e.preventDefault();
    showConfirm("Semua data akan dikembalikan ke data demo awal. Lanjutkan?", function () {
      resetDemoData();
      showToast("Data demo berhasil direset.", "success");
      setTimeout(function () { window.location.href = "index.html"; }, 800);
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderNavbar();
  renderSidebar();
  renderFooter();
});
