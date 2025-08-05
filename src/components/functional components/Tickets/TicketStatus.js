import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  Keyboard,
} from "react-native";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import { COLORS, SIZES, FONTS, assets, CONST } from "../../../../constants";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import TicketListItem from "../../ui components/TicketListItem";
import axios from "axios";
import moment from "moment";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../../ui components/Loader";
import { BlurView } from "expo-blur";

const TicketStatus = ({ navigation, route }) => {
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

  const [stackIndex, setStackIndex] = useState(1);
  const [popup, setPopup] = useState(false);

  const [allTickets, setAllTickets] = useState([]);
  const [activeTickets, setActiveTickets] = useState([]);
  const [resolvedTickets, setResolvedTickets] = useState([]);
  const [ticketList, setTicketList] = useState([]);
  const [content, setContent] = useState({
    createdAt: "",
    updatedAt: "",
  });
  const [title, setTitle] = useState("");

  const getTicketsList = async () => {
    try {
      playAnimation();
      const teacherID = await AsyncStorage.getItem("AuthState");
      const response = await axios.get(`${CONST.baseUrl}/teacherapp/all/tickets/${teacherID}`);
      pauseAnimation();
      const data = response.data || [];
      console.log(data,'apiRes')
      setTicketList(data); // Set once, handle filtering via derived logic
    } catch (e) {
      pauseAnimation();
      console.error(e.response || e);
    }
  };
  
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setTicketList([]);
      setActiveTickets([]);
      setResolvedTickets([]);
      setAllTickets([]);
      setStackIndex(1);
      getTicketsList();
    });

    return unsubscribe;
  }, [navigation]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const [search, setSearch] = useState("");

  const handleSearch = (text) => {
    setSearch(text);
  };
  const filteredTickets = ticketList
  .filter((ticket) => {
    const matchesSearch = ticket.msg_title.toLowerCase().includes(search.toLowerCase());

    if (stackIndex === 2) return matchesSearch && ticket.replied_by === null;
    if (stackIndex === 3) return matchesSearch && ticket.replied_by !== null;

    return matchesSearch; // For All tickets (stackIndex === 1)
  })
  .sort((a, b) => a.msg_title.localeCompare(b.msg_title));

  return (
    <View
      style={{
        backgroundColor: COLORS.blueShade,
        width: "100%",
        height: "100%",
        padding: 16,
        alignItems: "center",
        flex: 1,
      }}
    >
      <View style={{ width: "100%", justifyContent: "center" }}>
        <TextInput
          onChangeText={handleSearch}
          value={search}
          placeholder="Search..."
          style={{
            height: 60,
            width: "100%",
            borderRadius: 16,
            backgroundColor: "white",
            paddingHorizontal: 42,
            alignItems: "center",
            flexDirection: "row",
          }}
          selectionColor={COLORS.grey}
        ></TextInput>
        <Ionicons
          name="search"
          size={22}
          color={COLORS.primary}
          style={{ position: "absolute", left: 16 }}
        />
      </View>
      <View>
        {keyboardVisible && (
          <BlurView
            intensity={50}
            tint="light"
            style={{
              ...StyleSheet.absoluteFillObject,
              zIndex: 10,
            }}
          />
        )}
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginTop: 12,
            justifyContent: "space-evenly",
          }}
        >
          {["All", "Active", "Archived"].map((label, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSearch("");
                setStackIndex(index + 1);
              }}
              style={
                stackIndex === index + 1
                  ? styles.selectedBox
                  : styles.unSelectedBox
              }
            >
              <Text
                style={
                  stackIndex === index + 1
                    ? styles.selectedText
                    : styles.unSelectedText
                }
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
         
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Contact SPOC");
          }}
          style={{ position: "absolute", bottom: 96, right: 36, zIndex: 10 }}
        >
          <AntDesign name="pluscircle" size={48} color={COLORS.primary} />
        </TouchableOpacity>

        <ScrollView
          style={{ marginTop: 12, marginBottom: 8 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            width: Dimensions.get("window").width * 0.9,
          }}
        >
          {filteredTickets.map((ele, index) => {
            return (
              <TicketListItem
                id={index + 1}
                name={ele.msg_title}
                time={`Since ${moment(
                  ele.created_at.substring(0, 16),
                  "YYYY-MM-DDTHH:mm"
                ).fromNow()}`}
                status={ele.replied_by == null ? false : true}
                onClick={() => {
                  setTitle(ele.msg_title);
                  setContent({
                    descp: ele.msg_description,
                    reply: ele.reply_message,
                    createdAt: ele.created_at,
                    by: ele.replied_by,
                    updatedAt: ele.updated_at,
                  });
                  setPopup(true);
                }}
              />
            );
          })}

          {filteredTickets.length === 0 && !animSpeed && (
            <Text
              style={{
                marginTop: 64,
                fontFamily: FONTS.bold,
                color: COLORS.darkGrey,
                fontSize: 16,
                alignSelf: "center",
              }}
            >
              No Ticket to show
            </Text>
          )}
        </ScrollView>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={popup}
        onRequestClose={() => {
          setPopup(!popup);
        }}
      >
        <View style={{ ...styles.modalView, paddingBottom: 0 }}>
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
              Ticket Information
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
                flex: 4,
              }}
            >
              Subject
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
              {title}
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
                flex: 4,
              }}
            >
              Ticket
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
              {content.descp}
            </Text>
          </View>

          {content.reply && (
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
                  flex: 4,
                }}
              >
                Reply{"\n"}Message
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
                {content.reply}
              </Text>
            </View>
          )}

          {content.reply && (
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
                  flex: 4,
                }}
              >
                Replied{"\n"}By
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
                {content.by}
              </Text>
            </View>
          )}

          <View
            style={{
              backgroundColor: COLORS.blueShade,
              width: "100%",
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: "5%",
              marginTop: 2,
            }}
          >
            <Text
              style={{
                textAlign: "left",
                fontSize: SIZES.regular,
                fontStyle: "italic",
                color: COLORS.textBlack,
                marginVertical: 14,
                flex: 1,
              }}
            >
              Ticket Raised{" "}
              {moment(new Date(content.createdAt.substring(0, 16))).fromNow()}
            </Text>

            {content.updatedAt && (
              <Text
                style={{
                  textAlign: "left",
                  fontSize: SIZES.regular,
                  fontStyle: "italic",
                  color: COLORS.textBlack,
                  marginVertical: 14,
                  flex: 1,
                }}
              >
                Ticket Resolved{" "}
                {moment(content.updatedAt.substring(0, 16)).fromNow()}
              </Text>
            )}
          </View>

          {/* <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', marginTop: 24 }}>

                        <Pressable
                            style={{ width: '45%', borderRadius: 6, borderWidth: 0, backgroundColor: COLORS.blue, padding: 6 }}
                            onPress={() => {
                                setPopup(!popup)
                            }
                            }
                        >
                            <Text style={{
                                fontSize: SIZES.font,
                                fontFamily: FONTS.regular,
                                color: 'white',
                                textAlign: 'center'
                            }}>Close</Text>
                        </Pressable>
                    </View> */}
        </View>
      </Modal>
      <Loader visible={animSpeed} />
    </View>
  );
};

export default TicketStatus;

const styles = StyleSheet.create({
  unSelectedBox: {
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 8,
    flex: 1,
  },
  selectedBox: {
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 8,
  },
  unSelectedText: {
    fontFamily: FONTS.regular,
    color: COLORS.primary,
    fontSize: 14,
  },
  selectedText: {
    fontFamily: FONTS.regular,
    color: "white",
    fontSize: 14,
  },
  modalView: {
    margin: 20,
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
    paddingBottom: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
