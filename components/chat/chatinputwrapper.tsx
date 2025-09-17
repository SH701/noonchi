import { StyleSheet, View } from "react-native";
import ChatTextInput from "./chattextinput";

export default function ChatInputWrapper() {
  return (
    <View style={styles.container}>
      <ChatTextInput />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    paddingVertical: 12,
    flex: 1,
    height: 60,
  },
});
