import { View, Text, StyleSheet } from 'react-native';

export default function Section({ title, desc, type }: { title: string; desc: string; type?: 'highlight' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>
      <View style={[
        styles.content,
        type === 'highlight' ? styles.highlightContent : styles.normalContent
      ]}>
        <Text style={styles.description}>
          {desc}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard',
    lineHeight: 20.8,
    paddingTop: 12,
    paddingLeft:6
  },
  content: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  normalContent: {
    backgroundColor: 'white',
  },
  highlightContent: {
    backgroundColor: '#eff6ff',
  },
  description: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Pretendard',
    lineHeight: 18.2,
  },
});