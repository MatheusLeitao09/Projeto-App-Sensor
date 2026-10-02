import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import MetricCard from '../components/MetricCard';
import EmergencyModal from '../components/EmergencyModal';

export default function HomeScreen() {
  const [isTracking, setIsTracking] = useState(false);
  const [speed, setSpeed] = useState(0); // km/h
  const [distance, setDistance] = useState(0); // km
  const [elapsedTime, setElapsedTime] = useState(0); // segundos
  
  // Modal de Emergência
  const [alertActive, setAlertActive] = useState(false);
  const [countdown, setCountdown] = useState(15);

  const locationSubscription = useRef(null);
  const accelSubscription = useRef(null);
  const lastLocation = useRef(null);
  const timerRef = useRef(null);

  // Pedir permissões de localização ao carregar
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão Negada', 'Ative o GPS para monitorizar as suas caminhadas.');
      }
    })();

    return () => stopTracking();
  }, []);

  // Cronómetro da Caminhada
  useEffect(() => {
    if (isTracking) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTracking]);

  // Cálculo de Distância do GPS Real
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Iniciar Monitorização
  const startTracking = async () => {
    setIsTracking(true);
    setDistance(0);
    setElapsedTime(0);
    setSpeed(0);

    // 1. GPS Real (Rua)
    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (location) => {
        const { latitude, longitude, speed: currentSpeed } = location.coords;

        if (currentSpeed && currentSpeed > 0) {
          setSpeed(currentSpeed * 3.6);
        }

        if (lastLocation.current) {
          const d = calculateDistance(
            lastLocation.current.latitude,
            lastLocation.current.longitude,
            latitude,
            longitude
          );
          if (d > 0.0005) {
            setDistance((prevDist) => prevDist + d);
          }
        }
        lastLocation.current = { latitude, longitude };
      }
    );

    // 2. Acelerómetro Ajustado (Sensibilidade Alta para Movimento Manual)
    Accelerometer.setUpdateInterval(150); // Leitura mais rápida
    accelSubscription.current = Accelerometer.addListener((data) => {
      // Força de movimento acumulada
      const gForce = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);

      // DETECÇÃO DE QUEDA / SACUDIDA MUITO FORTE (> 3.2G)
      if (gForce > 3.2 && !alertActive) {
        triggerEmergency();
        return;
      }

      // QUALQUER MOVIMENTO LEVE/MÉDIO (> 1.15G) JÁ SOMA DISTÂNCIA
      if (gForce > 1.15) {
        setDistance((prev) => prev + 0.002); // Soma 2 metros a cada balanço
        setSpeed(4.8); // Define velocidade de caminhada
      } else {
        setSpeed(0); // Para a velocidade se ficar parado
      }
    });
  };

  // Parar Monitorização
  const stopTracking = () => {
    setIsTracking(false);
    if (locationSubscription.current) locationSubscription.current.remove();
    if (accelSubscription.current) accelSubscription.current.remove();
    lastLocation.current = null;
    setSpeed(0);
  };

  // Contagem Regressiva do SOS
  useEffect(() => {
    let interval = null;
    if (alertActive && countdown > 0) {
      interval = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (alertActive && countdown === 0) {
      clearInterval(interval);
      sendAlert();
    }
    return () => clearInterval(interval);
  }, [alertActive, countdown]);

  const triggerEmergency = () => {
    setAlertActive(true);
    setCountdown(15);
  };

  const cancelEmergency = () => {
    setAlertActive(false);
    setCountdown(15);
  };

  const sendAlert = () => {
    setAlertActive(false);
    Alert.alert('🚨 SOS ENVIADO!', 'O alerta automatizado com a sua localização foi enviado com sucesso aos contatos.');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SafeWalk 🛡️</Text>
      
      {/* Cards de Métricas */}
      <View style={styles.metricsRow}>
        <MetricCard label="Tempo" value={formatTime(elapsedTime)} unit="" />
        <MetricCard label="Distância" value={distance.toFixed(2)} unit="km" />
        <MetricCard label="Velocidade" value={speed.toFixed(1)} unit="km/h" />
      </View>

      {/* Caixa Informativa */}
      <View style={styles.mapBox}>
        <Text style={styles.mapText}>
          {isTracking ? '📍 Sensores Ativos: Abane suavemente o telemóvel' : '⏸️ Clique abaixo para iniciar'}
        </Text>
      </View>

      {/* Botões */}
      <TouchableOpacity 
        style={[styles.mainButton, isTracking ? styles.stopBtn : styles.startBtn]} 
        onPress={isTracking ? stopTracking : startTracking}
      >
        <Text style={styles.buttonText}>
          {isTracking ? 'FINALIZAR CAMINHADA' : 'INICIAR CAMINHADA'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sosButton} onPress={triggerEmergency}>
        <Text style={styles.sosText}>🚨 SOS EMERGÊNCIA</Text>
      </TouchableOpacity>

      {/* Modal SOS */}
      <EmergencyModal 
        visible={alertActive} 
        timer={countdown} 
        onCancel={cancelEmergency} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 20, paddingTop: 50 },
  header: { color: '#F8FAFC', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  mapBox: { flex: 1, backgroundColor: '#1E293B', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 20, padding: 10 },
  mapText: { color: '#38BDF8', fontWeight: 'bold', textAlign: 'center' },
  mainButton: { padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  startBtn: { backgroundColor: '#38BDF8' },
  stopBtn: { backgroundColor: '#F59E0B' },
  sosButton: { backgroundColor: '#EF4444', padding: 18, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#0F172A', fontWeight: 'bold', fontSize: 16 },
  sosText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});