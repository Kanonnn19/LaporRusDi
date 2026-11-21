var admin = requireRole("admin");

// Teknisi dianggap "Di Lapangan" bila punya tugas berstatus Diproses
function hitungTugasAktif(teknisiId, semuaLaporan) {
  var aktif = 0;
  var diproses = 0;
  for (var i = 0; i < semuaLaporan.length; i++) {
    var r = semuaLaporan[i];
    if (r.technicianId === teknisiId && (r.status === "Diverifikasi" || r.status === "Diproses")) { aktif++; }
    if (r.technicianId === teknisiId && r.status === "Diproses") { diproses++; }
  }
  return { aktif: aktif, diproses: diproses };
}

function tampilkanRingkasan() {
  var teknisi = getTechnicians();
  var laporan = getData(KEYS.reports);
  var standby = 0;
  var lapangan = 0;
  for (var i = 0; i < teknisi.length; i++) {
    if (hitungTugasAktif(teknisi[i].id, laporan).diproses > 0) { lapangan++; } else { standby++; }
  }

  var batas = new Date();
  batas.setDate(batas.getDate() - 7);
  var selesai = 0;
  for (var j = 0; j < laporan.length; j++) {
    if (laporan[j].status === "Selesai" && laporan[j].completedDate && new Date(laporan[j].completedDate) >= batas) { selesai++; }
  }

  document.getElementById("kpi-total").textContent = teknisi.length + " Orang";
  document.getElementById("kpi-standby").textContent = standby + " Orang";
  document.getElementById("kpi-lapangan").textContent = lapangan + " Orang";
  document.getElementById("kpi-selesai").textContent = selesai + " Perbaikan";
}

function renderTabel() {
  var keyword = document.getElementById("input-cari").value.trim().toLowerCase();
  var teknisi = getTechnicians();
  var laporan = getData(KEYS.reports);
  var html = "";

  for (var i = 0; i < teknisi.length; i++) {
    var t = teknisi[i];
    if (t.name.toLowerCase().indexOf(keyword) === -1) { continue; }
    var hitung = hitungTugasAktif(t.id, laporan);
    var di = hitung.diproses > 0;
    var warna = di ? "background:#DBEAFE;color:#1D4ED8" : "background:#DCFCE7;color:#166534";
    html += '<tr>' +
      '<td class="font-bold">' + escapeHtml(t.name) + '<div class="muted" style="font-size:12px;font-weight:400">' + escapeHtml(t.email || "") + '</div></td>' +
      '<td>' + escapeHtml(t.specialization || "-") + '</td>' +
      '<td><span class="badge" style="' + warna + '">' + (di ? "Di Lapangan" : "Standby") + '</span></td>' +
      '<td>' + escapeHtml(t.phone || "-") + '</td>' +
      '<td>' + hitung.aktif + ' tugas</td></tr>';
  }
  if (html === "") { html = '<tr><td colspan="5"><div class="empty-state">Teknisi tidak ditemukan.</div></td></tr>'; }
  document.getElementById("tabel-body").innerHTML = html;
}

function isiPilihanPenugasan() {
  var laporan = getData(KEYS.reports);
  laporan.sort(function (a, b) { return a.id > b.id ? 1 : -1; });
  var html = '<option value="">-- Pilih Tiket Laporan --</option>';
  for (var i = 0; i < laporan.length; i++) {
    var r = laporan[i];
    if (r.status === "Selesai" || r.status === "Ditolak") { continue; }
    var sudah = r.technicianId ? " (sudah ditugaskan)" : "";
    html += '<option value="' + escapeHtml(r.id) + '">[' + escapeHtml(r.id) + '] ' + escapeHtml(r.title) + ' - ' + escapeHtml(getReportLocation(r)) + sudah + '</option>';
  }
  document.getElementById("select-laporan").innerHTML = html;

  var teknisi = getTechnicians();
  var html2 = '<option value="">-- Pilih Teknisi --</option>';
  for (var j = 0; j < teknisi.length; j++) {
    var spes = teknisi[j].specialization ? " (" + teknisi[j].specialization + ")" : "";
    html2 += '<option value="' + escapeHtml(teknisi[j].id) + '">' + escapeHtml(teknisi[j].name + spes) + '</option>';
  }
  document.getElementById("select-teknisi").innerHTML = html2;
}

function segarkan() {
  tampilkanRingkasan();
  renderTabel();
  isiPilihanPenugasan();
}

function tambahTeknisi(e) {
  e.preventDefault();
  var nama = document.getElementById("t-nama").value.trim();
  var spes = document.getElementById("t-spesialisasi").value.trim();
  var email = document.getElementById("t-email").value.trim();
  var telepon = document.getElementById("t-telepon").value.trim();
  var password = document.getElementById("t-password").value;

  if (nama === "" || email === "") { showToast("Nama dan email wajib diisi.", "error"); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast("Format email tidak valid.", "error"); return; }
  if (password.length < 6) { showToast("Password minimal 6 karakter.", "error"); return; }

  var users = getData(KEYS.users);
  for (var i = 0; i < users.length; i++) {
    if ((users[i].email || "").toLowerCase() === email.toLowerCase()) {
      showToast("Email sudah terdaftar.", "error");
      return;
    }
  }

  users.push({ id: generateId("u"), name: nama, email: email, password: password, phone: telepon, role: "teknisi", specialization: spes });
  saveData(KEYS.users, users);
  document.getElementById("form-teknisi").reset();
  document.getElementById("card-tambah").classList.add("is-hidden");
  showToast("Teknisi berhasil ditambahkan.", "success");
  segarkan();
}

function kirimPenugasan(e) {
  e.preventDefault();
  var laporanId = document.getElementById("select-laporan").value;
  var teknisiId = document.getElementById("select-teknisi").value;
  var catatan = document.getElementById("catatan-admin").value.trim();

  if (laporanId === "" || teknisiId === "") {
    showToast("Pilih tiket laporan dan teknisi terlebih dahulu.", "error");
    return;
  }
  if (assignTechnician(laporanId, teknisiId, catatan, admin.id)) {
    document.getElementById("form-penugasan").reset();
    showToast("Penugasan berhasil dikirim!", "success");
    segarkan();
  } else {
    showToast("Penugasan gagal: data tidak ditemukan.", "error");
  }
}

if (admin !== null) {
  segarkan();
  document.getElementById("input-cari").addEventListener("input", renderTabel);
  document.getElementById("form-penugasan").addEventListener("submit", kirimPenugasan);
  document.getElementById("form-teknisi").addEventListener("submit", tambahTeknisi);
  document.getElementById("btn-tambah-teknisi").addEventListener("click", function () {
    document.getElementById("card-tambah").classList.toggle("is-hidden");
  });
  document.getElementById("btn-batal-tambah").addEventListener("click", function () {
    document.getElementById("card-tambah").classList.add("is-hidden");
  });
}