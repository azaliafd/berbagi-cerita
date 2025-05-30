import StoryModel from '../models/storyModel.js';
import DetailView from '../views/detailView.js';

export default class DetailPresenter {
  constructor({ container, storyId, onRendered }) {
    this.container = container;
    this.storyId = storyId;
    this.model = new StoryModel();
    this.view = new DetailView(container);
    this.onRendered = onRendered;
  }

  async init() {
    try {
      this.view.showLoading();
      const response = await this.model.getStoryDetail(this.storyId);

      if (response.error) {
        this.view.showError(response.message || 'Gagal memuat cerita.');
        return;
      }

      const story = response.story;
      this.view.render(story);

      if (typeof this.onRendered === 'function') {
        this.onRendered();
      }
    } catch (error) {
      console.error(error);
      this.view.showError('Gagal memuat cerita.');
    }
  }
}
