import NotFoundView from '../views/NotFoundView.js';

export default class NotFoundPresenter {
  constructor({ container, onRendered }) {
    this.container = container;
    this.onRendered = onRendered;
  }

  async init() {
    this.container.innerHTML = await NotFoundView.render();
    if (NotFoundView.afterRender) {
      await NotFoundView.afterRender();
    }
    if (this.onRendered) {
      this.onRendered();
    }
  }
}
