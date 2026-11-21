var teknisi = requireRole("teknisi");
var tiketId = getQueryParam("id");
var laporan = null;

var progresStatus = {
  "Menunggu": { lebar: 0, label: "Menunggu verifikasi admin" },
  "Diverifikasi": { lebar: 25, label: "Ditugaskan, belum dikerjakan" },
  "Diproses": { lebar: 60, label: "Sedang dikerjakan" },
  "Selesai": { lebar: 100, label: "Perbaikan selesai" }
};

function muatLaporan() {
  var data = getReportById(tiketId);
  if (data !== null && data.technicianId === teknisi.id) {
    laporan = data;
  } else {
    laporan = null;
  }
}

function tampilkanRiwayat() {
  var semua = getData(KEYS.history);
  var riwayat = [];
  for (var i = 0; i < semua.length; i++) {
    if (semua[i].reportId === laporan.id) { riwayat.push(semua[i]); }
  }
  riwayat.reverse();
  var html = "";
  for (var j = 0; j < riwayat.length; j++) {
    html += '<div class="timeline-item"><span class="timeline-dot"></span><div>' +
      '<p class="timeline-title">' + escapeHtml(riwayat[j].status) + '</p>' +
      '<p class="timeline-note">' + escapeHtml(riwayat[j].note || "") + '</p>' +
      '<p class="timeline-date">' + formatDate(riwayat[j].date) + '</p></div></div>';
  }
  if (html === "") { html = '<p class="muted">Belum ada riwayat.</p>'; }
  document.getElementById("timeline-list").innerHTML = html;
}

function tampilkanLaporan() {
  var pelapor = getUserById(laporan.userId);
  document.getElementById("label-tiket-id").textContent = laporan.id;
  document.getElementById("task-title").textContent = laporan.title;
  document.getElementById("task-location").textContent = "Lokasi: " + getReportLocation(laporan);
  document.getElementById("task-desc").textContent = laporan.description || "Tidak ada deskripsi.";
  document.getElementById("task-priority").innerHTML = priorityBadge(laporan.priority);
  document.getElementById("task-reporter").textContent = laporan.reporterName || (pelapor !== null ? pelapor.name : "Pengguna kampus");
  document.getElementById("task-admin-note").textContent = laporan.adminNote || "-";
  document.getElementById("select-status-task").value = laporan.status === "Menunggu" ? "Diverifikasi" : laporan.status;
  document.getElementById("catatan-perbaikan").value = laporan.repairNote || "";
  var progres = progresStatus[laporan.status] || progresStatus["Menunggu"];
  document.getElementById("progress-bar").style.width = progres.lebar + "%";
  document.getElementById("progress-label").textContent = progres.label;
  tampilkanRiwayat();
}

function terapkanStatus(statusBaru, catatan) {
  var perubahan = { status: statusBaru, repairNote: catatan };
  perubahan.completedDate = statusBaru === "Selesai" ? getToday() : null;
  updateReport(laporan.id, perubahan);

  var teks = catatan !== "" ? catatan : "Status diperbarui oleh teknisi.";
  addStatusHistory(laporan.id, statusBaru, teks, teknisi.id);
  addNotification(laporan.userId, "Status laporan diperbarui", laporan.id + " kini berstatus " + statusBaru + ".", laporan.id);
  if (statusBaru === "Selesai") {
    notifyRole("admin", "Perbaikan selesai", teknisi.name + " menyelesaikan " + laporan.id + ": " + laporan.title + ".", laporan.id);
  }
  muatLaporan();
  tampilkanLaporan();
}

if (teknisi !== null) {
  muatLaporan();
  if (laporan === null) {
    document.getElementById("task-missing").classList.remove("is-hidden");
  } else {
    document.getElementById("task-content").classList.remove("is-hidden");
    tampilkanLaporan();

    document.getElementById("btn-update-status").addEventListener("click", function () {
      var statusBaru = document.getElementById("select-status-task").value;
      var catatan = document.getElementById("catatan-perbaikan").value.trim();
      if (statusBaru === laporan.status) {
        showToast("Status tidak berubah.", "info");
        return;
      }
      if (statusBaru === "Selesai" && catatan === "") {
        showToast("Isi catatan pengerjaan sebelum menandai selesai.", "error");
        document.getElementById("catatan-perbaikan").focus();
        return;
      }
      terapkanStatus(statusBaru, catatan);
      showToast("Status berhasil diperbarui ke " + statusBaru + ".", "success");
    });

    document.getElementById("form-selesai").addEventListener("submit", function (e) {
      e.preventDefault();
      var catatan = document.getElementById("catatan-perbaikan").value.trim();
      if (catatan === "") {
        showToast("Isi catatan pengerjaan terlebih dahulu.", "error");
        return;
      }
      terapkanStatus("Selesai", catatan);
      showToast("Pekerjaan berhasil diselesaikan.", "success");
    });
  }
}