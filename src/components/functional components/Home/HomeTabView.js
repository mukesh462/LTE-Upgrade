import { React, useCallback, useState, useEffect, useRef } from "react";
import { Text, View, Image, TouchableOpacity, Dimensions } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  Feather,
  Ionicons,
  Fontisto,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import axios from "axios";
import { StyleSheet } from "react-native";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import "react-native-gesture-handler";
import * as DocumentPicker from "expo-document-picker";
import Style from "./Style";
import { COLORS, SIZES, FONTS, assets, CONST } from "../../../../constants";
import StudentRoutes from "../StudentDashboard/StudentRoutes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext } from "react";
import { ScrollView } from "react-native-gesture-handler";
import TeacherMaterial from "../../ui components/TeacherMaterial";
import Toast from "react-native-toast-message";
import ProfileRoutes from "../Profile/ProfileRoutes";
import TicketStatus from "../Tickets/TicketStatus";
import moment from "moment";
import { StatusBar } from "expo-status-bar";
import Loader from "../../ui components/Loader";

const Tab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();

const TeacherIDContext = createContext(null);
const TeacherProfileContext = createContext(null);

const CustomDrawer = (props) => {
  const teacher = useContext(TeacherProfileContext);

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 20,
            marginBottom: 20,
          }}
        >
          <View>
            <Text style={Styles.bold}>{teacher.teacher_name}</Text>
            {/* <Text style={Styles.greyText}>{teacher.role}</Text> */}
            {teacher.tentative_start_date ? (
              <Text style={Styles.greyText}>
                Since {moment(teacher.tentative_start_date).fromNow()}
              </Text>
            ) : null}
          </View>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity
        onPress={() => {
          props.initialParams.logout.logout();
        }}
        style={{
          position: "absolute",
          right: 0,

          left: 0,
          bottom: 50,
          padding: 20,
          flexDirection: "row",
        }}
      >
        <Text style={Styles.semiBold}>Log Out</Text>
        <MaterialIcons
          style={{ marginLeft: 16 }}
          name="logout"
          size={24}
          color="black"
        />
      </TouchableOpacity>
    </View>
  );
};

function TrainingMaterialTab({ navigation }) {
  const [trainingMaterial, setTrainingMaterial] = useState([]);
  const [animSpeed, setAnimSpeed] = useState(true);
  function playAnimation() {
    setAnimSpeed(true);
  }

  function pauseAnimation() {
    setAnimSpeed(false);
  }
  function getTrainingMaterials() {
    try {
      axios
        .get(`${CONST.baseUrl}/teacherresource/get_teacher_res_info`)
        .then((response) => {
          pauseAnimation();
          setTrainingMaterial(response.data);
        });
    } catch (e) {
      pauseAnimation();
      console.error(e);
    }
  }

  useEffect(() => {
    getTrainingMaterials();
  }, []);

  return (
    <View
      style={{
        justifyContent: "flex-start",
        alignSelf: "center",
        backgroundColor: "white",
        paddingTop: SIZES.medium,
        paddingHorizontal: 16,
        alignItems: "center",
      }}
    >
      <Loader visible={animSpeed} />
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
        }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            width: Dimensions.get("window").width * 0.9,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {trainingMaterial.map((ele, index) => {
            return (
              <TeacherMaterial
                name={ele.teacher_res_name}
                desc={ele.teacher_res_desc}
                type={ele.teacher_res_type}
                size={ele.teacher_res_file_size}
                link={ele.teacher_res_url ?? ""}
                key={index}
              />
            );
          })}

          {trainingMaterial.length ===
            0 **
            (
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  position: "absolute",
                  top: "40%",
                  alignSelf: "center",
                }}
              >
                No Training Material available
              </Text>
            )}
        </View>
      </ScrollView>
    </View>
  );
}

function UploadAudioTab({ route, navigation }) {
  const [animSpeed, setAnimSpeed] = useState(false);
  const animRef = useRef();
  const teacher = useContext(TeacherProfileContext);

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

  const teacherID = useContext(TeacherIDContext);

  const [audioStatus, setAudioStatus] = useState("null");
  const [image, setImage] = useState(assets.notFound);

  function getAudioStatus() {
    try {
      playAnimation();
      axios
        .get(
          `${CONST.baseUrl}/audio/get/teacherdetails/audiostatus/${teacherID}`
        )
        .then((response) => {
          pauseAnimation();
          setAudioStatus(response.data.at(-1).audio_status);
          if (response.data.at(-1).audio_status == "submitted") {
            setImage(assets.waiting);
          } else if (response.data.at(-1).audio_status == "approved") {
            setImage(assets.approved);
          }
        });
    } catch (e) {
      pauseAnimation();
      console.error(e);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getAudioStatus();
    });

    return unsubscribe;
  }, [navigation]);

  const ImagePlaceholder = () => {
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Image
          style={{ width: "70%", height: "70%", resizeMode: "contain" }}
          source={image}
        />

        <View
          style={{
            padding: 8,
            borderColor: COLORS.darkGrey,
            borderStyle: "dashed",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 36,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: 500, margin: 8 }}>
            {audioStatus == "null" ? "Loading" : audioStatus}
          </Text>
        </View>
      </View>
    );
  };

  const date = new Date();
  const URL = `https://api.cloudinary.com/v1_1/db2bzxbn7/video/upload`;
  const [formData, setFormData] = useState({
    api_key: "164615611795246",
    timestamp: date.getTime(),
    upload_preset: "my_preset",
    cloud_name: "db2bzxbn7",
  });

  const [fileResponse, setFileResponse] = useState({});

  const audioSubmitBtn = useCallback(async () => {
    try {
      const response = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
        multiple: false,
      });
      setFileResponse(response);
      setFormData({ ...formData, file: response.uri });
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const uploadAudio = async () => {
    if (
      !fileResponse ||
      !fileResponse.assets ||
      fileResponse.assets.length === 0 ||
      !fileResponse.assets[0].uri
    ) {
      Toast.show({
        type: "error",
        text1: "Please select a file to upload",
      });
      return;
    }
    const { name, uri } = fileResponse.assets[0];
    let formDataObj = new FormData();
    if (uri) {
      formDataObj.append("file", { name, uri, type: "video/mp4" });
      formDataObj.append("api_key", formData.api_key);
      formDataObj.append("upload_preset", formData.upload_preset);
      const salt = (Math.random() + 1).toString(36).substring(2);
      formDataObj.append("public_id", teacherID + "-" + salt);
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: URL,
        data: formDataObj,
        headers: { "Content-Type": "multipart/form-data" },
      };

      playAnimation();

      axios
        .request(config)
        .then((response) => {
          axios
            .post(`${CONST.baseUrl}/audio`, {
              teacher_id: teacherID,
              audio_file_name: name,
              audio_source: response.data.url ?? "",
              audio_status: "submitted",
              audio_reason: "",
              audio_audit_by: "",
              teacher_name: teacher.teacher_name,
            })
            .then((response) => {
              pauseAnimation();
              setFileResponse({});

              if (response.status == 200) {
                setAudioStatus("submitted");
                setImage(assets.waiting);
              }
            })
            .catch((err) => {
              pauseAnimation();
              console.log(err.response.data);

              Toast.show({
                type: "error",
                text1: err.response.data.detail ?? "Please try again later",
              });
            });
        })
        .catch((err) => {
          pauseAnimation();

          console.log(err.response);
          Toast.show({
            type: "error",
            text1: "Unknown error occured",
          });
        });
    }
  };

  return (
    <View style={Style.mainAudioContainer}>
      {audioStatus != "unsubmitted" &&
      audioStatus != "rejected" &&
      audioStatus != null &&
      audioStatus != "resend" ? (
        <ImagePlaceholder />
      ) : (
        <View style={Style.mainAudioContainer}>
          <Text style={Style.audioText}>
            Please share your voice audio file and we will get back to you once
            it approved
          </Text>
          <View style={Style.dragViewContainer}>
            <TouchableOpacity
              disabled={audioStatus == "rejected"}
              onPress={audioSubmitBtn}
            >
              <Feather
                style={Style.uploadIcon}
                name="upload-cloud"
                size={42}
                color="blue"
              />
              {audioStatus !== "rejected" ? (
                <Text style={Style.uploadText}>
                  Drop files here or click to upload
                </Text>
              ) : (
                <Text style={Style.uploadText}>Your Audio was Rejected!</Text>
              )}

              <Text
                style={{ ...Style.greyText, alignSelf: "center", marginTop: 2 }}
              >
                Status:{" "}
                {fileResponse.assets != undefined
                  ? fileResponse.assets[0].name.substring(0, 12)
                  : audioStatus == "resend"
                  ? "Resend for verification"
                  : audioStatus == "rejected"
                  ? "Audio Rejected"
                  : "Submit for verification"}
              </Text>
            </TouchableOpacity>
            {fileResponse.assets != undefined ? (
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 32,
                  alignItems: "center",
                }}
              >
                <Text>{fileResponse.assets[0].name.substring(0, 12)}</Text>

                <TouchableOpacity
                  onPress={() => {
                    setFileResponse({});
                  }}
                  style={{
                    marginLeft: 8,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather style={{}} name="x" size={24} color="black" />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          <View style={Style.subViewContainer}>
            {audioStatus !== "rejected" && (
              <TouchableOpacity onPress={uploadAudio} style={Style.btnStyle}>
                <Text style={Style.btnTextStyle}>SUBMIT</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
      <Loader visible={animSpeed} />
      <Toast position="bottom" bottomOffset={20} />
    </View>
  );
}

function HomeScreen({ route, navigation }) {
  const [audioStatus, setAudioStatus] = useState(true);

  function getAudioStatus(teacherID) {
    try {
      axios
        .get(
          `${CONST.baseUrl}/audio/get/teacherdetails/audiostatus/${teacherID}`
        )
        .then((response) => {
          if (response.data.at(-1).audio_status == "approved") {
            setAudioStatus(false);
          } else {
            setAudioStatus(true);
          }
        });
    } catch (e) {
      console.error(e.response);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = navigation.addListener("focus", async () => {
        const teacherID = await AsyncStorage.getItem("AuthState");
        getAudioStatus(teacherID);
      });
    };
    fetchData();
  }, [navigation]);

  // useEffect(async ()=>{
  //   const teacherID = await AsyncStorage.getItem('AuthState')
  //   getAudioStatus(teacherID)
  // },[])

  return (
    <Tab.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: "#FFFFFF" },
        tabBarIndicatorStyle: { backgroundColor: COLORS.primary },
      }}
    >
      <Tab.Screen name="Training Material" component={TrainingMaterialTab} />
      {audioStatus && (
        <Tab.Screen name="Upload Audio" component={UploadAudioTab} />
      )}
    </Tab.Navigator>
  );
}

function HomeTabView({ route, navigation }) {
  const [data, setData] = useState({});
  const [loader, setloader] = useState(false);
  const [stateID, setStateID] = useState("NULL");
  const [notifications, setNotifications] = useState(0);

  const getData = async () => {
    if (stateID !== "NULL") return;
    try {
      let value = await AsyncStorage.getItem("AuthState");
      setStateID(value);

      axios
        .post(`${CONST.baseUrl}/teacher/get/teacherdetails/app`, {
          teacher_id: value,
        })
        .then((response) => {
          axios
            .get(`${CONST.baseUrl}/notification/unread/notif/${value}`)
            .then((response) => {
              setNotifications(response.data.length);
            });
          setData(response.data);
        });
    } catch (e) {
      // error reading value
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const value = await AsyncStorage.getItem("AuthState");
        if (!value) return;

        const response = await axios.get(
          `${CONST.baseUrl}/notification/unread/notif/${value}`
        );
        setNotifications(response.data.length);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    const unsubscribe = navigation.addListener(
      "focus",
      fetchUnreadNotifications
    );
    getData();

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  return (
    <TeacherIDContext.Provider value={stateID}>
      <TeacherProfileContext.Provider value={data}>
        <View
          style={{
            backgroundColor: COLORS.blueShade,
            paddingTop: StatusBar.currentHeight,
          }}
        >
          <StatusBar barStyle="dark-content" translucent />
        </View>

        <Drawer.Navigator
          drawerContent={(props) => (
            <CustomDrawer {...props} initialParams={{ logout: route.params }} />
          )}
          initialParams={{ teacherID: stateID }}
          screenOptions={{
            headerTintColor: "black",
            drawerActiveBackgroundColor: COLORS.primary,
            drawerActiveTintColor: "white",
            headerStyle: {
              backgroundColor: COLORS.blueShade,
            },
          }}
        >
          <Drawer.Screen
            name="Teacher's Training"
            component={HomeScreen}
            options={({ route }) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? "NULL";
              return {
                headerRight: () => (
                  <TouchableOpacity
                    style={{
                      padding: 0,
                      position: "relative",
                      marginEnd: 16,
                      paddingVertical: 10,
                      paddingHorizontal: 8,
                    }}
                    onPress={() => navigation.navigate("Notifications")}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "blue",
                        position: "absolute",
                        top: 0,
                        right: 0,
                      }}
                    >
                      {notifications == 0 ? "" : notifications}
                    </Text>
                    <Ionicons
                      name="notifications"
                      size={22}
                      color={COLORS.primary}
                      style={{}}
                    />
                  </TouchableOpacity>
                ),
                drawerIcon: ({ focused, size }) => (
                  <Ionicons
                    name="home"
                    size={size}
                    color={focused ? "white" : "black"}
                  />
                ),
              };
            }}
          />
          <Drawer.Screen
            name="Student Profiles"
            component={StudentRoutes}
            initialParams={{ teacherID: stateID }}
            options={({ route }) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? "Items";
              if (
                routeName == "Level Review" ||
                routeName == "Student Profile" ||
                routeName == "Level Review Zero" ||
                routeName == "Level Review Zero"
              ) {
                return {
                  drawerIcon: ({ focused, size }) => (
                    <Fontisto
                      name="room"
                      size={24}
                      color={focused ? "white" : "black"}
                    />
                  ),
                  swipeEnabled: false,
                  headerShown: false,
                };
              }
              return {
                drawerIcon: ({ focused, size }) => (
                  <Fontisto
                    name="room"
                    size={24}
                    color={focused ? "white" : "black"}
                  />
                ),
              };
            }}
          />
          <Drawer.Screen
            name="My Profile"
            component={ProfileRoutes}
            initialParams={{ logout: route.params }}
            options={({ route }) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? "Items";
              if (routeName == "Contact SPOC")
                return {
                  swipeEnabled: false,
                  headerShown: false,
                  drawerIcon: ({ focused, size }) => (
                    <Ionicons
                      name="person"
                      size={size}
                      color={focused ? "white" : "black"}
                    />
                  ),
                };
              return {
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },

                drawerIcon: ({ focused, size }) => (
                  <Ionicons
                    name="person"
                    size={size}
                    color={focused ? "white" : "black"}
                  />
                ),
              };
            }}
          />

          <Drawer.Screen
            name="Tickets"
            component={TicketStatus}
            initialParams={{ teacherID: stateID }}
            options={({ navigation, route }) => ({
              drawerIcon: ({ focused, size }) => (
                <FontAwesome
                  name="ticket"
                  size={24}
                  color={focused ? "white" : "black"}
                />
              ),
            })}
          />
        </Drawer.Navigator>
      </TeacherProfileContext.Provider>
    </TeacherIDContext.Provider>
  );
}

export default HomeTabView;

const Styles = StyleSheet.create({
  paragraph: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    textAlign: "justify",
    flexWrap: "wrap",
    color: COLORS.textBlack,
  },
  semiBold: {
    fontSize: SIZES.font,
    fontFamily: FONTS.semiBold,
    textAlign: "justify",
    flexWrap: "wrap",
    color: COLORS.textBlack,
  },
  bold: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.bold,
    textAlign: "justify",
    flexWrap: "wrap",
    color: COLORS.textBlack,
  },
  greyText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    textAlign: "justify",
    flexWrap: "wrap",
    color: COLORS.grey,
  },
});
