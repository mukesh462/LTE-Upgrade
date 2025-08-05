import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
} from "react-native";
import Checkbox from "expo-checkbox";
import { React, useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS, assets } from "../../../constants";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const StudentListItem = ({
  onclick,
  name,
  education,
  number,
  sp_contact,
  sp_name,
}) => {
  const [firstLetters, setFirstLetters] = useState("");
  const [popup, setPopup] = useState(false);
  function getFirstLetters() {
    const _name = name.split(" ");
    let list = "";
    _name.map((ele) => {
      if (ele != undefined) {
        list = list + ele[0];
      }
    });
    setFirstLetters(list);
  }

  useEffect(() => {
    getFirstLetters();
  }, []);

  const ViewModel = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={popup}
      onRequestClose={() => {
        setPopup(!popup);
      }}
    >
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="light" // or "dark", "extraLight", etc.
        blurAmount={Platform.OS == "android" ? 20 : 10}
        reducedTransparencyFallbackColor="white"
      />
      <View style={{ ...styles.modalView, }}>
        <View
          style={{
            backgroundColor: COLORS.blueShade,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: "5%",
          }}
        >
          <Text
            style={{
              textAlign: "left",
              fontSize: SIZES.medium,
              fontFamily: FONTS.bold,
              color: COLORS.textBlack,
              marginVertical: 14,
            }}
          >
            Student Information
          </Text>
          <TouchableOpacity
            style={{ padding: 4 }}
            onPress={() => {
              setPopup(!popup);
            }}
          >
            <AntDesign name="closecircle" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "90%",
            paddingBottom: 0,
          }}
        >
          <Text
            style={{
              textAlign: "left",
              fontSize: SIZES.medium,
              fontFamily: FONTS.semiBold,
              color: COLORS.grey,
              marginTop: 8,
              flex: 5,
            }}
          >
            What's app number
          </Text>
          <Text
            style={{
              textAlign: "left",
              fontSize: SIZES.medium,
              fontFamily: FONTS.semiBold,
              color: COLORS.textBlack,
              marginTop: 8,
              flex: 11,
            }}
          >
            {number}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "90%",
          }}
        >
          <Text
            style={{
              textAlign: "left",
              fontSize: SIZES.medium,
              fontFamily: FONTS.semiBold,
              color: COLORS.grey,
              marginTop: 8,
              flex: 5,
            }}
          >
            Sponsor Name
          </Text>
          <Text
            style={{
              textAlign: "left",
              fontSize: SIZES.medium,
              fontFamily: FONTS.semiBold,
              color: COLORS.textBlack,
              marginTop: 8,
              flex: 11,
              marginLeft: 2,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {sp_name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "90%",
          }}
        >
          <Text
            style={{
              textAlign: "left",
              fontSize: SIZES.medium,
              fontFamily: FONTS.semiBold,
              color: COLORS.grey,
              marginTop: 8,
              flex: 5,
            }}
          >
            Sponsor Contact
          </Text>
          <Text
            style={{
              textAlign: "left",
              fontSize: SIZES.medium,
              fontFamily: FONTS.semiBold,
              color: COLORS.textBlack,
              marginTop: 8,
              flex: 11,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {sp_contact}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "90%",
            marginVertical:10
          }}
        >
       
        
        </View>
      </View>
    </Modal>
  );

  return (
    <TouchableOpacity
      onPress={() => {
        onclick();
      }}
      style={{
        width: "100%",
        flexDirection: "row",
        height: 80,
        padding: 12,
        marginTop: 4,
        borderBottomWidth: 1,
        borderColor: COLORS.borderGrey,
      }}
    >
      <View
        style={{
          height: 50,
          width: 50,
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
            color: "#3F4188",
          }}
        >
          {firstLetters}
        </Text>
      </View>
      <ViewModel />
      <View
        style={{
          marginStart: 12,
          paddingVertical: 8,
          justifyContent: "space-between",
          width: "70%",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontFamily: FONTS.semiBold,
              flexWrap: "wrap",
              fontSize: 16,
              maxWidth: "70%",
              color: "black",
            }}
          >
            {name}
          </Text>

          {/* <Text
            numberOfLines={2}
            style={{
              fontFamily: FONTS.semiBold,
              flexWrap: "wrap",
              fontSize: 16,
              maxWidth: "60%",
              color: "black",
            }}
          >
            ({number})
          </Text> */}
        </View>

        <Text
          style={{
            fontFamily: FONTS.regular,
            fontSize: 14,
            color: COLORS.grey,
          }}
        >
          {education} Grade
        </Text>
      </View>

      <Ionicons
        name="settings"
        size={22}
        color="#000000BD"
        style={{ position: "absolute", right: 16, top: 20 }}
      />
      <Ionicons
        name="eye"
        size={22}
        color="#000000BD"
        onPress={() => setPopup(!popup)}
        style={{ position: "absolute", right: 16, bottom: 8 }}
      />
    </TouchableOpacity>
  );
};
export default StudentListItem;
const styles = StyleSheet.create({
 
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 0,
    alignSelf: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "absolute",
    top: "40%",
    width: "95%",
    paddingBottom: 10,
  }
  ,
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
