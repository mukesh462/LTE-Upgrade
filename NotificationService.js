import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';

export default function useFirebaseToken() {
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      console.log('FCM Token:', token);
      setFcmToken(token);
    });
  }, []);

  return fcmToken;
}

async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token!');
      return;
    }

    // This gets the **Firebase FCM token**
    const { data: fcmToken } = await Notifications.getDevicePushTokenAsync();
    return fcmToken;
  } else {
    // alert('Must use a physical device');
  }
}
