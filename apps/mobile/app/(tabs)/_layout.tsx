import { Tabs } from 'expo-router';
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E8B15A',
        tabBarStyle: { backgroundColor: '#121216', borderTopColor: '#ffffff18' },
      }}
    >
      <Tabs.Screen name="studio" options={{ title: 'Studio' }} />
      <Tabs.Screen name="library" options={{ title: 'Library' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Alerts' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
