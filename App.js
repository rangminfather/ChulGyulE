import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ActivityIndicator, BackHandler, Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from './src/utils/theme';
import { loadData } from './src/utils/data';
import { IconCalendar, IconPlus, IconChart, IconSettings } from './src/assets/icons';

import MainScreen from './src/screens/MainScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import StatsScreen from './src/screens/StatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const AppHeader = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <View style={styles.headerInner}>
        <View style={styles.headerLeft}>
          <View style={styles.logoIcon}><Text style={{ fontSize: 16 }}>✏️</Text></View>
          <Text style={styles.logoText}>출결이</Text>
        </View>
      </View>
    </View>
  );
};

const LoadingScreen = () => (
  <View style={styles.loading}>
    <View style={styles.loadingIcon}><Text style={{ fontSize: 40 }}>✏️</Text></View>
    <Text style={styles.loadingTitle}>출결이</Text>
    <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
  </View>
);

const useTabBarStyle = () => {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 20);
  return {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    height: 58 + bottomPad,
    paddingBottom: bottomPad,
    paddingTop: 6,
    elevation: 8,
  };
};

const TabBarWrapper = ({ children }) => {
  const tabBarStyle = useTabBarStyle();
  return React.cloneElement(children, { tabBarStyle });
};

export default function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => { setData(await loadData()); setIsLoading(false); })();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert('출결이 종료', '앱을 종료하시겠습니까?', [
        { text: '취소', style: 'cancel' },
        { text: '종료', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    });
    return () => handler.remove();
  }, []);

  if (isLoading || !data) return <LoadingScreen />;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor={COLORS.white} />
      <NavigationContainer>
        <AppContent data={data} setData={setData} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function AppContent({ data, setData }) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 20);
  const tabStyle = {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    height: 58 + bottomPad,
    paddingBottom: bottomPad,
    paddingTop: 6,
    elevation: 8,
  };

  return (
    <>
      <AppHeader />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color }) => {
            if (route.name === '출결') return <IconCalendar size={22} color={color} />;
            if (route.name === '등록') return <IconPlus size={22} color={color} />;
            if (route.name === '통계') return <IconChart size={22} color={color} />;
            if (route.name === '설정') return <IconSettings size={22} color={color} />;
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.navInactive,
          tabBarStyle: tabStyle,
          tabBarLabelStyle: styles.tabLabel,
          tabBarItemStyle: { paddingTop: 2 },
        })}
      >
        <Tab.Screen name="출결">
          {(props) => <MainScreen {...props} data={data} setData={setData} />}
        </Tab.Screen>
        <Tab.Screen name="등록">
          {(props) => <RegisterScreen {...props} data={data} setData={setData} />}
        </Tab.Screen>
        <Tab.Screen name="통계">
          {(props) => <StatsScreen {...props} data={data} setData={setData} />}
        </Tab.Screen>
        <Tab.Screen name="설정">
          {(props) => <SettingsScreen {...props} data={data} setData={setData} />}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoIcon: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: COLORS.primaryPale,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: COLORS.borderWarm,
  },
  logoText: { fontSize: 19, fontWeight: '800', color: COLORS.primaryDark, letterSpacing: -0.5 },
  tabLabel: { fontSize: 10, fontWeight: '700', marginTop: -2 },
  loading: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  loadingIcon: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: COLORS.primaryPale, alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, borderWidth: 2, borderColor: COLORS.borderWarm,
  },
  loadingTitle: { fontSize: 24, fontWeight: '900', color: COLORS.primaryDark },
});