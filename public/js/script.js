/* variables */
const form = $("#form");
const inputFile = $("#upload");
const dropArea = $(".info");
const scannedImg = $("#scanned-image");
const laserScan = $("#laser-scan");
const scanResult = $("#result");
const key = $("#key");
const copyBtn = $("#copy");

/* functions */
const showLaser = (laser) => laser.addClass("active");
const hideLaser = (laser) => laser.removeClass("active");
const highlight = () => dropArea.addClass("active");
const unHighlight = () => dropArea.removeClass("active");
const scan = (file) => {
  $("#hash").val("");
  $("#expiry_date").val("");
  if (!file.type.startsWith("image")) {
    alert("Only images are available");
    return;
  }
  const src = URL.createObjectURL(file);
  scannedImg.attr("src", src);
  scannedImg.on("load", () => URL.revokeObjectURL(scannedImg.attr("src"))); // free memory
  const formData = new FormData();
  formData.append("file", file);
  fetchRequest(formData);
};

const fetchRequest = async (formData) => {
  scanResult.val("Scanning QR Code...");
  const response = await fetch("https://api.qrserver.com/v1/read-qr-code/", {
    method: "POST",
    body: formData,
  });
  let result = await response.json();
  result = result[0].symbol[0].data;
  showLaser(laserScan);
  setTimeout(() => {
    scanResult.val(result || "Couldn't Scan The QR Code");
    key.val(scanResult.val());
    hideLaser(laserScan);
  }, 1500);
};

inputFile.on("change", (e) => scan(e.target.files[0]));
// drag area
dropArea.on("dragenter", (e) => {
  e.preventDefault();
  highlight();
});
dropArea.on("dragleave", (e) => unHighlight());
dropArea.on("dragover", (e) => e.preventDefault());

// In order to have the drop event occur on a div element, you must cancel the ondragenter and ondragover
dropArea.on("drop", (e) => {
  e.preventDefault();
  unHighlight();
  const file = e.originalEvent.dataTransfer.files[0];
  setTimeout(() => {
    scan(file);
  }, 50);
});
