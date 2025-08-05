import { React, useState } from "react";
import { List } from "react-native-paper";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";

const AccordianComponent = () => {
  return (
    <List.AccordionGroup>
      <List.Accordion title="Accordion 1" id="1">
        <List.Item title="Item 1" />
      </List.Accordion>
      <List.Accordion title="Accordion 2" id="2">
        <List.Item title="Item 2" />
      </List.Accordion>
      <View>
        {/* <Text>
          List.Accordion can be wrapped because implementation uses React.Context.
        </Text> */}
        <List.Accordion title="Accordion 3" id="3">
          <List.Item title="Item 3" />
        </List.Accordion>
      </View>
    </List.AccordionGroup>
  );
};

export default AccordianComponent;
