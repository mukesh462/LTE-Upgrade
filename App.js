import "react-native-gesture-handler";

import { StyleSheet, Alert, DevSettings } from "react-native";
import AppRoutes from "./src/routes/AppRoutes";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import axios from "axios";
import { CONST } from "./constants";
import { enableScreens } from "react-native-screens";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  // const requestUserPermission = async () => {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log("Authorization status:", authStatus);
  //   }
  // };

  // useEffect(() => {

  //   if (requestUserPermission()) {
  //     messaging()
  //       .getToken()
  //       .then(
  //         token => console.log(token)
  //       );
  //   }
  // }, []);

  // Notifications.setNotificationHandler({
  //   handleNotification: async () => ({
  //     shouldShowAlert: true,
  //     shouldPlaySound: true,
  //     shouldSetBadge: false,
  //   }),
  // });

  // const handleNotificationClick = async (response) => {
  //   const screen = response?.notification?.request?.content?.data?.screen;
  //   if (screen !== null) {
  //     navigation.navigate(screen);
  //   }
  // };

  // useEffect(() => {
  //   const notificationClickSubscription =
  //     Notifications.addNotificationResponseReceivedListener(
  //       handleNotificationClick
  //     );

  //   messaging().onNotificationOpenedApp((remoteMessage) => {
  //     console.log(
  //       "Notification caused app to open from background state:",
  //       remoteMessage.data.screen,
  //       navigation
  //     );
  //     if (remoteMessage?.data?.screen) {
  //       navigation.navigate(`${remoteMessage.data.screen}`);
  //     }
  //   });

  //   messaging()
  //     .getInitialNotification()
  //     .then((remoteMessage) => {
  //       if (remoteMessage) {
  //         console.log(
  //           "Notification caused app to open from quit state:",
  //           remoteMessage.notification
  //         );
  //         if (remoteMessage?.data?.screen) {
  //           navigation.navigate(`${remoteMessage.data.screen}`);
  //         }
  //       }
  //     });

  //   messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  //     console.log("Message handled in the background!", remoteMessage);
  //     const notification = {
  //       title: remoteMessage.notification.title,
  //       body: remoteMessage.notification.body,
  //       data: remoteMessage.data, // optional data payload
  //     };

  //     // Schedule the notification with a null trigger to show immediately
  //     await Notifications.scheduleNotificationAsync({
  //       content: notification,
  //       trigger: null,
  //     });
  //   });

  //   // Handle push notifications when the app is in the foreground
  //   const handlePushNotification = async (remoteMessage) => {
  //     const notification = {
  //       title: remoteMessage.notification.title,
  //       body: remoteMessage.notification.body,
  //       data: remoteMessage.data, // optional data payload
  //     };

  //     await Notifications.scheduleNotificationAsync({
  //       content: notification,
  //       trigger: null,
  //     });
  //   };

  //   const unsubscribe = messaging().onMessage(handlePushNotification);

  //   // Clean up the event listeners
  //   return () => {
  //     unsubscribe();
  //     notificationClickSubscription.remove();
  //   };
  // }, []);

  // useEffect(() => {
  //   const unsubscribe = addEventListener(state => {
  //     if(!state.isConnected){
  //       Alert.alert('Internet Check', 'Please check your connection', [
  //         {
  //           text: 'Okay',
  //           onPress: () => DevSettings.reload(),
  //         },
  //       ])
  //     }
  //   });

  //   // Unsubscribe
  //   unsubscribe();
  // })

  enableScreens(); // this is crucial

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  const handlePushNotification = async (remoteMessage) => {
    const notification = {
      title: remoteMessage?.notification?.title,
      body: remoteMessage?.notification?.body,
      data: remoteMessage?.data, // optional data payload
    };

    await Notifications.scheduleNotificationAsync({
      content: notification,
      trigger: null,
    });
  };
  useEffect(() => {
    const foregroundSub = Notifications.addNotificationReceivedListener(
      handlePushNotification
    );
    const responseSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const screen = response?.notification?.request?.content?.data?.screen;
        if (screen) navigate(screen);
      }
    );

    return () => {
      foregroundSub.remove();
      responseSub.remove();
    };
  }, []);
  async function lockSessions() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-based, so we add 1
    const year = date.getFullYear();
    console.log({
      todayDate: year + "-" + month + "-" + day,
    });

    axios
      .post(`${CONST.baseUrl}/teacherapp/lock/sessions`, {
        todayDate: year + "-" + month + "-" + day,
      })
      .then((res) => {
        console.log(res.data, "Locked");
      })
      .catch((err) => {
        console.log(err.response.data, "ERROR");
      })
      .finally(() => {});
  }

  useEffect(() => {
    lockSessions();
  }, []);

  const [loaded] = useFonts({
    NunitoSansBold: require("./assets/fonts/NunitoSans-Bold.ttf"),
    NunitoSansSemiBold: require("./assets/fonts/NunitoSans-SemiBold.ttf"),
    // NunitoSansMedium: require("./assets/fonts/SF-Pro-Text-Medium.otf"),
    NunitoSansRegular: require("./assets/fonts/NunitoSans-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppRoutes />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
