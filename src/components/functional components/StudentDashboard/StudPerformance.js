import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Style from "./StudDashboardStyle";
import { FlatGrid } from "react-native-super-grid";


const StudPerformance = () => {
  return (
    <View style={Style.mainView}>
      <Text>Level 2</Text>
      <FlatGrid style={Style.gridView}
        itemDimension={130}
        data={[1, 2, 3, 4]}
        spacing={1}
        renderItem={({ item }) => <Text style={Style.itemCode}>{item}</Text>}
      />
    </View>
  );
};

export default StudPerformance;
