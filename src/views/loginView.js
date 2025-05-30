export default class LoginView {
  constructor(container, onSubmit) {
    this.container = container;
    this.onSubmit = onSubmit;
  }

  render() {
    this.container.innerHTML = `
      <section class="login-section">
        <div class="login-card">
          <h2 class="login-title">Masuk ke Akun Anda</h2>
          <form id="loginForm" class="login-form" aria-label="Formulir Login">
            <div class="form-group">
              <label for="email">Email</label>
              <div class="input-icon">
                <i class="fa fa-envelope"></i>
                <input type="email" id="email" placeholder="you@example.com" required />
              </div>
            </div>

            <div class="form-group">
              <label for="password">Kata Sandi</label>
              <div class="input-icon">
                <i class="fa fa-key"></i>
                <input type="password" id="password" placeholder="********" required />
              </div>
            </div>

            <button type="submit" class="login-btn"><i class="fa fa-sign-in-alt"></i> Login</button>
          </form>
          <p id="loginMessage" class="login-message"></p>
        </div>
      </section>
    `;

    const form = this.container.querySelector('#loginForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = this.container.querySelector('#email').value;
      const password = this.container.querySelector('#password').value;
      this.onSubmit(email, password);
    });
  }

  showMessage(text) {
    const message = this.container.querySelector('#loginMessage');
    if (message) {
      message.textContent = text;
    }
  }
}
