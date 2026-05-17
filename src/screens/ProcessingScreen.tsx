import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { detectLogs } from '../utils/detection';

type Props = NativeStackScreenProps<RootStackParamList, 'Processing'>;

export default function ProcessingScreen({ route, navigation }: Props) {
  const { imageUri, referenceLengthCm, logLengthM } = route.params;
  const [status, setStatus] = useState('Загрузка изображения...');

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setStatus('Определение масштаба по эталону...');
      await delay(600);
      if (cancelled) return;

      setStatus('Поиск торцов брёвен...');
      await delay(400);
      if (cancelled) return;

      setStatus('Расчёт объёма по ГОСТ 2708-75...');

      const result = await detectLogs({ imageUri, referenceLengthCm, logLengthM });

      if (!cancelled) {
        navigation.replace('Result', { result });
      }
    };

    run().catch(err => {
      if (!cancelled) {
        setStatus(`Ошибка: ${err.message}`);
      }
    });

    return () => { cancelled = true; };
  }, [imageUri, referenceLengthCm, logLengthM, navigation]);

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} blurRadius={3} />
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#238636" />
        <Text style={styles.status}>{status}</Text>
        <View style={styles.params}>
          <Text style={styles.param}>Эталон: {referenceLengthCm} см</Text>
          <Text style={styles.param}>Длина брёвен: {logLengthM} м</Text>
        </View>
      </View>
    </View>
  );
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  image: { position: 'absolute', width: '100%', height: '100%', opacity: 0.3 },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  status: { color: '#fff', fontSize: 18, fontWeight: '600', marginTop: 24, textAlign: 'center' },
  params: { marginTop: 30, alignItems: 'center' },
  param: { color: '#8B949E', fontSize: 14, marginTop: 4 },
});
