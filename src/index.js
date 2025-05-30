import Router from './router/router.js';
import './styles/style.css?v=123';
import { stopAllStreams } from './utils/camera.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { subscribeUserToPush, unsubscribeUser } from './utils/pushHelper.js';

let skipToContentRequested = false;

const userToken = localStorage.getItem('token');

async function askNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Izin notifikasi ditolak');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const appContainer = document.getElementById('app');
  const router = new Router({ container: appContainer });

  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('✅ Service Worker terdaftar:', registration);

      const btnSubscribe = document.querySelector('#btn-subscribe-push');
      let isSubscribed = false;

      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        isSubscribed = true;
        btnSubscribe.textContent = 'Unsubscribe';
      } else {
        btnSubscribe.textContent = 'Subscribe';
      }

      btnSubscribe.addEventListener('click', async () => {
        if (!isSubscribed) {
          try {
            await askNotificationPermission();
            await subscribeUserToPush(registration, userToken);
            isSubscribed = true;
            btnSubscribe.textContent = 'Unsubscribe';
            alert('Berhasil berlangganan notifikasi!');
          } catch (err) {
            alert('Gagal berlangganan: ' + err.message);
          }
        } else {
          try {
            await unsubscribeUser(registration, userToken);
            isSubscribed = false;
            btnSubscribe.textContent = 'Subscribe';
            alert('Berhasil berhenti berlangganan notifikasi');
          } catch (err) {
            alert('Gagal berhenti berlangganan: ' + err.message);
          }
        }
      });
    } catch (error) {
      console.error('❌ Registrasi Service Worker gagal:', error);
    }
  } else {
    alert('Push Notification tidak didukung oleh browser ini.');
  }

  window.addEventListener('hashchange', () => {
    stopAllStreams();

    if (skipToContentRequested) {
      setTimeout(() => {
        const firstFocusable = appContainer.querySelector(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          appContainer.setAttribute('tabindex', '-1');
          appContainer.focus();
        }
        skipToContentRequested = false;
      }, 300);
    }
  });

  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      appContainer.setAttribute('tabindex', '-1');
      appContainer.focus();
      appContainer.scrollIntoView({ behavior: 'smooth' });
      skipToContentRequested = true;
    });
  }
});
