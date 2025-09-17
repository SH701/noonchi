import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Chatroom() {
  const { id } = useLocalSearchParams(); // 여기서 id = router.push(...) 에 넣은 값
  return (
    <View>
      <Text>Chatroom ID: {id}</Text>
    </View>
  );
}
