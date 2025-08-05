import { React } from "react";
import { List, Chip } from "react-native-paper";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const StudentTraining = () => {
  const viewClicked = () => {
    console.log("view button clicked");
  };
  const downloadClicked = () => {
    console.log("download button clicked");
  };
  const submitBtn = ()=>{
    console.log("submit the rating clicked");
  };
  return (
    <List.AccordionGroup>
      <List.Accordion title="Level 1" id="1">
        <List.Item title="Session 1" />
      </List.Accordion>
      <List.Accordion title="Level 2" id="2">
        <List.Item title="Session 2" />
      </List.Accordion>
      <List.Accordion title="Level 3" id="3">
        <List.Item title="Session 3" />
      </List.Accordion>
      <List.Accordion title="Level 4" id="4">
        <List.Item title="Session 4" />
      </List.Accordion>
      <List.Accordion title="Level 5" id="5">
        <View>
          <List.Item title="Session 5" />
          <Text style={TrainStyle.sessionTitle}>Basic English Concepts</Text>
          <View style={TrainStyle.btnContainer}>
            <TouchableOpacity style={TrainStyle.btnStyle} onPress={viewClicked}>
              <Text style={TrainStyle.btnTextStyle}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={TrainStyle.btnStyle}
              onPress={downloadClicked}
            >
              <Text style={TrainStyle.btnTextStyle}>Download</Text>
            </TouchableOpacity>
          </View>
          <Text style={TrainStyle.subHeading}>Rate this session</Text>
          <View style={TrainStyle.chipContainer}>
            <Chip
              mode="outlined"
              onPress={() => console.log("Pressed")}
              style={TrainStyle.chipItem}
            >
              Needs Improvement
            </Chip>
            <Chip
              mode="outlined"
              onPress={() => console.log("Pressed")}
              style={TrainStyle.chipItem}
            >
              Good
            </Chip>
            <Chip
              mode="outlined"
              onPress={() => console.log("Pressed")}
              style={TrainStyle.chipItem}
            >
              Excellent
            </Chip>
            <Chip
              mode="outlined"
              onPress={() => console.log("Pressed")}
              style={TrainStyle.chipItem}
            >
              Statisfactory
            </Chip>
          </View>
          <View style={[TrainStyle.submitContainer, TrainStyle.addMargin]}>
          <TouchableOpacity onPress={submitBtn} style={TrainStyle.btnStyle}>
            <Text style={TrainStyle.btnTextStyle}>submit</Text>
          </TouchableOpacity>
          </View>
        </View>
      </List.Accordion>
      <List.Accordion title="Level 6" id="6">
        <View>
          <List.Item title="Session 6" />
          <Text style={TrainStyle.sessionTitle}>Basic English Concepts</Text>
          <View style={TrainStyle.btnContainer}>
            <TouchableOpacity style={TrainStyle.btnStyle} onPress={viewClicked}>
              <Text style={TrainStyle.btnTextStyle}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={TrainStyle.btnStyle}
              onPress={downloadClicked}
            >
              <Text style={TrainStyle.btnTextStyle}>Download</Text>
            </TouchableOpacity>
          </View>
          <Text style={TrainStyle.subHeading}>Rate this session</Text>
          <View style={TrainStyle.chipContainer}>
            <Chip
              mode="outlined"
              onPress={() => console.log("Pressed")}
              style={TrainStyle.chipItem}
            >
              Needs Improvement
            </Chip>
            <Chip
              mode="outlined"
              onPress={() => console.log("Pressed")}
              style={TrainStyle.chipItem}
            >
              Good
            </Chip>
            <Chip
              mode="outlined"
              onPress={() => console.log("Pressed")}
              style={TrainStyle.chipItem}
            >
              Excellent
            </Chip>
            <Chip
              mode="outlined"
              onPress={() => console.log("Pressed")}
              style={TrainStyle.chipItem}
            >
              Statisfactory
            </Chip>
          </View>
          <View style={[TrainStyle.submitContainer, TrainStyle.addMargin]}>
          <TouchableOpacity onPress={submitBtn} style={TrainStyle.btnStyle}>
            <Text style={TrainStyle.btnTextStyle}>submit</Text>
          </TouchableOpacity>
          </View>
        </View>
      </List.Accordion>
    </List.AccordionGroup>
  );
};

const TrainStyle = StyleSheet.create({
  btnContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  chipContainer: {
    flex: 2,
    flexDirection: "row",
  },
  submitContainer:{
    flex:1,
    justifyContent:"flex-end",
    alignItems:"flex-end",
  },
  chipFirstItem: {
    width: 300,
    height: 30,
    fontSize: 2,
    borderRadius: 25,
  },
  chipItem: {
    width: 100,
    height: 30,
    fontSize: 2,
    borderRadius: 25,
    alignContent: "center",
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
    marginTop: 10,
    marginRight: 10,
  },
  sessionTitle: {
    margin: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  btnStyle: {
    alignItems: "center",
    padding: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#FF758F",
    width: 100,
    height: 40,
  },
  addMargin:{
    marginTop:100,
  },
  subHeading: {
    marginTop: 60,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 20,
  },
  btnTextStyle: {
    fontSize: 15,
    color: "#FF758F",
  },
});

export default StudentTraining;
