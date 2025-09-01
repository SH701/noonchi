'use client';

import { View, Text, StyleSheet } from 'react-native';

export default function Score({
  label,
  value,
}: {
  label: string;
  value: number | string 
}) {
  const num = Number(value)  
  return (
    <View style={styles.container}>
      {/* 라벨 + 퍼센트 */}
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.percentage}>{num}%</Text>
      </View>
      {/* 퍼센트 바 */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${num}%` }
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 4,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 14,
    fontWeight: '500',
  },
  label: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
  percentage: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#bfdbfe',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 6,
  },
});
