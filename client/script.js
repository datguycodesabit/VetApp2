const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const statusText = document.getElementById('statusText');
const captureBtn = document.getElementById('capture');

async function Camera() {
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

    statusText.textContent = "Camera ready.";
  } catch (err) {
    console.error('Camera error:', err);
    statusText.textContent = "Unable to access camera. Check browser permissions.";
  }
}

// transcode image to jpeg
function toBlob(canvas, type = 'image/jpeg', quality = 0.96) {
  return new Promise((resolve, reject) => {
    if (canvas.width === 0 || canvas.height === 0) {
      reject(new Error("No video source found."));
      return;
    }
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error("blob failed"));
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

    const blob = await toBlob(canvas);
    const formData = new FormData();
    formData.append('image', blob, 'capture.jpg');

    statusText.textContent = "Uploading...";

    const response = await fetch('/upload', {  method: 'POST',  body: formData}); 
    if (!response.ok) {throw new Error(`Upload failed (${response.status})`);
  }

  const result = await response.json();

  setStatus("Image successfully uploaded!", "success");
  console.log("Upload result:", result);

  } catch (err) {
    console.error(err);
    statusText.textContent = `Failed: ${err.message}`;
  } finally {
    captureBtn.disabled = false;
  }
});

function setStatus(message, type = "info") {
  statusText.textContent = message;
  statusText.classList.remove("text-blue-600", "text-green-600", "text-red-600");
  if (type === "success") statusText.classList.add("text-green-600");
  else if (type === "error") statusText.classList.add("text-red-600");
  else statusText.classList.add("text-blue-600");
}

Camera();
