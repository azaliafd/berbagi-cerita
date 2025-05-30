let currentStreams = [];

export function initCamera(videoElement) {
  return navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      if (!Array.isArray(window.currentStreams)) {
        window.currentStreams = [];
      }
      window.currentStreams.push(stream);
      videoElement.srcObject = stream;
      videoElement.play();
      return stream;
    })
    .catch((err) => {
      console.error('Error accessing camera: ', err);
      throw new Error('Gagal mengakses kamera atau izin ditolak.');
    });
}

export function stopCamera(videoElement) {
  if (videoElement && videoElement.srcObject) {
    const stream = videoElement.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    videoElement.srcObject = null;

    window.currentStreams = window.currentStreams.filter((s) => s !== stream);
  }
}

export function stopAllStreams() {
  if (Array.isArray(window.currentStreams)) {
    window.currentStreams.forEach((stream) => {
      if (stream.active) {
        stream.getTracks().forEach((track) => track.stop());
      }
    });

    window.currentStreams = [];
  }
}
