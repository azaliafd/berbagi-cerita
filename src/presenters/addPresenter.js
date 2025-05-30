import StoryModel from '../models/storyModel.js';
import AddView from '../views/addView.js';
import { initCamera, stopCamera, stopAllStreams } from '../utils/camera.js';

export default class AddPresenter {
  constructor({ container, onRendered }) {
    this.container = container;
    this.model = new StoryModel();
    this.coordinates = { lat: null, lon: null };
    this.cameraStream = null;
    this.onRendered = onRendered;

    this.view = new AddView(container, {
      onSubmit: this.handleSubmit.bind(this),
      onCameraStart: this.handleCameraStart.bind(this),
      onCameraStop: this.handleCameraStop.bind(this),
      onMapClick: this.handleMapClick.bind(this),
    });
  }

  async init() {
    this.view.renderForm();
    window.addEventListener('beforeunload', this.handlePageUnload.bind(this));

    if (typeof this.onRendered === 'function') {
      this.onRendered();
    }
  }

  handlePageUnload() {
    stopAllStreams();
  }

  async handleCameraStart(videoElement) {
    try {
      this.cameraStream = await initCamera(videoElement);
    } catch (err) {
      this.view.showError('Gagal mengakses kamera atau izin ditolak.');
      console.error('Kamera error:', err);
    }
  }

  handleCameraStop(videoElement) {
    stopCamera(videoElement);
    this.cameraStream = null;
  }

  handleMapClick(lat, lon) {
    this.coordinates = { lat, lon };
  }

  async handleSubmit({ description, photoFile }) {
    try {
      const { lat, lon } = this.coordinates;
      if (!lat || !lon) {
        this.view.showError('Silakan pilih lokasi pada peta.');
        return;
      }

      this.view.showLoading();

      await this.model.addStory({
        description,
        photo: photoFile,
        lat,
        lon,
      });

      this.view.showSuccess('Cerita berhasil ditambahkan!');
      this.handleCameraStop();
    } catch (error) {
      this.view.showError('Gagal menambahkan cerita.');
    }
  }
}
