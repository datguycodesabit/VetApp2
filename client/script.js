const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const statusText = document.getElementById('statusText');
const captureBtn = document.getElementById('capture');

async function startCamera() {
  try {
    const constraints = {
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;

    video.setAttribute('playsinline', true);
    await video.play();

    statusText.textContent = "Camera ready (back camera).";
  } catch (err) {
    console.error('Camera error:', err);
    statusText.textContent = "Unable to access camera. Check permissions and HTTPS.";
  }
}

// transcode image to OCR readable jpeg
function canvasToBlob(canvas, type = 'image/jpeg', quality = 0.95) {
  return new Promise((resolve, reject) => {
    if (canvas.width === 0 || canvas.height === 0) {
      reject(new Error("Canvas has zero width or height"));
      return;
    }
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to create Blob from canvas"));
    }, type, quality);
  });
}

captureBtn.addEventListener('click', async () => {
  captureBtn.disabled = true;
  statusText.textContent = "Capturing image...";

  try {
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const blob = await canvasToBlob(canvas);
    const formData = new FormData();
    formData.append('image', blob, 'capture.jpg');

    statusText.textContent = "Uploading...";

    const response = await fetch('/upload', { method: 'POST', body: formData });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    const result = await response.json();
    statusText.textContent = `Uploaded: ${result.image}\n🪶 Text: ${result.text}`;
    console.log(result);

  } catch (err) {
    console.error(err);
    statusText.textContent = `Failed: ${err.message}`;
  } finally {
    captureBtn.disabled = false;
  }
});

//copy button function
const resultBox = document.getElementById('resultBox');
const ocrText = document.getElementById('ocrText');
const copyBtn = document.getElementById('copyBtn');

function setStatus(message, type = "info") {
  statusText.textContent = message;
  statusText.classList.remove("text-blue-600", "text-green-600", "text-red-600");
  if (type === "success") statusText.classList.add("text-green-600");
  else if (type === "error") statusText.classList.add("text-red-600");
  else statusText.classList.add("text-blue-600");
}

const origFetch = window.fetch;
window.fetch = async (...args) => {
  const res = await origFetch(...args);
  if (res.ok && args[0] === '/upload') {
    const cloned = res.clone();
    cloned.json()
      .then(data => {

/* remove server fetch
        fetch(`/uploads/text/${data.text}`)
          .then(r => r.text())
          .then(text => {
            ocrText.textContent = text;
            resultBox.classList.remove('hidden');
            setStatus("OCR completed", "success");
          });
*/

        
        setStatus("Image successfully uploaded!", "success");
      })
      .catch(console.error);
  }
  return res;
};

/* remove copy button logic
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(ocrText.textContent);
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
  } catch (err) {
    alert("Failed to copy text.");
  }
});
*/

startCamera();
