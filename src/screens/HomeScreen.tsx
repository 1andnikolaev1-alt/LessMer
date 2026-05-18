import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image, Alert,
  TextInput, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [refLength, setRefLength] = useState('100');
  const [logLength, setLogLength] = useState('6');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Нужен доступ к галерее');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Нужен доступ к камере');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const startMeasurement = () => {
    if (!imageUri) {
      Alert.alert('Ошибка', 'Сначала сделайте или выберите фото');
      return;
    }
    const ref = parseFloat(refLength);
    const log = parseFloat(logLength);
    if (isNaN(ref) || ref <= 0 || isNaN(log) || log <= 0) {
      Alert.alert('Ошибка', 'Укажите корректные значения');
      return;
    }
    navigation.navigate('Processing', {
      imageUri,
      referenceLengthCm: ref,
      logLengthM: log,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>🪵 ЛесМер</Text>
        <Text style={styles.subtitle}>Измерение объёма брёвен по фото</Text>

        {imageUri ? (
          <TouchableOpacity onPress={pickImage} style={styles.imageWrap}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <Text style={styles.tapHint}>Нажмите, чтобы заменить</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>📷</Text>
            <Text style={styles.placeholderText}>Фото штабеля брёвен</Text>
          </View>
        )}

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.btn} onPress={takePhoto}>
            <Text style={styles.btnIcon}>📸</Text>
            <Text style={styles.btnText}>Камера</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={pickImage}>
            <Text style={styles.btnIcon}>🖼️</Text>
            <Text style={styles.btnText}>Галерея</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Длина эталона (см)</Text>
          <Text style={styles.hint}>Укажите длину линейки на фото</Text>
          <View style={styles.inputRow}>
            {['10', '30', '50', '100'].map(v => (
              <TouchableOpacity
                key={v}
                style={[styles.chip, refLength === v && styles.chipActive]}
                onPress={() => setRefLength(v)}
              >
                <Text style={[styles.chipText, refLength === v && styles.chipTextActive]}>
                  {v}
                </Text>
              </TouchableOpacity>
            ))}
            <TextInput
              style={styles.input}
              value={refLength}
              onChangeText={setRefLength}
              keyboardType="numeric"
              placeholder="см"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Длина брёвен (м)</Text>
          <View style={styles.inputRow}>
            {['3', '4', '5', '6'].map(v => (
              <TouchableOpacity
                key={v}
                style={[styles.chip, logLength === v && styles.chipActive]}
                onPress={() => setLogLength(v)}
              >
                <Text style={[styles.chipText, logLength === v && styles.chipTextActive]}>
                  {v}
                </Text>
              </TouchableOpacity>
            ))}
            <TextInput
              style={styles.input}
              value={logLength}
              onChangeText={setLogLength}
              keyboardType="numeric"
              placeholder="м"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.measureBtn, !imageUri && styles.measureBtnDisabled]}
          onPress={startMeasurement}
          disabled={!imageUri}
        >
          <Text style={styles.measureBtnText}>Измерить объём</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.historyBtn}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.historyBtnText}>📋 История замеров</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginTop: 10 },
  subtitle: { fontSize: 14, color: '#8B949E', textAlign: 'center', marginBottom: 20 },
  imageWrap: { alignItems: 'center', marginBottom: 16 },
  image: { width: '100%', height: 220, borderRadius: 12, backgroundColor: '#161B22' },
  tapHint: { color: '#8B949E', fontSize: 12, marginTop: 4 },
  placeholder: {
    height: 180, borderRadius: 12, borderWidth: 2, borderColor: '#30363D',
    borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, backgroundColor: '#161B22',
  },
  placeholderIcon: { fontSize: 48 },
  placeholderText: { color: '#8B949E', marginTop: 8 },
  buttons: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  btn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#21262D', borderRadius: 10, padding: 14, gap: 8,
    borderWidth: 1, borderColor: '#30363D',
  },
  btnIcon: { fontSize: 20 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  inputGroup: { marginBottom: 20 },
  label: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  hint: { color: '#8B949E', fontSize: 12, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
    backgroundColor: '#21262D', borderWidth: 1, borderColor: '#30363D',
  },
  chipActive: { backgroundColor: '#1F6FEB', borderColor: '#1F6FEB' },
  chipText: { color: '#C9D1D9', fontSize: 14, fontWeight: '500' },
  chipTextActive: { color: '#fff' },
  input: {
    flex: 1, backgroundColor: '#161B22', borderRadius: 8, padding: 10,
    color: '#fff', fontSize: 16, borderWidth: 1, borderColor: '#30363D',
    textAlign: 'center', minWidth: 60,
  },
  measureBtn: {
    backgroundColor: '#238636', borderRadius: 12, padding: 18,
    alignItems: 'center', marginTop: 8,
  },
  measureBtnDisabled: { backgroundColor: '#21262D', opacity: 0.6 },
  measureBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  historyBtn: {
    backgroundColor: '#21262D', borderRadius: 12, padding: 14,
    alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: '#30363D',
  },
  historyBtnText: { color: '#C9D1D9', fontSize: 16, fontWeight: '600' },
});
