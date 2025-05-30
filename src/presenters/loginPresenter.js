import LoginView from '../views/loginView.js';
import StoryModel from '../models/storyModel.js';

const loginPresenter = {
  async render(container) {
    const model = new StoryModel();
    const view = new LoginView(container, async (email, password) => {
      if (!email || !password) {
        view.showMessage('Email dan password harus diisi.');
        return;
      }

      const response = await model.login(email, password);
      if (response.error) {
        view.showMessage('Gagal login: ' + response.message);
        return;
      }

      view.showMessage('Login berhasil!');

      const redirectPath = localStorage.getItem('redirectAfterLogin') || '#home';
      localStorage.removeItem('redirectAfterLogin');

      location.hash = redirectPath;
    });

    view.render();
  },
};

export default loginPresenter;
