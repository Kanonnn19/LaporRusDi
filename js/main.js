// js/main.js
// Kode yang dipakai semua halaman (sementara: menu navbar di ponsel)

const tombolMenu = document.getElementById("tombol-menu");
const menuPonsel = document.getElementById("menu-ponsel");

// Saat tombol diklik, tampilkan atau sembunyikan menu
tombolMenu.addEventListener("click", function () {
  menuPonsel.classList.toggle("hidden");
});