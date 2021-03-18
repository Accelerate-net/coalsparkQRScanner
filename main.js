const myQRcode = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");
const btnScanQRText = document.getElementById("btn-scan-qr-text");

let scanning = false;
const base_url_allowed =  "https://zaitoon.restaurant/";

/* Loading Animation */
var toastShowingInterval;
function showToast(message, color){
    clearInterval(toastShowingInterval);
    var x = document.getElementById("infobar");
    x.style.background = color && color != '' ? color : '#ff9607';
    x.innerHTML = message ? '<tag id="infotext">'+message+'</tag>' : '<tag id="infotext">Loading...</tag>';
    x.className = "show";
    toastShowingInterval = setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
}

myQRcode.callback = data => {
  if (data) {
    if(data.substring(0, 27) != base_url_allowed){
      showToast("This QR code doesn't belong to Zaitoon");
      return;
    }
    window.open(data)
    scanning = false;
    video.srcObject.getTracks().forEach(track => {
      track.stop();
    });
    canvasElement.hidden = true;
    btnScanQR.hidden = false;
    btnScanQRText.hidden = false;
  }
};

btnScanQR.onclick = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function(stream) {
      scanning = true;
      btnScanQR.hidden = true;
      btnScanQRText.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
};

function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}
