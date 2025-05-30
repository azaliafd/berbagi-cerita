import HomePresenter from '../presenters/homePresenter.js';
import AddPresenter from '../presenters/addPresenter.js';
import BookmarkPresenter from '../presenters/bookmarkPresenter.js';
import DetailPresenter from '../presenters/detailPresenter.js';
import LoginPresenter from '../presenters/loginPresenter.js';
import SignupPresenter from '../presenters/signupPresenter.js';
import NotFoundPresenter from '../presenters/NotFoundPresenter.js';

function smoothTransition(callback) {
  if (document.startViewTransition) {
    document.startViewTransition(callback);
  } else {
    callback();
  }
}

export default class Router {
  constructor({ container }) {
    this.container = container;
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }

  handleRoute() {
    const hash = window.location.hash || '#home';
    const [rawPath, param] = hash.replace('#', '').split('/');
    console.log('🚀 ROUTER: rawPath =', rawPath, ', param =', param);

    smoothTransition(() => {
      const oldPage = this.container.querySelector('.page');
      if (oldPage) {
        oldPage.remove();
      }

      const newPage = document.createElement('div');
      newPage.classList.add('page');
      newPage.style.viewTransitionName = 'page';
      this.container.appendChild(newPage);

      const token = localStorage.getItem('token');

      switch (rawPath) {
        case 'home':
          if (!token) {
            window.location.hash = '#login';
          } else {
            new HomePresenter({
              container: newPage,
              onRendered: () => newPage.classList.add('active'),
            }).init();
          }
          break;

        case 'add-story':
          if (!token) {
            localStorage.setItem('redirectAfterLogin', '#add-story');
            window.location.hash = '#login';
          } else {
            new AddPresenter({
              container: newPage,
              onRendered: () => newPage.classList.add('active'),
            }).init();
          }
          break;

        case 'detail':
          if (param) {
            new DetailPresenter({
              container: newPage,
              storyId: param,
              onRendered: () => newPage.classList.add('active'),
            }).init();
          } else {
            newPage.innerHTML = '<p>ID cerita tidak ditemukan.</p>';
            newPage.classList.add('active');
          }
          break;

        case 'bookmark':
          if (!token) {
            window.location.hash = '#login';
          } else {
            new BookmarkPresenter({
              container: newPage,
            }).init();
            newPage.classList.add('active');
          }
          break;

        case 'login':
          LoginPresenter.render(newPage);
          newPage.classList.add('active');
          break;

        case 'signup':
          SignupPresenter.render(newPage);
          newPage.classList.add('active');
          break;

        case 'logout':
          localStorage.removeItem('token');
          window.location.hash = '#login';
          break;

        default:
          new NotFoundPresenter({
            container: newPage,
            onRendered: () => newPage.classList.add('active'),
          }).init();
          break;
      }
    });
  }
}
