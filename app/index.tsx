import Onboard from "@/components/onboard/onboard";
import {StyleSheet, View } from "react-native";

export default function OnboardScreen() {

  return (
    <View style={styles.container}>
        <Onboard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
