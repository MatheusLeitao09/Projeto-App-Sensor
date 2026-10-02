import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MetricCard({ label, value, unit }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>
        {value} <Text style={styles.unit}>{unit}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '600',
  },
  value: {
    color: '#38BDF8',
    fontSize: 20,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 12,
    color: '#94A3B8',
  },
});