import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function HistoryScreen() {
  const history = [
    { id: '1', date: '01/10/2026', time: '32 min', distance: '2.5 km', incident: false },
    { id: '2', date: '28/09/2026', time: '45 min', distance: '4.1 km', incident: true },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Caminhadas</Text>

      <FlatList 
        data={history} 
        keyExtractor={item => item.id} 
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.details}>{item.time} • {item.distance}</Text>
            </View>
            <Text style={[styles.badge, item.incident ? styles.alertBadge : styles.okBadge]}>
              {item.incident ? 'Alerta Emitido' : 'Seguro'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 20, paddingTop: 50 },
  title: { color: '#F8FAFC', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  date: { color: '#F8FAFC', fontWeight: 'bold', fontSize: 16 },
  details: { color: '#94A3B8', marginTop: 4 },
  badge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, fontSize: 12, fontWeight: 'bold' },
  okBadge: { backgroundColor: '#166534', color: '#4ADE80' },
  alertBadge: { backgroundColor: '#991B1B', color: '#FCA5A5' },
});