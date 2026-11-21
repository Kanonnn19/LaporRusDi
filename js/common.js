var idCounter = 0;
var REPORT_STATUSES = ["Menunggu", "Diverifikasi", "Diproses", "Selesai", "Ditolak"];
var REPORT_PRIORITIES = ["Rendah", "Sedang", "Tinggi", "Darurat"];
var DEFAULT_LOCATIONS = ["Gedung A, Lantai 2", "Gedung B, Lantai 2", "Toilet Lantai 1", "Perpustakaan", "Kantin Kampus"];

function storageKey(name) {
  if (typeof KEYS !== "undefined" && KEYS[name]) { return KEYS[name]; }
  return "laporrusdi_" + name;
}

function getData(key) {
  var text = localStorage.getItem(key);
  if (text === null) { return []; }
  try {
    return JSON.parse(text);
  } catch (e) {
    return [];
  }
}
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getCurrentUser() {
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
  if (typeof KEYS !== "undefined") { localStorage.removeItem(KEYS.session); }
  window.location.href = "login.html";
}

function generateId(prefix) {
  idCounter++;
  return prefix + Date.now() + "-" + idCounter;
}
function getToday() {
  var d = new Date();
  var bulan = String(d.getMonth() + 1);
  var hari = String(d.getDate());
  if (bulan.length < 2) { bulan = "0" + bulan; }
  if (hari.length < 2) { hari = "0" + hari; }
  return d.getFullYear() + "-" + bulan + "-" + hari;
}
function formatDate(text) {
  var bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  var d = new Date(text);
  if (!text || isNaN(d.getTime())) { return "-"; }
  return d.getDate() + " " + bulan[d.getMonth()] + " " + d.getFullYear();
}
function escapeHtml(text) {
  var div = document.createElement("div");
  div.textContent = text === null || text === undefined ? "" : String(text);
  return div.innerHTML.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
function statusBadge(status) {
  var s = status || "Menunggu";
  return '<span class="badge badge-' + escapeHtml(s.toLowerCase()) + '">' + escapeHtml(s) + '</span>';
}
function priorityBadge(priority) {
  if (!priority) { return '<span class="muted">-</span>'; }
  return '<span class="badge badge-' + escapeHtml(priority.toLowerCase()) + '">' + escapeHtml(priority) + '</span>';
}
function getReportLocation(report) {
  if (report.location) { return report.location; }
  var parts = [];
  if (report.building) { parts.push(report.building); }
  if (report.room) { parts.push(report.room); }
  return parts.length > 0 ? parts.join(", ") : "-";
}

function generateReportId() {
  var reports = getData(KEYS.reports);
  var terbesar = 0;
  for (var i = 0; i < reports.length; i++) {
    var angka = parseInt(String(reports[i].id).replace("LRD-", ""), 10);
    if (!isNaN(angka) && angka > terbesar) { terbesar = angka; }
  }
  var baru = String(terbesar + 1);
  while (baru.length < 4) { baru = "0" + baru; }
  return "LRD-" + baru;
}

function getReportById(id) {
  if (id === null || id === undefined) { return null; }
  var reports = getData(KEYS.reports);
  for (var i = 0; i < reports.length; i++) {
    if (String(reports[i].id) === String(id)) { return reports[i]; }
  }
  return null;
}
function updateReport(id, changes) {
  var reports = getData(KEYS.reports);
  for (var i = 0; i < reports.length; i++) {
    if (String(reports[i].id) === String(id)) {
      for (var key in changes) { reports[i][key] = changes[key]; }
      saveData(KEYS.reports, reports);
      return reports[i];
    }
  }
  return null;
}

function getUserById(id) {
  if (id === null || id === undefined) { return null; }
  var users = getData(KEYS.users);
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === id) { return users[i]; }
  }
  return null;
}
function getTechnicians() {
  var users = getData(KEYS.users);
  var hasil = [];
  for (var i = 0; i < users.length; i++) {
    if (users[i].role === "teknisi") { hasil.push(users[i]); }
  }
  return hasil;
}

function addStatusHistory(reportId, status, note, actorId) {
  var history = getData(KEYS.history);
  history.push({ reportId: reportId, status: status, note: note, date: getToday(), actorId: actorId });
  saveData(KEYS.history, history);
}
function addNotification(userId, title, message, reportId) {
  if (userId === null || userId === undefined) { return; }
  var list = getData(KEYS.notifications);
  list.push({ id: generateId("n"), userId: userId, title: title, message: message, date: getToday(), isRead: false, reportId: reportId || null });
  saveData(KEYS.notifications, list);
}
function notifyRole(role, title, message, reportId) {
  var users = getData(KEYS.users);
  for (var i = 0; i < users.length; i++) {
    if (users[i].role === role) { addNotification(users[i].id, title, message, reportId); }
  }
}

function assignTechnician(reportId, techId, note, actorId) {
  var report = getReportById(reportId);
  var tech = getUserById(techId);
  if (report === null || tech === null) { return false; }
  var changes = { technicianId: tech.id };
  var status = report.status;
  if (status === "Menunggu") {
    status = "Diverifikasi";
    changes.status = status;
  }
  if (note) { changes.adminNote = note; }
  updateReport(reportId, changes);
  addStatusHistory(reportId, status, "Ditugaskan kepada " + tech.name + (note ? ". " + note : ""), actorId);
  addNotification(tech.id, "Tugas perbaikan baru", "Kamu ditugaskan menangani " + reportId + ": " + report.title + ".", reportId);
  addNotification(report.userId, "Laporan ditugaskan", reportId + " ditangani oleh " + tech.name + ".", reportId);
  return true;
}

function ensureTechnicians() {
  if (typeof KEYS === "undefined") { return; }
  var users = getData(KEYS.users);
  if (users.length === 0) { return; }
  for (var i = 0; i < users.length; i++) {
    if (users[i].role === "teknisi") { return; }
  }
  users.push({ id: "u-teknisi1", name: "Agus Septio", email: "agus@rusdi.ac.id", password: "teknisi123", phone: "0812-3456-7890", role: "teknisi", specialization: "Kelistrikan & AC" });
  users.push({ id: "u-teknisi2", name: "Budi Santoso", email: "budi.teknisi@rusdi.ac.id", password: "teknisi123", phone: "0821-9876-5432", role: "teknisi", specialization: "Plumbing" });
  saveData(KEYS.users, users);
}
function ensureLocations() {
  var key = storageKey("locations");
  if (localStorage.getItem(key) === null) { saveData(key, DEFAULT_LOCATIONS); }
}
ensureTechnicians();
ensureLocations();

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

function showConfirm(message, onYes) {
  var bg = document.createElement("div");
  bg.className = "modal-bg";
  bg.innerHTML = '<div class="modal-box"><p>' + escapeHtml(message) + '</p>' +
    '<div class="modal-actions"><button class="btn btn-light" id="confirm-no">Batal</button>' +
    '<button class="btn btn-danger" id="confirm-yes">Ya, lanjutkan</button></div></div>';
  document.body.appendChild(bg);
  bg.querySelector("#confirm-no").addEventListener("click", function () { bg.remove(); });
  bg.querySelector("#confirm-yes").addEventListener("click", function () { bg.remove(); onYes(); });
}

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

  var links = "";
  for (var i = 0; i < menu.length; i++) {
    var cls = menu[i][0] === active ? "nav-link active" : "nav-link";
    links += '<a href="' + menu[i][1] + '" class="' + cls + '">' + menu[i][2] + '</a>';
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

  box.innerHTML = '<nav class="navbar"><div class="navbar-inner max-w-6xl mx-auto px-6">' +
    '<a href="index.html" class="nav-logo">Lapor<span>RusDi</span></a>' +
    '<div class="nav-menu">' + links + '</div>' +
    '<div class="nav-right">' + tombolDesktop + '</div>' +
    '<button id="btn-menu" class="nav-burger" aria-label="Buka menu">' +
    '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" viewBox="0 0 24 24">' +
    '<path d="M4 6h16M4 12h16M4 18h16"/></svg></button></div>' +
    '<div id="menu-mobile" class="menu-mobile">' + links +
    '<div class="menu-mobile-actions">' + tombolMobile + '</div></div></nav>';

  document.querySelector("#btn-menu").addEventListener("click", function () {
    document.querySelector("#menu-mobile").classList.toggle("open");
  });
  var tombolKeluar = document.querySelectorAll(".btn-logout");
  for (var j = 0; j < tombolKeluar.length; j++) {
    tombolKeluar[j].addEventListener("click", logout);
  }
}

function renderSidebar() {
  var box = document.querySelector("#sidebar");
  var user = getCurrentUser();
  if (box === null || user === null) { return; }
  var menus = {
    pelapor: [
      ["user-dashboard.html", "Dashboard"],
      ["create-report.html", "Buat Laporan"],
      ["reports.html", "Daftar Laporan"],
      ["notifications.html", "Notifikasi"],
      ["profile.html", "Profil"],
      ["help.html", "Bantuan"]
    ],
    admin: [
      ["admin-dashboard.html", "Dashboard"],
      ["admin-reports.html", "Kelola Laporan"],
      ["admin-technicians.html", "Teknisi"],
      ["admin-settings.html", "Kategori & Lokasi"],
      ["notifications.html", "Notifikasi"],
      ["profile.html", "Profil"],
      ["page-testing.html", "Pengujian"],
      ["help.html", "Bantuan"]
    ],
    teknisi: [
      ["technician-dashboard.html", "Dashboard"],
      ["notifications.html", "Notifikasi"],
      ["profile.html", "Profil"],
      ["help.html", "Bantuan"]
    ]
  };
  var list = menus[user.role] || menus.pelapor;
  var belumDibaca = 0;
  var semuaNotif = getData(KEYS.notifications);
  for (var n = 0; n < semuaNotif.length; n++) {
    if (semuaNotif[n].userId === user.id && !semuaNotif[n].isRead) { belumDibaca++; }
  }
  var active = box.getAttribute("data-active");
  var html = '<div class="sidebar"><a href="index.html" class="sidebar-logo">Lapor<span>RusDi</span></a>' +
             '<p class="sidebar-user">' + escapeHtml(user.name) + ' (' + escapeHtml(user.role) + ')</p>';
  for (var i = 0; i < list.length; i++) {
    var label = list[i][1];
    if (list[i][0] === "notifications.html" && belumDibaca > 0) {
      label += ' <span class="badge badge-darurat" style="margin-left:6px">' + belumDibaca + '</span>';
    }
    html += '<a href="' + list[i][0] + '"' + (list[i][0] === active ? ' class="active"' : '') + '>' + label + '</a>';
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
      if (typeof resetDemoData === "function") { resetDemoData(); }
      localStorage.removeItem(storageKey("locations"));
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