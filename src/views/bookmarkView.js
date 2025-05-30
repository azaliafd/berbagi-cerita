export default class BookmarkView {
  constructor(container, { onRemoveBookmark }) {
    this.container = container;
    this.onRemoveBookmark = onRemoveBookmark;
  }

  showLoading() {
    this.container.innerHTML = `<div class="loading">Memuat daftar bookmark...</div>`;
  }

  showError(message) {
    this.container.innerHTML = `<div class="message error">${message}</div>`;
  }

  render(stories = []) {
    if (!Array.isArray(stories) || stories.length === 0) {
      this.container.innerHTML = `<p class="empty-message">Belum ada cerita yang disimpan sebagai bookmark.</p>`;
      return;
    }

    const listEl = document.createElement('section');
    listEl.className = 'bookmark-list';
    listEl.setAttribute('aria-label', 'Daftar Cerita Bookmark');

    stories.forEach((story) => {
      const item = document.createElement('article');
      item.className = 'bookmark-item';
      item.setAttribute('aria-label', `Cerita: ${story.name || 'Tanpa Nama'}`);

      item.innerHTML = `
        <img src="${story.photoUrl || ''}" alt="Foto oleh ${story.name || 'Tanpa Nama'}" />
        <h3>${story.name || 'Tanpa Nama'}</h3>
        <p>${story.description || 'Tidak ada deskripsi'}</p>
        <small><i class="fa fa-calendar"></i> ${story.createdAt ? new Date(story.createdAt).toLocaleString() : ''}</small>
        <a href="#detail/${story.id}" aria-label="Lihat detail cerita ${story.name || 'Tanpa Nama'}">Detail</a>
        <button class="remove-bookmark-btn" data-id="${story.id}">Buang Informasi</button>
      `;

      const btn = item.querySelector('.remove-bookmark-btn');
      btn.addEventListener('click', () => {
        if (typeof this.onRemoveBookmark === 'function') {
          this.onRemoveBookmark(story.id);
        }
      });

      listEl.appendChild(item);
    });

    this.container.innerHTML = '';
    this.container.appendChild(listEl);
  }
}
