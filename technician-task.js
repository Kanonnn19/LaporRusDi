function updateProgressBar(status) {
  var progressBar = document.getElementById("progress-bar");
  if (!progressBar) return;

  var st = (status || "").toLowerCase();
  if (st === "menunggu") {
    progressBar.style.width = "0%";
  } else if (st === "diproses") {
    progressBar.style.width = "50%";
  } else if (st === "selesai") {
    progressBar.style.width = "100%";
  }
}

document.addEventListener("DOMContentLoaded", function() {
  var btnUpdate = document.getElementById("btn-update-status");
  if (btnUpdate) {
    btnUpdate.addEventListener("click", function() {
      var status = document.getElementById("select-status-task").value;
      updateProgressBar(status);
      alert("Status berhasil diperbarui ke: " + status);
    });
  }

  var formSelesai = document.getElementById("form-selesai");
  if (formSelesai) {
    formSelesai.addEventListener("submit", function(e) {
      e.preventDefault();
      updateProgressBar("Selesai");
      document.getElementById("select-status-task").value = "Selesai";
      alert("Pekerjaan berhasil diselesaikan!");
    });
  }
});