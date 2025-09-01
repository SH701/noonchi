import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const [isKeyboard, setIsKeyboard] = useState(false);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessage("");
  };

  // MicIcon
  const MicIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
      <Path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3z" />
      <Path d="M19 11a7 7 0 01-14 0M12 19v4m-4-4h8" />
    </Svg>
  );

  // ArrowIcon
  const ArrowIcon = () => (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white">
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 12h14M12 5l7 7-7 7"
      />
    </Svg>
  );

  return (
    <View style={styles.container}>
      {isKeyboard ? (
        // ✅ 키보드 모드 UI
        <View style={styles.keyboardContainer}>
          <TextInput
            style={styles.keyboardInput}
            placeholder="Enter your message"
            placeholderTextColor="#9ca3af"
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // ✅ 기본 모드 UI (마이크 + 입력창 + 화살표 버튼)
        <View style={styles.defaultContainer}>
          {/* 마이크 버튼 */}
          <TouchableOpacity style={styles.micButton}>
            <MicIcon />
          </TouchableOpacity>

          {/* 입력창 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Reply here"
              placeholderTextColor="#9ca3af"
              value={message}
              editable={false}
              onPressIn={() => setIsKeyboard(true)} // 👈 클릭 시 키보드 모드 전환
            />
            <TouchableOpacity
              onPress={sendMessage}
              style={styles.arrowButton}
            >
              <ArrowIcon />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    width: 375,
  },
  keyboardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 12,
    flex: 1,
  },
  keyboardInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 14,
  },
  sendButton: {
    paddingVertical: 4,
  },
  sendButtonText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  defaultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#60a5fa',
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#eff6ff',
    fontSize: 14,
    color: '#9ca3af',
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

