import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import ProcessingScreen from './src/screens/ProcessingScreen';
import ResultScreen from './src/screens/ResultScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import GuideScreen from './src/screens/GuideScreen';
import type { MeasurementResult } from './src/utils/gost';

export type RootStackParamList = {
  Home: undefined;
  Processing: {
    imageUri: string;
    referenceLengthCm: number;
    logLengthM: number;
  };
  Result: {
    result: MeasurementResult;
  };
  History: undefined;
  Guide: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#161B22' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: '#0D1117' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'ЛесМер', headerShown: false }}
        />
        <Stack.Screen
          name="Processing"
          component={ProcessingScreen}
          options={{ title: 'Анализ...', headerShown: false }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{ title: 'Результат' }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: 'История замеров' }}
        />
        <Stack.Screen
          name="Guide"
          component={GuideScreen}
          options={{ title: 'Инструкция' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
