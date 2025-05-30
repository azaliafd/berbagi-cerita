import { getAllStories, saveStory, deleteStory } from '../utils/db.js';

const BASE_URL = 'https://story-api.dicoding.dev/v1';

export default class StoryModel {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  _updateToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  async login(email, password) {
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Login gagal, periksa kredensial Anda.');
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.message || 'Login gagal.');
      }

      if (data.loginResult?.token) {
        this._updateToken(data.loginResult.token);
      }

      return data;
    } catch (err) {
      return { error: true, message: err.message || 'Gagal login' };
    }
  }

  async register(name, email, password) {
    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      return { error: true, message: err.message || 'Gagal mendaftar' };
    }
  }

  async getStories(location = 1) {
    try {
      const res = await fetch(`${BASE_URL}/stories?location=${location}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      if (!res.ok) {
        throw new Error('Gagal mengambil cerita');
      }

      return await res.json();
    } catch (err) {
      return { error: true, message: err.message || 'Gagal mengambil cerita' };
    }
  }

  async getStoryDetail(id) {
    try {
      const res = await fetch(`${BASE_URL}/stories/${id}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      if (!res.ok) {
        throw new Error('Gagal mengambil detail cerita');
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.message || 'Detail cerita tidak ditemukan');
      }

      return data;
    } catch (err) {
      return { error: true, message: err.message || 'Gagal mengambil detail cerita' };
    }
  }

  async addStory({ description, photo, lat, lon }) {
    if (!this.token) {
      throw new Error('Token tidak tersedia. Silakan login terlebih dahulu.');
    }

    try {
      const form = new FormData();
      form.append('description', description);
      form.append('photo', photo);

      if (lat != null && lon != null) {
        form.append('lat', lat);
        form.append('lon', lon);
      }

      const res = await fetch(`${BASE_URL}/stories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: form,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Gagal mengirim cerita');
      }

      return await res.json();
    } catch (err) {
      return { error: true, message: err.message || 'Gagal menambah cerita' };
    }
  }

  async saveStoryToDB(story) {
    try {
      await saveStory(story);
      return { success: true, message: 'Cerita berhasil disimpan secara offline' };
    } catch (error) {
      return { error: true, message: error.message || 'Gagal menyimpan cerita' };
    }
  }

  async getSavedStoryById(id) {
    try {
      const story = await getStoryById(id);
      return story;
    } catch (error) {
      return { error: true, message: error.message || 'Gagal mengambil cerita tersimpan' };
    }
  }

  async getAllSavedStories() {
    try {
      const stories = await getAllStories();
      return stories;
    } catch (error) {
      return { error: true, message: error.message || 'Gagal mengambil daftar cerita tersimpan' };
    }
  }

  async deleteSavedStory(id) {
    try {
      await deleteStory(id);
      return { success: true, message: 'Cerita berhasil dihapus dari penyimpanan' };
    } catch (error) {
      return { error: true, message: error.message || 'Gagal menghapus cerita' };
    }
  }

  saveStory(story) {
    return this.saveStoryToDB(story);
  }

  removeStory(id) {
    return this.deleteSavedStory(id);
  }
}
