var teknisi = requireRole("teknisi");
var filterAktif = "semua";

function ambilTugas() {
  var semua = getData(KEYS.reports);
  var tugas = [];
  for (var i = 0; i < semua.length; i++) {
    if (semua[i].technicianId === teknisi.id) { tugas.push(semua[i]); }
  }
  tugas.sort(function (a, b) { return a.id < b.id ? 1 : -1; });
  return tugas;
}

function hitungStatistik(tugas) {
  var baru = 0;
  var proses = 0;
  var selesai = 0;
  for (var i = 0; i < tugas.length; i++) {
    if (tugas[i].status === "Diverifikasi") { baru++; }
    if (tugas[i].status === "Diproses") { proses++; }
    if (tugas[i].status === "Selesai") { selesai++; }
  }
  document.getElementById("kpi-total").textContent = tugas.length;
  document.getElementById("kpi-baru").textContent = baru;
  document.getElementById("kpi-proses").textContent = proses;
  document.getElementById("kpi-selesai").textContent = selesai;
}

function tampilkanTugas() {
  var tugas = ambilTugas();
  hitungStatistik(tugas);

  var tampil = [];
  for (var i = 0; i < tugas.length; i++) {
    if (filterAktif === "semua" || tugas[i].status === filterAktif) { tampil.push(tugas[i]); }
  }

  var wadah = document.getElementById("container-tugas");
  if (tampil.length === 0) {
    wadah.innerHTML = '<div class="card empty-state" style="grid-column:1/-1">Tidak ada tugas perbaikan dengan status ini.</div>';
    return;
  }

  var html = "";
  for (var j = 0; j < tampil.length; j++) {
    var r = tampil[j];
    html += '<div class="card" style="display:flex;flex-direction:column;justify-content:space-between;gap:16px">' +
      '<div>' +
        '<div class="report-meta"><span>' + escapeHtml(r.id) + '</span>' + priorityBadge(r.priority) + '</div>' +
        '<h3 class="report-title" style="margin-top:0">' + escapeHtml(r.title) + '</h3>' +
        '<div style="background:#F8FAFC;border:1px solid #F1F5F9;border-radius:8px;padding:12px;margin-top:12px;font-size:13px">' +
          '<p><strong>Lokasi:</strong> ' + escapeHtml(getReportLocation(r)) + '</p>' +
          '<p class="muted clamp-2" style="margin-top:4px">' + escapeHtml(r.description || "Tidak ada deskripsi.") + '</p>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid #F1F5F9">' +
        statusBadge(r.status) +
        '<a href="technician-task.html?id=' + encodeURIComponent(r.id) + '" class="btn btn-primary btn-sm">Buka tugas</a>' +
      '</div>' +
    '</div>';
  }
  wadah.innerHTML = html;
}

if (teknisi !== null) {
  document.getElementById("sapaan").textContent = "Daftar Perbaikan, " + teknisi.name;

  document.getElementById("filter-bar").addEventListener("click", function (e) {
    var tombol = e.target.closest("button[data-filter]");
    if (tombol === null) { return; }
    filterAktif = tombol.getAttribute("data-filter");
    var semuaTombol = document.querySelectorAll(".filter-btn");
    for (var i = 0; i < semuaTombol.length; i++) {
      semuaTombol[i].classList.toggle("active", semuaTombol[i] === tombol);
    }
    tampilkanTugas();
  });

  tampilkanTugas();
}