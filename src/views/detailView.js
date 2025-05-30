export default class DetailView {
  constructor(container) {
    this.container = container;
  }

  showLoading() {
    this.container.innerHTML = `<div class="loading">Memuat detail cerita...</div>`;
  }

  showError(message) {
    this.container.innerHTML = `<div class="message error">${message}</div>`;
  }

  render(story) {
    if (!story || typeof story !== 'object') {
      this.showError('Data cerita tidak valid.');
      return;
    }

    const {
      name = 'Tanpa Nama',
      description = 'Tidak ada deskripsi',
      photoUrl = '',
      createdAt = '',
      lat,
      lon,
    } = story;

    const date = createdAt ? new Date(createdAt).toLocaleString('id-ID') : 'Tanggal tidak tersedia';

    this.container.innerHTML = `
      <main>
        <article class="story-detail" aria-label="Detail Cerita">
          <div class="story-image">
            ${photoUrl ? `<img src="${photoUrl}" alt="Foto oleh ${name}" />` : ''}
          </div>
          <div class="story-content">
            <h2 class="story-title">${name}</h2>
            <p class="story-description"><strong>Deskripsi:</strong> ${description}</p>
            <p class="story-date"><strong><i class="fa fa-calendar"></i> Tanggal:</strong> ${date}</p>
            ${lat && lon ? `<p><strong><i class="fa fa-map-marker"></i> Lokasi:</strong> (${lat.toFixed(4)}, ${lon.toFixed(4)})</p>` : ''}
            <a href="#home" class="back-link"><i class="fa fa-arrow-left"></i> Kembali</a>
          </div>
        </article>
      </main>
    `;
  }
}
