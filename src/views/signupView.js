export default class SignupView {
  constructor(container, onSubmit) {
    this.container = container;
    this.onSubmit = onSubmit;
  }

  render() {
    this.wrapper = document.createElement('section');
    this.wrapper.classList.add('signup-section');

    this.wrapper.innerHTML = `
      <div class="signup-card">
        <h2 class="signup-title">Daftar Akun Baru</h2>
        <form id="signupForm" class="signup-form" aria-label="Formulir Pendaftaran">
          <div class="form-group">
            <label for="name">Nama:</label>
            <div class="input-icon">
              <i class="fa fa-user"></i>
              <input type="text" id="name" name="name" required />
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email:</label>
            <div class="input-icon">
              <i class="fa fa-envelope"></i>
              <input type="email" id="email" name="email" required />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Kata Sandi:</label>
            <div class="input-icon">
              <i class="fa fa-key"></i>
              <input type="password" id="password" name="password" required />
            </div>
          </div>

          <button type="submit" class="signup-btn">
            <i class="fa fa-user-plus"></i> Signup
          </button>
        </form>
        <p id="signupMessage" class="signup-message" aria-live="polite"></p>
      </div>
    `;

    const form = this.wrapper.querySelector('#signupForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        name: form.name.value,
        email: form.email.value,
        password: form.password.value,
      };
      this.onSubmit(data);
    });

    this.container.innerHTML = '';
    this.container.appendChild(this.wrapper);
  }

  showMessage(message, isError = false) {
    const msgEl = this.wrapper.querySelector('#signupMessage');
    msgEl.textContent = message;
    msgEl.style.color = isError ? 'red' : 'green';
  }
}
