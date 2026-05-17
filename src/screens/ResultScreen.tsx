import {
  View, Text, TouchableOpacity, StyleSheet, Image,
  ScrollView, FlatList, Share, Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import type { MeasurementResult, LogMeasurement } from '../utils/gost';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export default function ResultScreen({ route, navigation }: Props) {
  const { result } = route.params;

  const shareResult = async () => {
    const groups: Record<number, { count: number; vol: number }> = {};
    for (const log of result.logs) {
      const d = Math.max(8, Math.min(40, Math.round(log.diameterCm / 2) * 2));
      if (!groups[d]) groups[d] = { count: 0, vol: 0 };
      groups[d].count++;
      groups[d].vol += log.volumeM3;
    }

    let table = 'Ø см | Шт | м³\n';
    for (const d of Object.keys(groups).map(Number).sort((a, b) => a - b)) {
      table += `${d} | ${groups[d].count} | ${groups[d].vol.toFixed(3)}\n`;
    }

    const text = `ЛесМер — Результат замера\n` +
      `Дата: ${new Date(result.timestamp).toLocaleString('ru-RU')}\n` +
      `Брёвен: ${result.logsCount}\n` +
      `Объём: ${result.totalVolumeM3} м³\n` +
      `Диаметры: ${result.minDiameterCm}–${result.maxDiameterCm} см\n` +
      `Длина брёвен: ${result.logLengthM} м\n` +
      `Эталон: ${result.referenceLengthCm} см\n` +
      `Метод: ${result.method}\n\n` +
      table;

    try {
      await Share.share({ message: text });
    } catch {
      Alert.alert('Ошибка', 'Не удалось поделиться');
    }
  };

  const renderLogItem = ({ item }: { item: LogMeasurement }) => (
    <View style={styles.logItem}>
      <Text style={styles.logId}>#{item.id}</Text>
      <Text style={styles.logDiam}>⌀ {item.diameterCm} см</Text>
      <Text style={styles.logVol}>{item.volumeM3} м³</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={{ uri: result.resultImageUri || result.imageUri }}
        style={styles.image}
      />

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{result.logsCount}</Text>
            <Text style={styles.statLabel}>Брёвен</Text>
          </View>
          <View style={[styles.statCard, styles.statCardMain]}>
            <Text style={[styles.statValue, styles.statValueMain]}>
              {result.totalVolumeM3}
            </Text>
            <Text style={styles.statLabel}>м³</Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Мин ⌀</Text>
            <Text style={styles.detailValue}>{result.minDiameterCm} см</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Сред ⌀</Text>
            <Text style={styles.detailValue}>{result.avgDiameterCm} см</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Макс ⌀</Text>
            <Text style={styles.detailValue}>{result.maxDiameterCm} см</Text>
          </View>
        </View>

        <View style={styles.info}>
          <Text style={styles.infoText}>Эталон: {result.referenceLengthCm} см</Text>
          <Text style={styles.infoText}>Длина брёвен: {result.logLengthM} м</Text>
          <Text style={styles.infoText}>Метод: {result.method}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Детализация</Text>

      <View style={styles.logHeader}>
        <Text style={styles.logHeaderText}>№</Text>
        <Text style={styles.logHeaderText}>Диаметр</Text>
        <Text style={styles.logHeaderText}>Объём</Text>
      </View>

      {result.logs.map(log => (
        <View key={log.id} style={styles.logItem}>
          <Text style={styles.logId}>#{log.id}</Text>
          <Text style={styles.logDiam}>⌀ {log.diameterCm} см</Text>
          <Text style={styles.logVol}>{log.volumeM3} м³</Text>
        </View>
      ))}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.shareBtn} onPress={shareResult}>
          <Text style={styles.shareBtnText}>Поделиться результатом</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => navigation.popToTop()}
        >
          <Text style={styles.newBtnText}>Новый замер</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  content: { paddingBottom: 40 },
  image: { width: '100%', height: 220, backgroundColor: '#161B22' },
  summary: { padding: 16 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statCard: {
    flex: 1, backgroundColor: '#161B22', borderRadius: 12, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: '#30363D',
  },
  statCardMain: { borderColor: '#238636' },
  statValue: { fontSize: 32, fontWeight: 'bold', color: '#C9D1D9' },
  statValueMain: { color: '#3FB950' },
  statLabel: { fontSize: 14, color: '#8B949E', marginTop: 4 },
  detailsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  detail: {
    flex: 1, backgroundColor: '#161B22', borderRadius: 8, padding: 12,
    alignItems: 'center', borderWidth: 1, borderColor: '#30363D',
  },
  detailLabel: { fontSize: 12, color: '#8B949E' },
  detailValue: { fontSize: 16, fontWeight: '600', color: '#C9D1D9', marginTop: 2 },
  info: {
    backgroundColor: '#161B22', borderRadius: 8, padding: 12,
    borderWidth: 1, borderColor: '#30363D',
  },
  infoText: { color: '#8B949E', fontSize: 13, marginVertical: 2 },
  sectionTitle: {
    fontSize: 18, fontWeight: '600', color: '#fff', paddingHorizontal: 16, marginTop: 8,
    marginBottom: 8,
  },
  logHeader: {
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8,
    borderBottomWidth: 1, borderColor: '#30363D',
  },
  logHeaderText: { flex: 1, color: '#8B949E', fontSize: 12, fontWeight: '600' },
  logItem: {
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderColor: '#21262D',
  },
  logId: { flex: 1, color: '#8B949E', fontSize: 14 },
  logDiam: { flex: 1, color: '#C9D1D9', fontSize: 14, fontWeight: '500' },
  logVol: { flex: 1, color: '#3FB950', fontSize: 14, fontWeight: '500', textAlign: 'right' },
  actions: { padding: 16, gap: 12 },
  shareBtn: {
    backgroundColor: '#1F6FEB', borderRadius: 12, padding: 16, alignItems: 'center',
  },
  shareBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  newBtn: {
    backgroundColor: '#21262D', borderRadius: 12, padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: '#30363D',
  },
  newBtnText: { color: '#C9D1D9', fontSize: 16, fontWeight: '600' },
});
