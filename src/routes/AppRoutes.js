import "react-native-gesture-handler";

import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import { Text } from "react-native";
import Login from "../components/functional components/Auth/Login";
import TermsConditions from "../components/functional components/TermsConditions/TermsConditions";
import HomeTabView from "../components/functional components/Home/HomeTabView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnBoardingScreen from "../components/functional components/OnBoardingComponent/OnBoardingScreen";
import OnBoardingRoutes from "../components/functional components/OnBoardingComponent/OnBoardingRoutes";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import ContactSpoc from "../components/functional components/Profile/ContactSpoc";
import ForgotPassword from "../components/functional components/Auth/ForgotPassword";
import axios from "axios";
import Notification from "../components/functional components/Home/Notifications";
// import messaging from '@react-native-firebase/messaging';
import { COLORS, SIZES, FONTS, assets, CONST } from "../../constants/constants";
import PrivacyPolicy from "../components/functional components/Profile/PrivacyPolicy";
import useFirebaseToken from "../../NotificationService";

const AppRoutes = ({ navigation }) => {
  const Stack = createNativeStackNavigator();
  const [state, setState] = useState(false);
  const [isBoarded, setBoarded] = useState(false);
  const token = useFirebaseToken();

  const finishAuth = React.useCallback(() => {
    setState(false);
    getData();
  }, []);

  const theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      background: "white",
    },
  };

  const saveBoardingState = async () => {
    try {
      AsyncStorage.setItem("FirstTime", "true").then();
    } catch (err) {
      console.error(err);
    }
  };

  const finishBoarding = () => {
    setBoarded(true);
    saveBoardingState();
  };

  async function logout() {
    console.log("called logout");

    const result = await AsyncStorage.getItem("AuthState");
    if (result === null && result == "-1") return;

    // const token = await messaging().getToken()
    const payload = {
      user_id: result,
      device_token: token,
    };

    let promises = [];

    promises.push(
      axios.post(`${CONST.baseUrl}/teacher/get/teacherlogout`, payload)
    );
    Promise.all(promises)
      .then(async (values) => {
        await AsyncStorage.setItem("AuthState", "-1");
        setState(true);
      })
      .catch(async (err) => {
        console.log(err.response.data);
        await AsyncStorage.setItem("AuthState", "-1");
        setState(true);
      });
  }

  const getData = async () => {
    try {
      const result = await AsyncStorage.getItem("AuthState");
      if (result !== null && result != "-1") {
        setState(false);

        const payload = {
          user_id: result,
          device_token: token,
        };
        axios
          .post(`${CONST.baseUrl}/teacher/get/teacherloginExp`, payload)
          .then((response) => {
            if (response.data.do_logout) logout();
          });

        axios
          .post(`${CONST.baseUrl}/teacherapp/get/teacherStatus`, {
            teacher_id: result,
          })
          .then((res) => {
            // console.log("Activity:");
            // console.log(res.data);
            if (res.data[0].teacher_status !== "active") logout();
          });
      } else {
        setState(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getBoardedData = async () => {
    try {
      const result = await AsyncStorage.getItem("FirstTime");
      if (result !== null) {
        setBoarded(true);
      } else {
        setBoarded(false);
      }
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await getData();
      await getBoardedData();
    };
    fetchData();
  }, []);

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{ contentStyle: { backgroundColor: "#FFFFFF" } }}
      >
        <Stack.Group screenOptions={{}}>
          {state ? (
            <Stack.Group screenOptions={{}}>
              {isBoarded ? (
                <Stack.Group screenOptions={{}}>
                  <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ header: () => null }}
                    initialParams={{ finishAuth }}
                  />
                  <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPassword}
                    options={{ header: () => null }}
                  />

                  <Stack.Screen
                    name="TermsConditions"
                    component={TermsConditions}
                    options={{ header: () => null }}
                    initialParams={{ finishAuth }}
                  />
                </Stack.Group>
              ) : (
                <Stack.Group screenOptions={{}}>
                  <Stack.Screen
                    name="Landing"
                    component={OnBoardingRoutes}
                    options={{ header: () => null }}
                    initialParams={{ finishBoarding }}
                  />
                </Stack.Group>
              )}
            </Stack.Group>
          ) : (
            <Stack.Group screenOptions={{}}>
              <Stack.Screen
                name="HomeTabView"
                component={HomeTabView}
                initialParams={{ logout }}
                options={({ navigation, route }) => ({
                  headerShown: false,
                })}
              />
              <Stack.Screen
                name="Contact SPOC"
                component={ContactSpoc}
                initialParams={{ logout }}
                options={({ navigation, route }) => ({
                  headerShown: false,
                })}
              />
              <Stack.Screen
                name="Notifications"
                component={Notification}
                options={({ navigation, route }) => ({
                  headerShown: false,
                })}
              />

              <Stack.Screen
                name="PrivacyPolicy"
                component={PrivacyPolicy}
                options={({ navigation, route }) => ({
                  headerShown: false,
                })}
              />
            </Stack.Group>
        )}
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppRoutes;
