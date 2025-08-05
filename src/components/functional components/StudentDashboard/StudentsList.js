import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, FONTS, CONST } from "../../../../constants";
import StudentListItem from "../../ui components/StudentListItem";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../../ui components/Loader";

const StudentsList = ({ navigation }) => {
  const [animSpeed, setAnimSpeed] = useState(false);
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [stackIndex, setStackIndex] = useState(1);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", getStudentList);
    return unsubscribe;
  }, [navigation]);

  const getStudentList = async () => {
    try {
      let teacherID = await AsyncStorage.getItem("AuthState");
      setAnimSpeed(true);
      
      const response = await axios.post(`${CONST.baseUrl}/teacherapp/get/student/training`, {
        teacher_id: teacherID,
      });
console.log(response.data,"tghjk")
      setStudents(response.data || []);
      setAnimSpeed(false);
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudents([]);
      setAnimSpeed(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
  };

  const filteredStudents = students
    .filter((student) => {
      const matchesSearch = student.student_name.toLowerCase().includes(search.toLowerCase());
      if (stackIndex === 2) return matchesSearch && student.student_status === "active";
      if (stackIndex === 3) return matchesSearch && student.student_status !== "active";
      return matchesSearch;
    })
    .sort((a, b) => a.student_name.localeCompare(b.student_name));

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          onChangeText={handleSearch}
          value={search}
          placeholder="Search..."
          style={styles.searchInput}
          selectionColor={COLORS.grey}
        />
        <Ionicons name="search" size={22} color="#000000BD" style={styles.searchIcon} />
        <Ionicons name="funnel" size={22} color="#000000BD" style={styles.filterIcon} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        {["All", "Active", "Completed"].map((label, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSearch("");
              setStackIndex(index + 1);
            }}
            style={stackIndex === index + 1 ? styles.selectedBox : styles.unSelectedBox}
          >
            <Text style={stackIndex === index + 1 ? styles.selectedText : styles.unSelectedText}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* No Data Message */}
      {filteredStudents.length === 0 && !animSpeed && (
        <Text style={styles.noDataText}>No students found</Text>
      )}

      {/* Student List */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {filteredStudents.map((student, index) => (
          <StudentListItem
            key={index}
            name={student.student_name}
            education={student.education}
            number={student.whatsappno}
            sp_contact ={student.sponser_contactno}
            sp_name={student.sponser_name}
            onclick={() => navigation.navigate("Student Profile", student)}
          />
        ))}
      </ScrollView>

      <Loader visible={animSpeed} />
    </View>
  );
};

export default StudentsList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    padding: 16,
    alignItems: "center",
  },
  searchContainer: {
    width: "100%",
    justifyContent: "center",
  },
  searchInput: {
    height: 60,
    width: "100%",
    borderRadius: 30,
    borderColor: COLORS.borderGrey,
    paddingHorizontal: 42,
    borderWidth: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  searchIcon: {
    position: "absolute",
    left: 16,
  },
  filterIcon: {
    position: "absolute",
    right: 16,
  },
  tabContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 12,
  },
  unSelectedBox: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.borderGrey,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginHorizontal: 8,
  },
  selectedBox: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginHorizontal: 8,
  },
  unSelectedText: {
    fontFamily: FONTS.regular,
    color: COLORS.darkGrey,
    fontSize: 14,
  },
  selectedText: {
    fontFamily: FONTS.regular,
    color: COLORS.primary,
    fontSize: 14,
  },
  noDataText: {
    marginTop: 64,
    fontFamily: FONTS.bold,
    color: COLORS.darkGrey,
    fontSize: 16,
  },
  scrollContainer: {
    width: "100%",
    marginTop: 10
  },
});
