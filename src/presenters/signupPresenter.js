import SignupView from '../views/signupView.js';
import StoryModel from '../models/storyModel.js';

const signupPresenter = {
  render(container) {
    const model = new StoryModel();
    const view = new SignupView(container, async ({ name, email, password }) => {
      const response = await model.register(name, email, password);

      if (response.error) {
        view.showMessage('Gagal daftar: ' + response.message, true);
        return;
      }

      view.showMessage('Berhasil daftar. Silakan login.');
      setTimeout(() => {
        window.location.hash = '#login';
      }, 1500);
    });

    view.render();
  },
};

export default signupPresenter;
