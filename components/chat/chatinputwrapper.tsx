import ChatTextInput from "./chattextinput";
import { View, StyleSheet } from 'react-native';

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
