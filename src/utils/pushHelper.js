const VAPID_PUBLIC_KEY =
  'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeUserToPush(registration, token) {
  try {
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log('Sudah berlangganan, tidak perlu subscribe ulang');
      return existingSubscription;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    const subscriptionData = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.getKey('p256dh')
          ? btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh'))))
          : '',
        auth: subscription.getKey('auth')
          ? btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth'))))
          : '',
      },
    };

    const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscriptionData),
    });

    if (!response.ok) throw new Error('Gagal subscribe ke server Dicoding');

    const result = await response.json();
    console.log('Berhasil subscribe ke Dicoding:', result);

    return subscription;
  } catch (error) {
    console.error('subscribeUserToPush error:', error);
    throw error;
  }
}

export async function unsubscribeUser(registration, token) {
  try {
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      const endpoint = subscription.endpoint;

      const success = await subscription.unsubscribe();
      if (success) {
        console.log('Unsubscribed from browser');

        const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ endpoint }),
        });

        if (!response.ok) throw new Error('Gagal menghapus subscription di server Dicoding');

        const result = await response.json();
        console.log('Subscription dihapus di server:', result.message);
      } else {
        console.warn('Gagal unsubscribe dari browser');
      }
    } else {
      console.log('Tidak ada subscription aktif');
    }
  } catch (error) {
    console.error('unsubscribeUser error:', error);
    throw error;
  }
}
