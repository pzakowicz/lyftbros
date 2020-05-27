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

let subscription = {};

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator && "PushManager" in window) {
    Notification.requestPermission();
    const register = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });
    console.log("Service worker registered");
    setTimeout(async function() {
      subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    console.log("Subscription registered", subscription);
    //save subscribtion to database
      if (subscription) {
        let response = await fetch(`/api/subscriptions/save`,
        {
           method: "POST",
           credentials: "include",
           headers: {
             "Content-Type": "application/json"
         },
        body: JSON.stringify(subscription),
       })
    
       console.log("Response is: ", response);
        if (response.status === 201) {
          console.log("Subscription saved to database");
  
        } else if (response.status === 400){
          console.log("Subscription save failed");
        }
      }

    }, 3000)


   } else {
  console.error('Service workers are not supported in this browser');
  }
}

export async function triggerPushNotification() {

    await fetch('/api/subscriptions/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json',
      },
    });

}
