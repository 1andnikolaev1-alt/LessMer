import { View, Text, ScrollView, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Guide'>;

export default function GuideScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Как измерить объём</Text>

      <View style={styles.step}>
        <Text style={styles.stepNum}>1</Text>
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Подготовьте эталон</Text>
          <Text style={styles.stepDesc}>
            Эталон — это любой предмет известной длины, который приложение
            найдёт на фото и по нему определит масштаб.
          </Text>
          <Text style={styles.stepHighlight}>Что подойдёт:</Text>
          <Text style={styles.stepList}>
            {'\u2022'} Яркая рейка или палка (красная, оранжевая, жёлтая, зелёная){'\n'}
            {'\u2022'} Строительная линейка с яркой окраской{'\n'}
            {'\u2022'} Рулетка (вытянутая, яркого цвета){'\n'}
            {'\u2022'} Любая полоска контрастного яркого цвета
          </Text>
          <Text style={styles.stepWarning}>
            Важно: эталон должен быть ЯРКОГО цвета, чтобы выделяться
            на фоне брёвен. Чем контрастнее — тем точнее.
          </Text>
        </View>
      </View>

      <View style={styles.step}>
        <Text style={styles.stepNum}>2</Text>
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Прикрепите эталон к штабелю</Text>
          <Text style={styles.stepDesc}>
            Положите или прикрепите эталон на торцевую поверхность штабеля
            так, чтобы он был виден целиком на фото.
          </Text>
          <Text style={styles.stepHighlight}>Правила размещения:</Text>
          <Text style={styles.stepList}>
            {'\u2022'} Эталон должен быть в одной плоскости с торцами брёвен{'\n'}
            {'\u2022'} Не должен быть закрыт брёвнами или другими предметами{'\n'}
            {'\u2022'} Лучше всего — горизонтально или вертикально{'\n'}
            {'\u2022'} Длинная сторона должна быть хорошо видна
          </Text>
        </View>
      </View>

      <View style={styles.step}>
        <Text style={styles.stepNum}>3</Text>
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Сделайте фото</Text>
          <Text style={styles.stepDesc}>
            Встаньте напротив штабеля так, чтобы видеть все торцы брёвен
            и эталон. Фотографируйте с расстояния 3-5 метров.
          </Text>
          <Text style={styles.stepHighlight}>Советы для точности:</Text>
          <Text style={styles.stepList}>
            {'\u2022'} Фотографируйте при хорошем освещении{'\n'}
            {'\u2022'} Камеру держите прямо (не под углом){'\n'}
            {'\u2022'} Все торцы должны быть видны{'\n'}
            {'\u2022'} Избегайте сильных теней и бликов
          </Text>
        </View>
      </View>

      <View style={styles.step}>
        <Text style={styles.stepNum}>4</Text>
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Укажите параметры</Text>
          <Text style={styles.stepDesc}>
            В приложении укажите реальную длину вашего эталона
            (в сантиметрах) и длину брёвен (в метрах).
          </Text>
          <Text style={styles.stepHighlight}>Пример:</Text>
          <Text style={styles.stepList}>
            {'\u2022'} Метровая рейка → эталон 100 см{'\n'}
            {'\u2022'} Линейка 30 см → эталон 30 см{'\n'}
            {'\u2022'} Рулетка вытянута на 50 см → эталон 50 см
          </Text>
        </View>
      </View>

      <View style={styles.note}>
        <Text style={styles.noteTitle}>Если эталон не найден</Text>
        <Text style={styles.noteDesc}>
          Если приложение не нашло эталон на фото, оно использует
          приблизительный масштаб. В этом случае результат может быть
          неточным. Попробуйте использовать более яркий эталон
          или сфотографировать при лучшем освещении.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  content: { padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 24, fontWeight: 'bold', color: '#fff',
    textAlign: 'center', marginBottom: 24,
  },
  step: {
    flexDirection: 'row', marginBottom: 24,
    backgroundColor: '#161B22', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#30363D',
  },
  stepNum: {
    fontSize: 28, fontWeight: 'bold', color: '#238636',
    width: 40, textAlign: 'center',
  },
  stepContent: { flex: 1, marginLeft: 12 },
  stepTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 6 },
  stepDesc: { fontSize: 14, color: '#C9D1D9', lineHeight: 20, marginBottom: 8 },
  stepHighlight: { fontSize: 14, fontWeight: '600', color: '#58A6FF', marginBottom: 4 },
  stepList: { fontSize: 14, color: '#C9D1D9', lineHeight: 22, marginBottom: 4 },
  stepWarning: {
    fontSize: 13, color: '#F0883E', lineHeight: 18,
    marginTop: 6, fontStyle: 'italic',
  },
  note: {
    backgroundColor: '#1C2128', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#F0883E', marginTop: 8,
  },
  noteTitle: { fontSize: 16, fontWeight: '700', color: '#F0883E', marginBottom: 6 },
  noteDesc: { fontSize: 14, color: '#C9D1D9', lineHeight: 20 },
});
