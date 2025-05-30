export default class AddView {
  constructor(container, { onSubmit, onCameraStart, onCameraStop, onMapClick }) {
    this.container = container;
    this.onSubmit = onSubmit;
    this.onCameraStart = onCameraStart;
    this.onCameraStop = onCameraStop;
    this.onMapClick = onMapClick;
    this.map = null;
  }

  renderForm() {
    this.container.innerHTML = `
      <section class="add-story-section">
        <form id="add-story-form" aria-label="Form Tambah Cerita">
          <h2>Tambah Cerita Baru</h2>
  
          <label for="description">Deskripsi Cerita:</label>
          <textarea name="description" id="description" required placeholder="Tuliskan cerita Anda..."></textarea>
  
          <label>Aktifkan Kamera:</label>
          <div class="camera-container">
            <video id="camera" autoplay playsinline></video>
            <canvas id="snapshot" style="display: none;"></canvas>
            <div class="camera-buttons">
              <button type="button" id="capture-btn" disabled>
                <i class="fas fa-camera-retro"></i> Ambil Foto
              </button>
              <button type="button" id="stop-camera-btn" disabled>
                <i class="fas fa-times-circle"></i> Tutup Kamera
              </button>
            </div>
          </div>

          <button type="button" id="start-camera-btn">
            <i class="fas fa-camera"></i> Buka Kamera
          </button>

          <label for="photo-preview">Preview Foto:</label>
          <div id="preview-container">
            <img id="photo-preview" alt="Pratinjau foto yang akan dikirim" style="display: none;" aria-hidden="true" />
          </div>
  
          <label for="map">Pilih Lokasi di Peta:</label>
          <div id="map" class="map-container"></div>
          <input type="hidden" name="lat" />
          <input type="hidden" name="lon" />
  
          <button type="submit">
            <i class="fas fa-paper-plane"></i> Kirim Cerita
          </button>
        </form>
  
        <p id="form-message" class="message" aria-live="polite"></p>
      </section>
    `;

    const form = this.container.querySelector('#add-story-form');
    const video = form.querySelector('#camera');
    const canvas = form.querySelector('#snapshot');
    const captureBtn = form.querySelector('#capture-btn');
    const startBtn = form.querySelector('#start-camera-btn');
    const stopBtn = form.querySelector('#stop-camera-btn');
    const preview = form.querySelector('#photo-preview');

    let photoBlob = null;

    startBtn.addEventListener('click', async () => {
      try {
        await this.onCameraStart(video);
        captureBtn.disabled = false;
        stopBtn.disabled = false;
        startBtn.disabled = true;
      } catch (err) {
        this.showError('Kamera tidak tersedia atau izin ditolak.');
      }
    });

    captureBtn.addEventListener('click', () => {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        photoBlob = blob;
        const url = URL.createObjectURL(blob);
        preview.src = url;
        preview.style.display = 'block';
      }, 'image/jpeg');
    });

    stopBtn.addEventListener('click', () => {
      this.onCameraStop(video);
      video.srcObject = null;
      captureBtn.disabled = true;
      stopBtn.disabled = true;
      startBtn.disabled = false;
    });

    this._initMap(form);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const description = form.description.value;
      const lat = parseFloat(form.lat.value);
      const lon = parseFloat(form.lon.value);

      if (!description || !photoBlob || isNaN(lat) || isNaN(lon)) {
        this.showError('Lengkapi semua field dan ambil foto.');
        return;
      }

      const photoFile = new File([photoBlob], 'photo.jpg', { type: 'image/jpeg' });
      await this.onSubmit({ description, photoFile, lat, lon });
    });
  }

  _initMap(form) {
    const mapElement = this.container.querySelector('#map');
    this.map = L.map(mapElement).setView([-6.2, 106.8], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    let marker = null;

    this.map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      form.lat.value = lat;
      form.lon.value = lng;

      if (this.onMapClick) this.onMapClick(lat, lng);

      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng).addTo(this.map);
      }
    });
  }

  showLoading() {
    this._setMessage('Mengirim cerita...', 'loading');
  }

  showSuccess(msg) {
    this._setMessage(msg, 'success');
  }

  showError(msg) {
    this._setMessage(msg, 'error');
  }

  _setMessage(text, type) {
    const el = this.container.querySelector('#form-message');
    el.textContent = text;
    el.className = `message ${type}`;
  }
}
