import BookmarkView from '../views/bookmarkView.js';
import StoryModel from '../models/storyModel.js';

export default class BookmarkPresenter {
  constructor({ container }) {
    this.container = container;
    this.model = new StoryModel();

    this.view = new BookmarkView(container, {
      onRemoveBookmark: this.handleRemoveBookmark.bind(this),
    });
  }

  async init() {
    await this.loadBookmarks();
  }

  async loadBookmarks() {
    try {
      this.view.showLoading();
      const stories = await this.model.getAllSavedStories();
      this.stories = stories;
      this.view.render(stories);
    } catch (error) {
      this.view.showError(error.message || 'Gagal memuat bookmark');
    }
  }

  async handleRemoveBookmark(storyId) {
    try {
      await this.model.removeStory(storyId);
      this.stories = this.stories.filter((s) => s.id !== storyId);
      this.view.render(this.stories);
    } catch (error) {
      console.error('Gagal menghapus bookmark:', error);
    }
  }
}
