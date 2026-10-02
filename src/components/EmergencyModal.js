import React, { useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';

export default function EmergencyModal({ visible, timer, onCancel, onTrigger }) {
  useEffect(() => {
    if (visible) {
      // Padrão de vibração para alerta
      Vibration.vibrate([500, 500, 500], true);
    } else {
      Vibration.cancel();
    }
    return () => Vibration.cancel();
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.warningTitle}>⚠️ ALERTA DE EMERGÊNCIA</Text>
          <Text style={styles.subtitle}>
            Anomalia ou queda detectada! Disparando alerta em:
          </Text>

          <Text style={styles.timer}>{timer}s</Text>

          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>CANCELAR ALARME (ESTOU BEM)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#0F172A',
    borderColor: '#EF4444',
    borderWidth: 2,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  warningTitle: {
    color: '#EF4444',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#F8FAFC',
    textAlign: 'center',
    fontSize: 14,
  },
  timer: {
    color: '#EF4444',
    fontSize: 64,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  cancelButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  cancelText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});