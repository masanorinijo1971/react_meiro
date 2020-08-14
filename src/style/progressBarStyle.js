import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  background: {
    top: 0,
    left: 0,
    zIndex: 9999,
    height: "100%",
    width: "100%",
    overflow: "hidden",
    position: "absolute",
  },
  fill: {
    height: 5,
    backgroundColor: "#ff9024",
  },
  overlay: {
    zIndex: 999,
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "transparent",
  },
});

export default styles;
