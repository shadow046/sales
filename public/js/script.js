/* variables */
const form = $("#form");
const inputFile = $("#upload");
const dropArea = $(".info");
const scannedImg = $("#scanned-image");
const laserScan = $("#laser-scan");
const scanResult = $("#result");
const key = $("#key");
const copyBtn = $("#copy");
const formData = new FormData();
/* functions */
const showLaser = (laser) => laser.addClass("active");
const hideLaser = (laser) => laser.removeClass("active");
const highlight = () => dropArea.addClass("active");
const unHighlight = () => dropArea.removeClass("active");
const scan = (file) => {
	$("#hash").val("");
	$("#expiry_date").val("");
	$("#expiry_date").show();
	if (!file.type.startsWith("image")) {
		alert("Only images are available");
		return;
	}
	const src = URL.createObjectURL(file);
	scannedImg.attr("src", src);
	scannedImg.on("load", () => URL.revokeObjectURL(scannedImg.attr("src"))); // free memory
	formData.append("file", file);
	$('#keyForm').show();
	$('.modal-footer').hide();
};

const fetchRequest = async (formData) => {
	return new Promise((resolve, reject) => {
		scanResult.val("Scanning QR Code...");
		fetch("/qrcode/decode", {
			method: "POST",
			body: formData,
		})
		.then((response) => response.json())
		.then((result) => {
			result = result.decodedData
			showLaser(laserScan);
			setTimeout(() => {
				scanResult.val(result || "Couldn't Scan The QR Code");
				key.val(scanResult.val());
				$('#license_key').val(result);
				hideLaser(laserScan);
				resolve(); // Resolve the Promise after the fetch request completes
			}, Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000);
		})
		.catch((error) => {
			reject(error); // Reject the Promise if there's an error
		});
	});
};
inputFile.on("change", (e) => scan(e.target.files[0]));
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
