var daftarTugas = [
  { id: "LRD-0001", title: "AC Ruang Lab 3 Mati", location: "Gedung A, Lantai 2", description: "AC tidak dingin dan berbunyi bising.", priority: "Tinggi", status: "Diproses" },
  { id: "LRD-0002", title: "Kran Wastafel Bocor", location: "Toilet Lantai 1", description: "Air mengalir terus dari kran.", priority: "Sedang", status: "Menunggu" }
];

function renderDaftarTugas(filterStatus) {
  filterStatus = filterStatus || "semua";
  var container = document.getElementById("container-tugas");
  if (!container) return;

  container.innerHTML = "";

  var filtered = daftarTugas;
  if (filterStatus !== "semua") {
    filtered = daftarTugas.filter(function(r) {
      return r.status.toLowerCase() === filterStatus.toLowerCase();
    });
  }

  if (filtered.length === 0) {
    container.innerHTML = '<div class="col-span-3 card text-center py-12 text-slate-500 font-medium">Tidak ada tugas perbaikan dengan status ini.</div>';
    return;
  }

  filtered.forEach(function(r) {
    var cardDiv = document.createElement("div");
    cardDiv.className = "card flex flex-col justify-between space-y-4";
    
    cardDiv.innerHTML = 
      '<div>' +
        '<div class="flex justify-between items-center mb-2">' +
          '<span class="text-xs font-bold text-slate-400">#' + r.id + '</span>' +
          '<span class="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-700">' + r.priority + '</span>' +
        '</div>' +
        '<h3 class="font-bold text-[#151E32] text-lg">' + r.title + '</h3>' +
        
        '<div class="bg-[#F8FAFC] p-3 rounded-lg text-xs mt-3 border border-slate-100 space-y-1">' +
          '<p><strong>Lokasi:</strong> ' + r.location + '</p>' +
          '<p class="text-slate-500">' + r.description + '</p>' +
        '</div>' +
      '</div>' +

      '<div class="flex justify-between items-center pt-3 border-t border-slate-100">' +
        '<span class="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">' + r.status + '</span>' +
        '<a href="technician-task.html?id=' + r.id + '" class="btn btn-primary btn-sm" style="text-decoration: none !important;">Detail Task →</a>' +
      '</div>';

    container.appendChild(cardDiv);
  });
}

function updateActiveButton(clickedBtn) {
  var allButtons = document.querySelectorAll(".btn-filter");
  allButtons.forEach(function(btn) {
    btn.style.backgroundColor = "transparent";
    btn.style.color = "#151E32";
    btn.style.borderColor = "#CBD5E1";
  });

  clickedBtn.style.backgroundColor = "#3B82F6";
  clickedBtn.style.color = "#ffffff";
  clickedBtn.style.borderColor = "transparent";
}

document.addEventListener("DOMContentLoaded", function() {
  renderDaftarTugas("semua");

  document.getElementById("filter-semua").addEventListener("click", function() {
    renderDaftarTugas("semua");
    updateActiveButton(this);
  });

  document.getElementById("filter-menunggu").addEventListener("click", function() {
    renderDaftarTugas("Menunggu");
    updateActiveButton(this);
  });

  document.getElementById("filter-diproses").addEventListener("click", function() {
    renderDaftarTugas("Diproses");
    updateActiveButton(this);
  });

  document.getElementById("filter-selesai").addEventListener("click", function() {
    renderDaftarTugas("Selesai");
    updateActiveButton(this);
  });
});