import {
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { COLORS, SIZES, FONTS, assets, CONST } from "../../../../constants";
import {
  Ionicons,
} from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import Toast from "react-native-toast-message";
import { StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Loader from "../../ui components/Loader";

const Notification = ({ navigation }) => {
  const [animSpeed, setAnimSpeed] = useState(false);
  const animRef = useRef();
  const [notification, setNotifications] = useState([]);

  async function clearNotifications() {
    playAnimation();
    axios
      .put(
        `${CONST.baseUrl}/notification/update/teacher/read_status/${stateID}`
      )
      .then((response) => {
        pauseAnimation();
        setNotifications([]);
      })
      .catch((err) => console.log("Error: ", err.response));
  }

  const [stateID, setStateID] = useState("NULL");

  const getData = async () => {
    if (stateID !== "NULL") return;
    try {
      let value = await AsyncStorage.getItem("AuthState");
      setStateID(value);

      playAnimation();
      axios
        .get(`${CONST.baseUrl}/notification/unread/notif/${value}`)
        .then((response) => {
          pauseAnimation();
          setNotifications(response.data);
        })
        .catch((err) => console.log("Error: ", err));
    } catch (e) {
      // error reading value
      pauseAnimation();
      console.error(e);
    }
  };

  function playAnimation() {
    setAnimSpeed(true);
  }

  function pauseAnimation() {
    setAnimSpeed(false);
  }

 

  useEffect(() => {
    getData();
  }, []);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <SafeAreaView
      style={{
        backgroundColor: COLORS.blueShade,
        width: "100%",
        height: "100%",
        alignItems: "center",
        marginTop: 2,
      }}
    >
      <View
        style={{
          marginVertical: 32,
          flexDirection: "row",
          alignItems: "center",
          position: "relative",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            alignContent: "center",
            textAlign: "center",
            fontFamily: FONTS.semiBold,
          }}
        >
          Notifications
        </Text>
        <TouchableOpacity
          onPress={() => {
            clearNotifications();
          }}
          style={{
            position: "absolute",
            right: 16,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              alignContent: "center",
              textAlign: "right",
              color: "blue",

              fontFamily: FONTS.semiBold,
            }}
          >
            Clear All
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.dispatch(StackActions.pop(1));
        }}
        style={{ top: 30, position: "absolute", left: 10 }}
      >
        <Ionicons name="arrow-back" size={32} color={COLORS.grey} style={{}} />
      </TouchableOpacity>

      {notification.length == 0 && (
        <Text
          style={{
            fontSize: 16,
            alignContent: "center",
            textAlign: "center",
            fontFamily: FONTS.semiBold,
            marginTop: 64,
            color: COLORS.textGrey,
          }}
        >
          No Records found
        </Text>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {notification
          .sort((b, a) => new Date(a.created_at) - new Date(b.created_at))
          .map((notif, inx) => {
            return (
              <TouchableOpacity
                style={{
                  width: "98%",
                  flexDirection: "row",
                  height: 80,
                  padding: 12,
                  marginTop: 4,
                  borderBottomWidth: 1,
                  borderColor: COLORS.borderGrey,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#C9CBFD",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.semiBold,
                      fontSize: 16,
                      textAlign: "center",
                      color: "#3F4188",
                    }}
                  >
                    {new Date(notif.created_at).getDate()}{" "}
                    {months[new Date(notif.created_at).getMonth()]}
                  </Text>
                </View>

                <View
                  style={{
                    marginStart: 12,
                    paddingVertical: 8,
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.semiBold,
                      fontSize: 16,
                      color: "black",
                    }}
                  >
                    {notif.notif_title}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONTS.regular,
                      fontSize: 14,
                      color: COLORS.grey,
                      maxWidth: "90%",
                    }}
                  >
                    {notif.notif_description}
                  </Text>
                </View>

                {/* <Ionicons name="settings" size={22} color="#000000BD" style={{ position: 'absolute', right: 16, top:20 }} /> */}
              </TouchableOpacity>
            );
          })}
      </ScrollView>

      <Loader visible={animSpeed} />
      <Toast position="bottom" bottomOffset={20} />
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  dropdown: {
    height: 60,
    borderRadius: 6,
    borderWidth: 0,
    width: "90%",
    paddingHorizontal: 12,
    backgroundColor: "white",
    marginTop: 4,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: COLORS.textGrey,
  },
  selectedTextStyle: {
    fontSize: SIZES.smallFont,
    fontFamily: FONTS.semiBold,
  },
});
