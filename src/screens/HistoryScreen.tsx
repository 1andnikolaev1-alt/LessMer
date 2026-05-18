import { useCallback, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getMeasurements, deleteMeasurement, SavedMeasurement } from '../utils/database';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

export default function HistoryScreen({ navigation }: Props) {
  const [items, setItems] = useState<SavedMeasurement[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, []),
  );

  const loadHistory = async () => {
    try {
      const data = await getMeasurements();
      setItems(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Удалить замер?', 'Это действие нельзя отменить', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          await deleteMeasurement(id);
          setItems(prev => prev.filter(i => i.id !== id));
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: SavedMeasurement }) => {
    const { result } = item;
    const date = new Date(result.timestamp);
    const dateStr = date.toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
    const timeStr = date.toLocaleTimeString('ru-RU', {
      hour: '2-digit', minute: '2-digit',
    });

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Result', { result: result })}
        onLongPress={() => handleDelete(item.id)}
      >
        <View style={styles.cardRow}>
          {result.imageUri ? (
            <Image source={{ uri: result.imageUri }} style={styles.thumb} />
          ) : (
            <View style={[styles.thumb, styles.thumbPlaceholder]}>
              <Text style={styles.thumbIcon}>🪵</Text>
            </View>
          )}
          <View style={styles.cardInfo}>
            <Text style={styles.cardDate}>{dateStr} {timeStr}</Text>
            <View style={styles.cardStats}>
              <Text style={styles.cardStat}>
                {result.logsCount} шт
              </Text>
              <Text style={[styles.cardStat, styles.cardVolume]}>
                {result.totalVolumeM3} м³
              </Text>
            </View>
            <Text style={styles.cardDetail}>
              ⌀ {result.minDiameterCm}–{result.maxDiameterCm} см  |  {result.logLengthM} м
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Загрузка...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyTitle}>Нет замеров</Text>
        <Text style={styles.emptyText}>
          Сделайте первый замер — результаты{'\n'}будут сохраняться автоматически
        </Text>
        <TouchableOpacity
          style={styles.emptyBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.emptyBtnText}>Новый замер</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <Text style={styles.hint}>Долгое нажатие — удалить замер</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#161B22', borderRadius: 12, padding: 12,
    marginBottom: 12, borderWidth: 1, borderColor: '#30363D',
  },
  cardRow: { flexDirection: 'row', gap: 12 },
  thumb: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#21262D' },
  thumbPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  thumbIcon: { fontSize: 28 },
  cardInfo: { flex: 1, justifyContent: 'center' },
  cardDate: { color: '#8B949E', fontSize: 12, marginBottom: 4 },
  cardStats: { flexDirection: 'row', gap: 12, marginBottom: 2 },
  cardStat: { color: '#C9D1D9', fontSize: 16, fontWeight: '600' },
  cardVolume: { color: '#3FB950' },
  cardDetail: { color: '#8B949E', fontSize: 12 },
  empty: {
    flex: 1, backgroundColor: '#0D1117', alignItems: 'center',
    justifyContent: 'center', padding: 40,
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { color: '#fff', fontSize: 20, fontWeight: '600', marginBottom: 8 },
  emptyText: { color: '#8B949E', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  emptyBtn: {
    backgroundColor: '#238636', borderRadius: 10, paddingHorizontal: 24,
    paddingVertical: 12, marginTop: 20,
  },
  emptyBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  hint: { color: '#484F58', fontSize: 12, textAlign: 'center', paddingBottom: 12 },
});
