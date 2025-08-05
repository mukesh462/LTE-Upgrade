import React from "react";
import { View, Image, StyleSheet, Modal } from "react-native";
import { BlurView } from "expo-blur";

const Loader = ({ visible }) => {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.container}>
        <BlurView intensity={90} style={styles.blur} />
        <Image source={require("../../../assets/spinner.gif")} style={styles.loader} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent overlay
  },
  blur: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  loader: {
    width: 60,
    height: 60,
    objectFit:"contain"
  },
});

export default Loader;
