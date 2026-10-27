var dataTeknisi = [
  { id: "TK-01", name: "Agus Septio", specialization: "Kelistrikan & AC", status: "Standby", phone: "0812-3456-7890" },
  { id: "TK-02", name: "Budi Santoso", specialization: "Plumbing", status: "Di Lapangan", phone: "0821-9876-5432" }
];

function renderTabel() {
  var inputCari = document.getElementById("input-cari");
  var keyword = inputCari ? inputCari.value.toLowerCase() : "";
  var tbody = document.getElementById("tabel-body");

  if (!tbody) return;
  tbody.innerHTML = "";

  dataTeknisi.forEach(function(tek) {
    if (tek.name.toLowerCase().indexOf(keyword) !== -1) {
      var bClass = tek.status === "Standby" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700";
      
      var tr = document.createElement("tr");
      tr.innerHTML = 
        '<td class="py-4 px-2 font-bold text-[#151E32]">' + tek.name + '</td>' +
        '<td class="py-4 px-2">' + tek.specialization + '</td>' +
        '<td class="py-4 px-2"><span class="px-2 py-1 rounded-full text-xs font-semibold ' + bClass + '">' + tek.status + '</span></td>' +
        '<td class="py-4 px-2">' + tek.phone + '</td>' +
        '<td class="py-4 px-2 text-right">' +
          '<a href="technician-dashboard.html" class="btn btn-primary btn-sm" style="text-decoration: none !important;">Lihat Dasbor</a>' +
        '</td>';
      tbody.appendChild(tr);
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  renderTabel();

  var inputCari = document.getElementById("input-cari");
  if (inputCari) {
    inputCari.addEventListener("keyup", renderTabel);
  }

  var formPenugasan = document.getElementById("form-penugasan");
  if (formPenugasan) {
    formPenugasan.addEventListener("submit", function(e) {
      e.preventDefault();
      alert("Penugasan berhasil dikirim!");
    });
  }
});