//ADDING PUSH NOTIFICATIONS -----------------------------------------------

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const publicVapidKey = 'BKzx5iPJ1QipYxjMAE4fcjA3LsBk7iBssmvD3H2ZnYxebaygcbQjNPSC5mUbxKL3S8NrvLDIUHXX_s6WyHF76tU';

const triggerPush = document.querySelector('.trigger-push');

// function isPushNotificationSupported() {
//   return "serviceWorker" in navigator && "PushManager" in window;
// }

// function initializePushNotifications() {
//   // request user grant to show notification
//   return Notification.requestPermission(function(result) {
//     return result;
//   });
// }

async function triggerPushNotification() {
  if ('serviceWorker' in navigator) {
    const register = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    await fetch('/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } else {
    console.error('Service workers are not supported in this browser');
  }
}

triggerPush.addEventListener('click', () => {
  //initializePushNotifications().then(updateUserConsent);
  triggerPushNotification().catch(error => console.error(error));
});