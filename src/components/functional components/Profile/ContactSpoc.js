import {
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { List, Chip } from "react-native-paper";
import { Dimensions } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { COLORS, SIZES, FONTS, assets, CONST } from "../../../../constants";
import { DatePickerModal } from "react-native-paper-dates";
import {
  Ionicons,
  MaterialIcons,
  Feather,
  FontAwesome,
} from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Loader from "../../ui components/Loader";

const ContactSpoc = ({ navigation }) => {
  const [animSpeed, setAnimSpeed] = useState(false);
  const animRef = useRef();

  function playAnimation() {
    setAnimSpeed(true);
  }

  function pauseAnimation() {
    setAnimSpeed(false);
  }

  useEffect(() => {
    setTimeout(() => {
      animRef.current?.play();
    }, 100);
  }, [animSpeed]);

  const postTicket = async () => {
    if (title.trim().length === 0 || message.trim().length === 0) {
      Toast.show({
        type: "error",
        text1: "Empty fields!",
      });
      return;
    }

    try {
      const teacherID = await AsyncStorage.getItem("AuthState");
      console.log(teacherID);

      playAnimation();

      axios
        .post(`${CONST.baseUrl}/messages/addmessage`, {
          msg_title: title,
          msg_description: message,
          sent_teacher_id: teacherID,
        })
        .then((response) => {
          pauseAnimation();
          Toast.show({
            type: "success",
            text1: "Ticket Sent!",
          });
          setTitle("");
          setMessage("");

          // navigation.dispatch(StackActions.pop(1))
        });
    } catch (e) {
      // error reading value
      pauseAnimation();
      Toast.show({
        type: "error",
        text1: "Unknown error occured",
      });
      console.error(e.response);
    }
  };

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  return (
    <SafeAreaView
      style={{
        backgroundColor: COLORS.blueShade,
        width: "100%",
        height: "100%",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          alignContent: "center",
          textAlign: "center",
          fontFamily: FONTS.semiBold,
          marginTop: 55,
        }}
      >
        Contact SPOC
      </Text>

      <TouchableOpacity
        onPress={() => {
          navigation.dispatch(StackActions.pop(1));
        }}
        style={{ top: 55, position: "absolute", left: 10 }}
      >
        <Ionicons name="arrow-back" size={32} color={COLORS.grey} style={{}} />
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 16,
          alignContent: "center",
          textAlign: "center",
          fontFamily: FONTS.semiBold,
          marginTop: 64,
          color: COLORS.textGrey,
          alignSelf: "flex-start",
          marginStart: 24,
        }}
      >
        Title
      </Text>

      <TextInput
        underlineColorAndroid="transparent"
        onChangeText={(title) => setTitle(title)}
        returnKeyType="next"
        blurOnSubmit={true}
        fontSize={16}
        value={title}
        placeholder="Type Here"
        style={{
          width: "90%",
          backgroundColor: "white",
          marginTop: 4,
          padding: 8,
          borderRadius: 4,
          minHeight: 50,
        }}
      ></TextInput>

      {/* <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={genderList}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select item"
                value=""
                onChange={item => {
                    //  setValue(item.value);
                }}

            /> */}

      <Text
        style={{
          fontSize: 16,
          alignContent: "center",
          textAlign: "center",
          fontFamily: FONTS.semiBold,
          marginTop: 64,
          color: COLORS.textGrey,
          alignSelf: "flex-start",
          marginStart: 24,
        }}
      >
        Message
      </Text>

      <TextInput
        multiline
        maxLength={200}
        textAlign="left"
        onChangeText={(message) => setMessage(message)}
        underlineColorAndroid="transparent"
        returnKeyType="done"
        blurOnSubmit={true}
        fontSize={16}
        value={message}
        placeholder="Type Here"
        style={{
          width: "90%",
          backgroundColor: "white",
          marginTop: 4,
          padding: 8,
          height: 200,
          borderRadius: 8,
        }}
      ></TextInput>

      <View
        style={{
          flexDirection: "row",
          marginTop: 6,
          width: "90%",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            alignContent: "center",
            textAlign: "center",
            fontFamily: FONTS.semiBold,
            color: COLORS.green,
            alignSelf: "flex-start",
          }}
        >
          Maximum 200 Characters*
        </Text>

        <Text
          style={{
            fontSize: 12,
            alignContent: "center",
            textAlign: "center",
            fontFamily: FONTS.semiBold,
            color: COLORS.primary,
            alignSelf: "flex-start",
          }}
        >
          {message.length}/200
        </Text>
      </View>

      <TouchableOpacity
        onPress={postTicket}
        style={{
          width: "90%",
          height: 60,
          backgroundColor: COLORS.blue,
          borderRadius: 10,
          marginTop: 48,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              alignContent: "center",
              textAlign: "center",
              fontFamily: FONTS.bold,
              color: "white",
              marginRight: 8,
            }}
          >
            Send
          </Text>

          <FontAwesome name="send" size={22} color="white" />
        </View>
      </TouchableOpacity>
      <Loader visible={animSpeed} />
      <Toast position="bottom" bottomOffset={20} />
    </SafeAreaView>
  );
};

export default ContactSpoc;

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
