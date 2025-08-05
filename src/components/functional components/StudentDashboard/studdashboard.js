import { Text, View, Image, SafeAreaView, Platform, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { StackActions } from '@react-navigation/native';

import PerformanceBottomSheet from "../../ui components/PerformanceBottomSheet";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { COLORS, SIZES, FONTS, assets, CONST } from "../../../../constants";
import Training from "./Training";
import Availability from "./Availability";
import { Feather, Ionicons } from "@expo/vector-icons";
import axios from "axios";


function StudentProfileView({ route, navigation }) {

  const refRBSheet = useRef();
  const Tab = createMaterialTopTabNavigator();
  const { width, height } = Dimensions.get('window');
  const [state, setState] = useState({})

  function openSheet() {
    refRBSheet.current.open()
  }



  async function fetchStats() {
    axios.post(
      `${CONST.baseUrl}/teacherapp/get/student/sessionfeedbackcount`, {
      student_id: route.params.student_id
    }
    ).then((res)=>{
          setState(res.data)
    }).catch((err)=>{
      console.error(err.response.data);
    })
  }

useEffect(() => {
  const init = async () => {
    await fetchStats();
   // openSheet();
  };
  init();
}, []);



  const headerContainerStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? height * 0.01 : height * 0.055, 
    paddingBottom: height * 0.01,
    position: 'relative',
    marginTop: height * 0.006,
    paddingHorizontal: width * 0.04, // about 16px on standard width
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', marginTop: 10 }}>
      <View style={headerContainerStyle}>
  <TouchableOpacity
    onPress={() => navigation.dispatch(StackActions.pop(1))}
    style={{
      position: 'absolute',
      left: 12,
      zIndex: 1,
      bottom:5
    }}
  >
    <Ionicons name="arrow-back" size={28} color={COLORS.grey} />
  </TouchableOpacity>

  <Text
    numberOfLines={1}
    ellipsizeMode="tail"
    style={{
      fontFamily: FONTS.semiBold,
      fontSize: SIZES.medium,
      color: COLORS.black,
      maxWidth: '70%',
      textAlign: 'center',
    }}
  >
    {route.params.student_name}
  </Text>

</View>

      <Tab.Navigator
        screenOptions={{
          contentStyle: { backgroundColor: '#FFFFFF' }, tabBarIndicatorStyle: { backgroundColor: COLORS.primary } ,tabBarLabelStyle: { textTransform: 'none' },
        }}>
        <Tab.Screen  name="Teaching Material"  component={Training} initialParams={{ student_id: route.params.student_id, student_name: route.params.student_name,onOpen:openSheet }} />
        <Tab.Screen name="Class Schedule" component={Availability}  initialParams={{ student_id: route.params.student_id }} />
      </Tab.Navigator>



      <PerformanceBottomSheet
        name={route.params.student_name}
        number={route.params.whatsappno}
        level={state.level_name ?? ""}
        needsImprov={state.needs_improvement ?? 0}
        satisfied={state.satisfied ?? 0}
        good={state.good ?? 0}
        excellent={state.excellent ?? 0}
        session={state.session_name ?? ""}
        group={route.params.group_name}
        refRBSheet={refRBSheet} />

    </SafeAreaView>
  );
}





export default StudentProfileView;
