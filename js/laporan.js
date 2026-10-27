// js/laporan.js
// Menampilkan daftar laporan contoh dan filter berdasarkan status.
// PENTING: data di bawah hanya contoh (mock data), tidak tersimpan di database.

const dataLaporan = [
  { id: "LRD-0243", judul: "Lampu koridor lantai 1 mati", lokasi: "Gedung A, Lantai 1", kategori: "Listrik", status: "Menunggu", tanggal: "24 Okt 2026" },
  { id: "LRD-0241", judul: "AC Ruang B.204 tidak dingin", lokasi: "Gedung B, Lantai 2", kategori: "AC", status: "Diproses", tanggal: "20 Okt 2026" },
  { id: "LRD-0240", judul: "Kursi kelas patah", lokasi: "Ruang A.101", kategori: "Furnitur", status: "Menunggu", tanggal: "25 Okt 2026" },
  { id: "LRD-0238", judul: "Proyektor tidak menyala", lokasi: "Ruang B.105", kategori: "Elektronik", status: "Diproses", tanggal: "22 Okt 2026" },
  { id: "LRD-0236", judul: "Keran wastafel toilet bocor", lokasi: "Gedung C, Lantai 1", kategori: "Air", status: "Selesai", tanggal: "15 Okt 2026" },
  { id: "LRD-0231", judul: "Atap perpustakaan bocor", lokasi: "Perpustakaan", kategori: "Bangunan", status: "Selesai", tanggal: "10 Okt 2026" }
];

const daftarLaporan = document.getElementById("daftar-laporan");
const pesanKosong = document.getElementById("pesan-kosong");
const filterStatus = document.getElementById("filter-status");

// Warna garis di sisi kiri tiket, sesuai status.
// Tulis nama class secara utuh supaya Tailwind bisa mengenalinya.
const warnaGaris = {
  Menunggu: "border-yellow-500",
  Diproses: "border-brand-600",
  Selesai: "border-green-600",
  Ditolak: "border-red-600"
};

// Warna label status
const warnaLabel = {
  Menunggu: "bg-yellow-100 text-yellow-800",
  Diproses: "bg-blue-100 text-blue-800",
  Selesai: "bg-green-100 text-green-800",
  Ditolak: "bg-red-100 text-red-800"
};

// Membuat satu tiket laporan (berupa teks HTML)
function buatTiket(laporan) {
  return `
    <article class="flex flex-col gap-2 rounded-xl border-l-8 kartu p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between ${warnaGaris[laporan.status]}">
      <div>
        <p class="text-sm font-bold text-ink/50">${laporan.id} &middot; ${laporan.kategori}</p>
        <h3 class="font-bold">${laporan.judul}</h3>
        <p class="text-sm text-ink/60">${laporan.lokasi} &middot; ${laporan.tanggal}</p>
      </div>
      <span class="w-fit rounded-full px-3 py-1 text-xs font-bold ${warnaLabel[laporan.status]}">
        ${laporan.status}
      </span>
    </article>
  `;
}

// Menampilkan laporan sesuai status yang dipilih
function tampilkanLaporan(statusDipilih) {
  let hasil = dataLaporan;

  if (statusDipilih !== "Semua") {
    hasil = dataLaporan.filter(function (laporan) {
      return laporan.status === statusDipilih;
    });
  }

  daftarLaporan.innerHTML = hasil.map(buatTiket).join("");
  pesanKosong.classList.toggle("hidden", hasil.length > 0);
}

// Mengubah tampilan tombol: yang dipilih gelap, yang lain putih
function aturTombolAktif(statusDipilih) {
  const semuaTombol = filterStatus.querySelectorAll("button");

  semuaTombol.forEach(function (tombol) {
    if (tombol.dataset.status === statusDipilih) {
      tombol.className = "rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white";
    } else {
      tombol.className = "rounded-lg kartu px-4 py-2 text-sm font-bold ring-1 ring-line hover:bg-brand-50";
    }
  });
}

// Saat salah satu tombol filter diklik
filterStatus.addEventListener("click", function (event) {
  const tombol = event.target.closest("button");
  if (tombol === null) return;

  const statusDipilih = tombol.dataset.status;
  aturTombolAktif(statusDipilih);
  tampilkanLaporan(statusDipilih);
});

// Tampilan awal: semua laporan
tampilkanLaporan("Semua");