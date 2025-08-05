import { Text, View, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { List, Chip } from "react-native-paper";
import { TextInput } from "@react-native-material/core";
import axios from "axios";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

import { COLORS, SIZES, FONTS, assets, CONST } from "../../../../constants";
import { DatePickerModal } from "react-native-paper-dates";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScrollView } from "react-native-gesture-handler";
import { TimePickerModal } from "react-native-paper-dates";
import { Switch } from "react-native-paper";
import Loader from "../../ui components/Loader";

const Availability = ({ navigation, route }) => {
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

  const [date, setDate] = useState(new Date());

  const [temp, setTemp] = useState("");
  const [open, setOpen] = React.useState(false);

  const [open2, setOpen2] = React.useState(false);
  const [data, setData] = useState({
    next_level_name: "",
    next_level_session_count: "21",
  });

  const [chosenDate, setChosenDate] = useState(null);
  const [state, setState] = useState({ level_details: [] });
  const [currentAvailabilityIds, setCurrentAvailabilityIds] = useState([]);
  const [currentLevel, setCurrentLevel] = useState({});
  const [totalDays, setTotalDays] = useState(0);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);

  const [teacherID, setTeacherID] = useState(-1);

  // async function fetchAvailability() {
  //   playAnimation();
  //   setCurrentLevel({});
  //   let value = await AsyncStorage.getItem("AuthState");
  //   setTeacherID(value);

  //   console.log("Teacher-", value);
  //   console.log("Student-", route.params.student_id);

  //   axios
  //     .post(`${CONST.baseUrl}/teacherapp/get/teacher/availablity`, {
  //       teacher_id: value,
  //       stud_id: route.params.student_id,
  //     })
  //     .then((response) => {
  //       pauseAnimation();
  //       setState({...response.data,
  //         level_details: response.data.level_details.map((e) => {
  //           return {
  //             ...e,
  //             level_title: "Level " + e?.level_name?.split("level").at(1),
  //           };
  //         }),
  //       });
  //     })
  //     .catch((error) => {
  //       pauseAnimation();
  //       console.log("error");
  //       console.log(error);
  //     });
  // }
  async function fetchAvailability() {
    playAnimation();
    setCurrentLevel({});
    let value = await AsyncStorage.getItem("AuthState");
    setTeacherID(value);
  
    console.log("Teacher-", value);
    console.log("Student-", route.params.student_id);
  
    axios
      .post(`${CONST.baseUrl}/teacherapp/get/teacher/availablity`, {
        teacher_id: value,
        stud_id: route.params.student_id,
      })
      .then((response) => {
        pauseAnimation();
  
        const updatedLevels = applyLevelAvailability(
          response.data.level_details,
          response.data.level_status
        );
        console.log(response.data,'current')
        setState({
          ...response.data,
          level_details: updatedLevels,
        });
      })
      .catch((error) => {
        pauseAnimation();
        console.log("error");
        console.log(error);
      });
  }
  
function applyLevelAvailability(levelDetails, levelStatus) {
  const allowedLevels = [6, 7, 8, 9, 10, 11];
  const currentStatus = levelStatus?.[0] || {};

  return levelDetails
    .map((level) => {
      const { level_id } = level;
      if (!allowedLevels.includes(level_id)) return null;

      let isDisabled = true;

      if (currentStatus.level_id === 11) {
        isDisabled = false;

      } else if (currentStatus.level_status === "completed") {
        isDisabled = !(level_id === currentStatus.level_id || level_id === currentStatus.level_id + 1);

      } else if (currentStatus.level_status === "Not completed") {
        isDisabled = level_id > currentStatus.level_id;

      } else if (currentStatus.level_status === "not assigned") {
        isDisabled = level_id !== currentStatus.level_id;

      } else {
        isDisabled = true;
      }

      return {
        ...level,
        level_title: "Level " + level?.level_name?.split("level").at(1),
        label: "Level " + level?.level_name?.split("level").at(1),
        value: level.level_name,
        disabled: isDisabled,
      };
    })
    .filter(Boolean);
}


  
  async function postAvailability() {
    if (
      (temp == null || temp == undefined || temp.length == 0) &&
      chosenDate == null
    ) {
      Toast.show({
        type: "info",
        text1: "Please select start date",
      });
      return;
    }
    if (Object.keys(currentLevel).length == 0) {
      Toast.show({
        type: "info",
        text1: "Please select Level",
      });
      return;
    }
    const trueSwitches = [];

    for (const key in switches) {
      if (switches[key] === true) {
        trueSwitches.push({
          day: (parseInt(key) + 1).toString(),
          start_time: time[parseInt(key)],
          end_time: time2[parseInt(key)],
        });
      }
    }

    const totalDays = trueSwitches.length;

    if (totalDays == 0) {
      Toast.show({
        type: "info",
        text1: "Please choose 2-3 days only",
      });
      return;
    }

    const originalDate = new Date(temp);

    const year = originalDate.getFullYear();
    const month = (originalDate.getMonth() + 1).toString().padStart(2, "0");
    const day = originalDate.getDate().toString().padStart(2, "0");

    const formattedDateString = `${year}-${month}-${day}`;

    let flag = true;
    state.level_start_date.map((ele, inx) => {
      if (ele.level_id == currentLevel.level_id) flag = false;
    });

    if (flag) {
      const payload = {
        stud_id: parseInt(route.params.student_id),
        start_date: formattedDateString,
        level_id: parseInt(currentLevel.level_id),
        level_status: "Not Completed",
        created_by: parseInt(teacherID),
        teacher_id: parseInt(teacherID),
        session_details: trueSwitches,
      };

      playAnimation();

      axios
        .post(`${CONST.baseUrl}/student/assign/assignlevel`, payload)
        .then(async (response) => {
          pauseAnimation();
          await fetchAvailability();
          Toast.show({
            type: "success",
            text1: "Successfully Updated",
          });
          setSwitches({
            0: false,
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
          });
          setTime([
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00",
          ]);
          setTime2([
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00",
          ]);
        })
        .catch((error) => {
          console.error(error);
          pauseAnimation();
          Toast.show({
            type: "error",
            text1: "Please try again later",
          });
        });

      axios
        .post(`${CONST.baseUrl}/teacherapp/insert/teacher/availablity`, payload)
        .then(async (response) => {})
        .catch((error) => {
          pauseAnimation();
          Toast.show({
            type: "error",
            text1: "Please try again later",
          });
        });
    } else {
      let _teacher_availablity = [];
      // if (totalDays != currentAvailabilityIds.length) {
      //   Toast.show({
      //     type: "error",
      //     text1: "Please choose " + currentAvailabilityIds.length + " days",
      //   });
      //   return;
      // }

      currentAvailabilityIds.forEach((id, inx) => {
        let temp = {
          date: chosenDate.substring(0, 10),
          availablity_id: id,
          level_id: parseInt(currentLevel.level_id),
          day: trueSwitches[inx].day,
          start_time: trueSwitches[inx].start_time,
          end_time: trueSwitches[inx].end_time,
        };
        _teacher_availablity.push(temp);
      });

      const payload = {
        teacher_availablity: _teacher_availablity,
      };

      playAnimation();

      axios
        .put(`${CONST.baseUrl}/teacherapp/update/teacher/availablity`, payload)
        .then(async (response) => {
          console.log(response.data);

          pauseAnimation();
          await fetchAvailability();
          Toast.show({
            type: "success",
            text1: "Successfully Updated",
          });
          setSwitches({
            0: false,
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
          });
          setTime([
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00",
          ]);
          setTime2([
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00",
          ]);
        })
        .catch((error) => {
          pauseAnimation();
          console.log(error.response.data);
          Toast.show({
            type: "error",
            text1: "Please try again later",
          });
        });
    }
  }

  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    setChosenDate(null);
    setState({ level_details: [] });
    setCurrentAvailabilityIds([]);
    setCurrentLevel({});
    setTotalDays(0);
    setCurrentTimeIndex(0);
    const unsubscribe = navigation.addListener("focus", () => {
      fetchAvailability();
    });

    return () => {
      setChosenDate(null);
      setState({ level_details: [] });
      setCurrentAvailabilityIds([]);
      setCurrentLevel({});
      setTotalDays(0);
      setCurrentTimeIndex(0);
      unsubscribe;
    };
  }, [navigation]);

  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onDismissSingle2 = React.useCallback(() => {
    setOpen2(false);
  }, [setOpen2]);

  const [visible, setVisible] = React.useState(false);
  const [time, setTime] = useState([
    "00:00",
    "00:00",
    "00:00",
    "00:00",
    "00:00",
    "00:00",
    "00:00",
  ]);
  const onDismiss = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirm = ({ hours, minutes }) => {
    setVisible(false);
    let _min = minutes < 10 ? "0" + minutes : minutes;
    let _hour = hours < 10 ? "0" + hours : hours;
    let _time = time;
    _time[currentTimeIndex] = _hour + ":" + _min;

    setTime(_time);
  };

  const onToggleSwitch = (id, value) => {
    if (value) setTotalDays(totalDays + 1);
    else setTotalDays(totalDays - 1);
  };

  const [switches, setSwitches] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });

  useEffect(() => {
    if (currentLevel.level_id != undefined) {
      setSwitches({
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      });
      let _time = [
        "00:00",
        "00:00",
        "00:00",
        "00:00",
        "00:00",
        "00:00",
        "00:00",
      ];
      let _time2 = [
        "00:00",
        "00:00",
        "00:00",
        "00:00",
        "00:00",
        "00:00",
        "00:00",
      ];
      setChosenDate(null);
      let _ids = [];
      state.teacher_avail_info.forEach((ele) => {
        if (ele.level_id == currentLevel.level_id) {
          _ids.push(ele.availablity_id);
          const _day = parseInt(ele.day) - 1;
          setChosenDate(ele.date.substring(0, 10));
          setSwitches((curr) => ({ ...curr, [_day]: true }));
          _time[_day] = ele.start_time;
          _time2[_day] = ele.end_time;
        }
      });
      setCurrentAvailabilityIds(_ids);
      setTime(_time);
      setTime2(_time2);
    }
  }, [currentLevel]);

  const [visible2, setVisible2] = React.useState(false);
  const [time2, setTime2] = useState([
    "00:00",
    "00:00",
    "00:00",
    "00:00",
    "00:00",
    "00:00",
    "00:00",
  ]);

  const onDismiss2 = React.useCallback(() => {
    setVisible2(false);
  }, [setVisible2]);

  const onConfirm2 = ({ hours, minutes }) => {
    setVisible2(false);
    let _min = minutes < 10 ? "0" + minutes : minutes;
    let _hour = hours < 10 ? "0" + hours : hours;
    let _time = time2;
    _time[currentTimeIndex] = _hour + ":" + _min;
    setTime2(_time);
  };

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wendesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return (
    <View style={{ backgroundColor: "white" }}>
      <ScrollView
        style={{ backgroundColor: "white", height: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 24,
            width: "95%",
          }}
        >
          {state.level_details.length !== 0 && (
           <Dropdown
           style={[Styles.dropdown, isFocus && {}]}
           placeholderStyle={Styles.placeholderStyle}
           selectedTextStyle={Styles.selectedTextStyle}
           inputSearchStyle={Styles.inputSearchStyle}
           iconStyle={Styles.iconStyle}
           data={state.level_details}
           maxHeight={300}
           labelField="label"
           valueField="value"
           placeholder={!isFocus ? "Select Level" : "Select Level"}
           searchPlaceholder="Search..."
           value={currentLevel.value}
           onFocus={() => setIsFocus(true)}
           onBlur={() => setIsFocus(false)}
           onChange={(item) => {
             if (!item.disabled) {
               setCurrentLevel(item);
               setIsFocus(false);
             }
           }}
           renderItem={(item) => {
            if (item.disabled) {
              return (
                <TouchableWithoutFeedback>
                  <View style={[Styles.dropdownItem, Styles.disabledItem]}>
                    <Text style={[Styles.dropdownText, Styles.disabledText]}>
                      {item.label}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            } else {
              return (
                <View style={Styles.dropdownItem}>
                  <Text style={Styles.dropdownText}>{item.label}</Text>
                </View>
              );
            }
          }}
         />
         
          )}
        </View>

        <View
          style={{
            width: "98%",
            marginTop: SIZES.doubleLarge,
            flexDirection: "row",
          }}
        >
          <View
            style={{ marginHorizontal: 16, flex: 1, justifyContent: "center" }}
          >
            <Ionicons
              name="calendar-outline"
              size={22}
              color={COLORS.grey}
              style={{ position: "absolute", right: 12 }}
            />
            <TouchableOpacity
              onPress={() => {
                if (chosenDate == null) setOpen(true);
              }}
            >
              <TextInput
                onPressOut={() => {
                  if (chosenDate == null) setOpen(true);
                }}
                value={chosenDate ?? temp.substring(4, 15)}
                editable={false}
                variant="flat"
                label="Start Date"
                style={{
                  backgroundColor: COLORS.borderGrey,
                  borderRadius: 4,
                  paddingTop: 6,
                }}
                color={COLORS.darkGrey}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text
          style={{
            fontFamily: FONTS.semiBold,
            fontSize: SIZES.font,
            color: COLORS.grey,
            alignSelf: "flex-start",
            marginStart: 16,
            marginTop: 16,
          }}
        >
          Note:
        </Text>
        {Object.keys(currentLevel).length > 0 ? (
          <Text
            style={{
              fontFamily: FONTS.regular,
              fontSize: SIZES.font,
              color: COLORS.almostBlack,
              alignSelf: "flex-start",
              marginStart: 16,
              marginTop: 4,
            }}
          >
            Total {currentLevel.session_count} sessions in Level{" "}
            {currentLevel.level_name?.replace("level", "")}.
          </Text>
        ) : (
          <Text
            style={{
              fontFamily: FONTS.regular,
              fontSize: SIZES.font,
              color: COLORS.almostBlack,
              alignSelf: "flex-start",
              marginStart: 16,
              marginTop: 4,
            }}
          >
            Please select a level to view the total sessions.
          </Text>
        )}

        <View style={{ width: "95%" }}>
          <List.AccordionGroup>
            {days.map((ele, inx) => {
              return (
                <List.Accordion
                  key={inx}
                  right={(props) =>
                    switches[inx] ? (
                      <List.Icon {...props} icon="check" color="green" />
                    ) : (
                      <List.Icon {...props} icon="chevron-down" />
                    )
                  }
                  style={{
                    backgroundColor: "white",
                    borderTopWidth: 1,
                    borderColor: COLORS.borderGrey,
                    marginTop: 12,
                  }}
                  title={ele}
                  id={(inx + 1).toString()}
                >
                  <View
                    style={{
                      width: "98%",
                      marginTop: SIZES.font,
                      flexDirection: "row",
                    }}
                  >
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() => {
                        setCurrentTimeIndex(inx);
                        setVisible(true);
                      }}
                    >
                      <TextInput
                        onPressOut={() => {
                          setCurrentTimeIndex(inx);
                          setVisible(true);
                        }}
                        value={
                          time[inx] ? time[inx].substring(0, 5) : time[inx]
                        }
                        editable={false}
                        variant="outlined"
                        label="Start Time"
                        style={{ marginHorizontal: 16 }}
                        color={COLORS.darkGrey}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() => {
                        setCurrentTimeIndex(inx);
                        setVisible2(true);
                      }}
                    >
                      <TextInput
                        onPressOut={() => {
                          setCurrentTimeIndex(inx);
                          setVisible2(true);
                        }}
                        value={
                          time2[inx] ? time2[inx].substring(0, 5) : time2[inx]
                        }
                        editable={false}
                        variant="outlined"
                        label="End Time"
                        style={{ marginHorizontal: 16, flex: 1 }}
                        color={COLORS.darkGrey}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      width: "95%",
                      marginTop: SIZES.medium,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      alignSelf: "center",
                    }}
                  >
                    {/* <Text
                                            onPress={() => { }}
                                            style={{ fontFamily: FONTS.semiBold, fontSize: SIZES.font, color: COLORS.blue, alignSelf: 'center' }}>
                                            Request Postpone
                                        </Text> */}
                    {/* <Switch value={switches[inx]} onValueChange={(value) => {
                                                if (totalDays >= 3 && value) return
                                                setSwitches(curr => ({ ...curr, [inx]: value }))
                                                onToggleSwitch(inx, value)
                                            }} color={COLORS.primary} /> */}

                    <TouchableOpacity
                      onPress={() => {
                        if (totalDays >= 3 && !switches[inx]) return;
                        setSwitches((curr) => ({ ...curr, [inx]: !curr[inx] }));
                        onToggleSwitch(inx, !switches[inx]);
                      }}
                      style={{
                        height: 45,
                        backgroundColor: "blue",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: COLORS.primary,
                        padding: 10,
                        borderRadius: 5,
                        width: "100%",
                      }}
                    >
                      {!switches[inx] ? (
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: FONTS.semiBold,
                              fontSize: SIZES.font,
                              color: "white",
                              marginRight: 8,
                            }}
                          >
                            Click here to select the day
                          </Text>
                          <AntDesign name="plus" size={24} color="white" />
                        </View>
                      ) : (
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: FONTS.semiBold,
                              fontSize: SIZES.font,
                              color: "white",
                              marginRight: 8,
                            }}
                          >
                            Day is selected
                          </Text>
                          <AntDesign name="check" size={24} color="white" />
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </List.Accordion>
              );
            })}
          </List.AccordionGroup>
        </View>
        <TimePickerModal
          visible={visible}
          onDismiss={onDismiss}
          onConfirm={onConfirm}
        />
        <TimePickerModal
          visible={visible2}
          onDismiss={onDismiss2}
          onConfirm={onConfirm2}
        />

        <DatePickerModal
          locale="en"
          mode="single"
          visible={open}
          onDismiss={onDismissSingle}
          label="Select Date"
          date={date}
          validRange={{ startDate: new Date() }}
          startDate={data.date ? new Date(data.date) : new Date()}
          onConfirm={
            (date) => {
              setDate(new Date(date.date.toString()));
              setTemp(date.date.toString());
              setOpen(false);
            }
            //    onConfirmSingle
          }
        />

        <View style={Styles.subViewContainer}>
          <TouchableOpacity
            onPress={() => {
              postAvailability();
            }}
            style={Styles.btnStyle}
          >
            <Text style={Styles.btnTextStyle}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Loader visible={animSpeed} />
      <Toast position="bottom" bottomOffset={20} />
    </View>
  );
};

export default Availability;

const Styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
    width: "90%",
  },
  header: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.extraLarge,
    alignContent: "center",
  },
  headerText: {
    fontSize: 16,
    alignContent: "center",
    textAlign: "center",
    fontFamily: FONTS.regular,
  },
  input: {
    height: 40,
    width: 350,
    margin: 12,
    borderWidth: 1,
    borderColor: "#0000001F",
    padding: 10,
  },
  subLoginViewContainer: {
    width: "100%",
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    borderColor: "#0000001F",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: SIZES.doubleLarge,
    alignItems: "center",
    justifyContent: "center",
  },
  signinStyle: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  subViewContainer: {
    width: 350,
    height: 250,
    alignSelf: "center",
    justifyContent: "center",
  },
  btnStyle: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
  },

  btnTextStyle: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    width: "60%",
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  disabledItem: {
    backgroundColor: "#f2f2f2",
    opacity: 0.6,
  },
  disabledText: {
    color: "#999",
  },
  dropdownItem: {
    padding: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: "#000",
  },
});
