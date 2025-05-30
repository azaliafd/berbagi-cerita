import HomeView from '../views/homeView.js';
import StoryModel from '../models/storyModel.js';

export default class HomePresenter {
  constructor({ container, onRendered }) {
    this.container = container;
    this.model = new StoryModel();

    this.view = new HomeView(container, {
      onLogout: this.logout.bind(this),
      onToggleBookmark: this.handleBookmarkToggle.bind(this),
    });

    this.onRendered = onRendered;
    this.savedStoryIds = new Set();
  }

  async init() {
    const token = localStorage.getItem('token');
    if (!token) {
      location.hash = '#/login';
      return;
    }

    try {
      this.view.showLoading();

      const [response, saved] = await Promise.all([
        this.model.getStories(1, token),
        this.model.getAllSavedStories(),
      ]);

      this.savedStoryIds = new Set(saved.map((s) => s.id));
      this.stories = response.listStory;

      this.view.renderStories(this.stories, this.savedStoryIds);
    } catch (error) {
      this.view.showError('Gagal memuat cerita.');
    }

    if (typeof this.onRendered === 'function') {
      this.onRendered();
    }
  }

  async handleBookmarkToggle(storyId, shouldSave) {
    try {
      const story = this.stories.find((s) => s.id === storyId);
      if (!story) return;

      if (shouldSave) {
        await this.model.saveStory(story);
        this.savedStoryIds.add(storyId);
      } else {
        await this.model.removeStory(storyId);
        this.savedStoryIds.delete(storyId);
      }

      this.view.renderStories(this.stories, this.savedStoryIds);
    } catch (error) {
      console.error('Gagal memproses bookmark:', error);
    }
  }

  logout() {
    localStorage.removeItem('token');
    window.location.hash = '#login';
  }
}
