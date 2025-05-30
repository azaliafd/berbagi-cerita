export default class HomeView {
  constructor(container, { onLogout, onToggleBookmark }) {
    this.container = container;
    this.map = null;
    this.markers = [];
    this.onLogout = onLogout;
    this.onToggleBookmark = onToggleBookmark;
  }

  showLoading() {
    this.container.innerHTML = '<p>Loading stories...</p>';
  }

  showError(message) {
    this.container.innerHTML = `<p class="error">${message}</p>`;
  }

  renderStories(stories, savedStoryIds = new Set()) {
    this.container.innerHTML = `
      <main>
        <section class="story-list" aria-label="Daftar Cerita"></section>
        <div id="map" class="map-container" aria-label="Peta Lokasi Cerita"></div>
        <button id="logoutBtn" class="logout-btn"><i class="fa fa-sign-out"></i> Logout</button>
      </main>
    `;

    const listEl = this.container.querySelector('.story-list');
    const mapEl = this.container.querySelector('#map');
    const logoutBtn = this.container.querySelector('#logoutBtn');

    logoutBtn.addEventListener('click', () => {
      if (typeof this.onLogout === 'function') {
        this.onLogout();
      }
    });

    stories.forEach((story) => {
      const isBookmarked = savedStoryIds.has(story.id);
      const btnText = isBookmarked ? 'Buang Informasi' : 'Simpan Informasi';

      const item = document.createElement('article');
      item.className = 'story-item';
      item.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" />
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <small><i class="fa fa-calendar"></i> ${new Date(story.createdAt).toLocaleString()}</small>
        <a href="#detail/${story.id}" aria-label="Lihat detail cerita ${story.name}">Detail</a>
        <button class="bookmark-btn" data-id="${story.id}">${btnText}</button>
      `;

      const btn = item.querySelector('.bookmark-btn');
      if (isBookmarked) {
        btn.classList.add('remove-bookmark-btn');
      } else {
        btn.classList.add('bookmark-btn');
      }

      btn.addEventListener('click', () => {
        if (typeof this.onToggleBookmark === 'function') {
          this.onToggleBookmark(story.id, !isBookmarked);
        }
      });

      listEl.appendChild(item);
    });

    listEl.classList.add('fade-in');
    this._initMap(mapEl, stories);
  }

  _initMap(mapEl, stories) {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map(mapEl).setView([0, 0], 2);

    const baseLayers = {
      Default: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }),
      Bright: L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'),
    };

    baseLayers.Default.addTo(this.map);
    L.control.layers(baseLayers).addTo(this.map);

    const bounds = [];

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const coords = [story.lat, story.lon];
        const marker = L.marker(coords).addTo(this.map);
        marker.bindPopup(
          `<strong><i class="fa fa-map-marker"></i> ${story.name}</strong><br>${story.description}`
        );
        this.markers.push(marker);
        bounds.push(coords);
      }
    });

    if (bounds.length > 0) {
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }
}
