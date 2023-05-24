/* variables */
const form = document.getElementById(`form`);
const inputFile = document.getElementById(`upload`);
const dropArea = document.querySelector(`.info`);
const scannedImg = document.getElementById(`scanned-image`);
const laserScan = document.getElementById(`laser-scan`);
const scanResult = document.getElementById(`result`);
const key = document.getElementById(`key`);
const copyBtn = document.getElementById(`copy`);
/* functions */
const showLaser = (laser) => laser.classList.add(`active`);
const hideLaser = (laser) => laser.classList.remove(`active`);
const highlight = () => dropArea.classList.add("active");
const unHighlight = () => dropArea.classList.remove("active");
const scan = (file) => {
  $('#hash').val('');
  $('#expiry_date').val('');
  if (!file.type.startsWith(`image`)) {
    alert(`Only images are available`);
    return;
  }
  const src = URL.createObjectURL(file);
  scannedImg.src = src;
  scannedImg.onload = () => URL.revokeObjectURL(scannedImg.src); // free memory
  const formData = new FormData();
  formData.append(`file`, file);
  fetchRequest(formData);
};
const copyToClipboard = (text) => {
  const el = document.createElement(`textarea`);
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};
const fetchRequest = async (formData) => {
  scanResult.value = `Scanning QR Code...`;
  const response = await fetch(`https://api.qrserver.com/v1/read-qr-code/`, {
    method: `POST`,
    body: formData,
  });
  let result = await response.json();
  result = result[0].symbol[0].data;
  showLaser(laserScan);
  setTimeout(() => {
    scanResult.value = result || `Couldn't Scan The QR Code`;
    key.value = scanResult.value;
    hideLaser(laserScan);
  }, 1500);
};
inputFile.addEventListener(`change`, (e) => scan(e.target.files[0]));
copyBtn.addEventListener(`click`, () => copyToClipboard(scanResult.value));
// drag area
dropArea.addEventListener(`dragenter`, (e) => {
  e.preventDefault();
  highlight();
});
dropArea.addEventListener(`dragleave`, (e) => unHighlight());
dropArea.addEventListener(`dragover`, (e) => e.preventDefault());
// In order to have the drop event occur on a div element, you must cancel the ondragenter and ondragover
dropArea.addEventListener(`drop`, (e) => {
  e.preventDefault();
  unHighlight();
  const file = e.dataTransfer.files[0];
  setTimeout(() => {
    scan(file);
  }, 50);
});
