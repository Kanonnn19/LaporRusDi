// =====================================================
// data.js - kunci LocalStorage + data demo LaporRusDi
// Harus dimuat SEBELUM common.js
// =====================================================

var KEYS = {
  users: "laporrusdi_users",
  reports: "laporrusdi_reports",
  categories: "laporrusdi_categories",
  locations: "laporrusdi_locations",
  history: "laporrusdi_history",
  notifications: "laporrusdi_notifications",
  comments: "laporrusdi_comments",
  supports: "laporrusdi_supports",
  session: "laporrusdi_session"
};

// Tanggal "n hari yang lalu" dalam format YYYY-MM-DD
function tanggalMundur(n) {
  var d = new Date();
  d.setDate(d.getDate() - n);
  var bulan = String(d.getMonth() + 1);
  var hari = String(d.getDate());
  if (bulan.length < 2) { bulan = "0" + bulan; }
  if (hari.length < 2) { hari = "0" + hari; }
  return d.getFullYear() + "-" + bulan + "-" + hari;
}

function buatDataDemo() {
  var users = [
    { id: "u-budi", name: "Budi Pratama", email: "budi@mahasiswa.ac.id", password: "budi123", phone: "0813-1111-2222", role: "pelapor" },
    { id: "u-sari", name: "Sari Lestari", email: "sari@mahasiswa.ac.id", password: "sari123", phone: "0813-3333-4444", role: "pelapor" },
    { id: "u-admin", name: "Admin Sarpras", email: "admin@rusdi.ac.id", password: "admin123", phone: "0811-0000-1111", role: "admin" },
    { id: "u-teknisi1", name: "Agus Septio", email: "agus@rusdi.ac.id", password: "teknisi123", phone: "0812-3456-7890", role: "teknisi", specialization: "Kelistrikan & AC" },
    { id: "u-teknisi2", name: "Budi Santoso", email: "budi.teknisi@rusdi.ac.id", password: "teknisi123", phone: "0821-9876-5432", role: "teknisi", specialization: "Plumbing" }
  ];

  var categories = ["AC", "Listrik", "Air", "Furnitur", "Bangunan", "Jaringan", "Peralatan Lab"];

  var reports = [
    { id: "LRD-0001", title: "AC Ruang Lab 3 mati", category: "AC", location: "Gedung A, Lantai 2",
      description: "AC di Lab 3 tidak menyala sejak Senin. Ruangan panas dan komputer sering overheat.",
      priority: "Tinggi", userId: "u-budi", reporterName: "Budi Pratama", status: "Diproses", date: tanggalMundur(5),
      technicianId: "u-teknisi1", adminNote: "Cek kapasitor dan freon.", repairNote: "", completedDate: null },
    { id: "LRD-0002", title: "Kran wastafel bocor", category: "Air", location: "Toilet Lantai 1",
      description: "Kran wastafel paling kiri bocor terus dan lantai menjadi licin.",
      priority: "Sedang", userId: "u-sari", reporterName: "Sari Lestari", status: "Diverifikasi", date: tanggalMundur(4),
      technicianId: "u-teknisi2", adminNote: "Bawa seal kran cadangan.", repairNote: "", completedDate: null },
    { id: "LRD-0003", title: "Lampu koridor mati", category: "Listrik", location: "Gedung B, Lantai 2",
      description: "Tiga lampu di koridor depan ruang B.204 mati, koridor gelap saat sore.",
      priority: "", userId: "u-budi", reporterName: "Budi Pratama", status: "Menunggu", date: tanggalMundur(1),
      technicianId: null, adminNote: "", repairNote: "", completedDate: null },
    { id: "LRD-0004", title: "Stop kontak korslet", category: "Listrik", location: "Gedung B, Lantai 2",
      description: "Stop kontak dekat papan tulis mengeluarkan percikan api kecil dan bau gosong.",
      priority: "Darurat", userId: "u-sari", reporterName: "Sari Lestari", status: "Menunggu", date: tanggalMundur(0),
      technicianId: null, adminNote: "", repairNote: "", completedDate: null },
    { id: "LRD-0005", title: "Kursi kuliah patah", category: "Furnitur", location: "Gedung A, Lantai 2",
      description: "Dua kursi di barisan belakang patah kakinya dan berbahaya diduduki.",
      priority: "Rendah", userId: "u-budi", reporterName: "Budi Pratama", status: "Selesai", date: tanggalMundur(9),
      technicianId: "u-teknisi1", adminNote: "Ganti dengan kursi cadangan.",
      repairNote: "Dua kursi diganti dengan kursi dari gudang sarpras.", completedDate: tanggalMundur(2) },
    { id: "LRD-0006", title: "Wifi lambat di perpustakaan", category: "Jaringan", location: "Perpustakaan",
      description: "Wifi lantai 2 perpustakaan sangat lambat sehingga sulit mengunduh jurnal.",
      priority: "Sedang", userId: "u-sari", reporterName: "Sari Lestari", status: "Ditolak", date: tanggalMundur(7),
      technicianId: null, adminNote: "Bukan kewenangan Sarpras, silakan hubungi UPT TIK.", repairNote: "", completedDate: null },
    { id: "LRD-0007", title: "Proyektor tidak menyala", category: "Peralatan Lab", location: "Gedung A, Lantai 2",
      description: "Proyektor di Lab 2 tidak menyala meskipun kabel sudah dicek.",
      priority: "", userId: "u-budi", reporterName: "Budi Pratama", status: "Menunggu", date: tanggalMundur(2),
      technicianId: null, adminNote: "", repairNote: "", completedDate: null }
  ];

  var history = [
    { reportId: "LRD-0001", status: "Menunggu", note: "Laporan dikirim oleh pelapor.", date: tanggalMundur(5), actorId: "u-budi" },
    { reportId: "LRD-0001", status: "Diverifikasi", note: "Ditugaskan kepada Agus Septio. Cek kapasitor dan freon.", date: tanggalMundur(4), actorId: "u-admin" },
    { reportId: "LRD-0001", status: "Diproses", note: "Teknisi mulai memeriksa unit AC.", date: tanggalMundur(3), actorId: "u-teknisi1" },
    { reportId: "LRD-0002", status: "Menunggu", note: "Laporan dikirim oleh pelapor.", date: tanggalMundur(4), actorId: "u-sari" },
    { reportId: "LRD-0002", status: "Diverifikasi", note: "Ditugaskan kepada Budi Santoso. Bawa seal kran cadangan.", date: tanggalMundur(3), actorId: "u-admin" },
    { reportId: "LRD-0003", status: "Menunggu", note: "Laporan dikirim oleh pelapor.", date: tanggalMundur(1), actorId: "u-budi" },
    { reportId: "LRD-0004", status: "Menunggu", note: "Laporan dikirim oleh pelapor.", date: tanggalMundur(0), actorId: "u-sari" },
    { reportId: "LRD-0005", status: "Menunggu", note: "Laporan dikirim oleh pelapor.", date: tanggalMundur(9), actorId: "u-budi" },
    { reportId: "LRD-0005", status: "Diverifikasi", note: "Ditugaskan kepada Agus Septio. Ganti dengan kursi cadangan.", date: tanggalMundur(8), actorId: "u-admin" },
    { reportId: "LRD-0005", status: "Selesai", note: "Dua kursi diganti dengan kursi dari gudang sarpras.", date: tanggalMundur(2), actorId: "u-teknisi1" },
    { reportId: "LRD-0006", status: "Menunggu", note: "Laporan dikirim oleh pelapor.", date: tanggalMundur(7), actorId: "u-sari" },
    { reportId: "LRD-0006", status: "Ditolak", note: "Bukan kewenangan Sarpras, silakan hubungi UPT TIK.", date: tanggalMundur(6), actorId: "u-admin" },
    { reportId: "LRD-0007", status: "Menunggu", note: "Laporan dikirim oleh pelapor.", date: tanggalMundur(2), actorId: "u-budi" }
  ];

  var notifications = [
    { id: "n-demo-1", userId: "u-budi", title: "Status laporan diperbarui", message: "LRD-0001 kini berstatus Diproses.", date: tanggalMundur(3), isRead: false, reportId: "LRD-0001" },
    { id: "n-demo-2", userId: "u-budi", title: "Perbaikan selesai", message: "LRD-0005 sudah selesai diperbaiki.", date: tanggalMundur(2), isRead: false, reportId: "LRD-0005" },
    { id: "n-demo-3", userId: "u-admin", title: "Laporan baru masuk", message: "Sari Lestari mengirim laporan: Stop kontak korslet.", date: tanggalMundur(0), isRead: false, reportId: "LRD-0004" },
    { id: "n-demo-4", userId: "u-teknisi1", title: "Tugas perbaikan baru", message: "Kamu ditugaskan menangani LRD-0001: AC Ruang Lab 3 mati.", date: tanggalMundur(4), isRead: true, reportId: "LRD-0001" },
    { id: "n-demo-5", userId: "u-teknisi2", title: "Tugas perbaikan baru", message: "Kamu ditugaskan menangani LRD-0002: Kran wastafel bocor.", date: tanggalMundur(3), isRead: false, reportId: "LRD-0002" }
  ];

  var comments = [
    { id: "c-demo-1", reportId: "LRD-0001", userId: "u-sari", author: "Sari Lestari", text: "Di Lab 2 juga sama, AC-nya kurang dingin.", date: tanggalMundur(4) }
  ];

  var supports = [
    { reportId: "LRD-0001", userId: "u-sari", date: tanggalMundur(4) },
    { reportId: "LRD-0004", userId: "u-budi", date: tanggalMundur(0) }
  ];

  return { users: users, categories: categories, reports: reports, history: history,
           notifications: notifications, comments: comments, supports: supports };
}

function resetDemoData() {
  var demo = buatDataDemo();
  localStorage.setItem(KEYS.users, JSON.stringify(demo.users));
  localStorage.setItem(KEYS.categories, JSON.stringify(demo.categories));
  localStorage.setItem(KEYS.reports, JSON.stringify(demo.reports));
  localStorage.setItem(KEYS.history, JSON.stringify(demo.history));
  localStorage.setItem(KEYS.notifications, JSON.stringify(demo.notifications));
  localStorage.setItem(KEYS.comments, JSON.stringify(demo.comments));
  localStorage.setItem(KEYS.supports, JSON.stringify(demo.supports));
  localStorage.removeItem(KEYS.session);
}

// Isi data demo hanya jika browser belum punya data pengguna
if (localStorage.getItem(KEYS.users) === null) {
  resetDemoData();
}
// Pastikan daftar kategori selalu ada
if (localStorage.getItem(KEYS.categories) === null) {
  localStorage.setItem(KEYS.categories, JSON.stringify(buatDataDemo().categories));
}