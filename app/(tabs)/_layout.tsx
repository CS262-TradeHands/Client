import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';


export default function TabLayout() {
  return (
    <Tabs initialRouteName="business-listings" 
        screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            tabBarStyle: {
                backgroundColor: '#f9f9f9',
            },
      }}>
      <Tabs.Screen name="business-listings" options={{ title: 'Businesses', 
        headerShown:false, tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'business' : 'business-outline'} color={color} size={24} />
          ), }} />
      <Tabs.Screen name="buyers" options={{ title: 'Buyers', 
        headerShown:false, tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24} />
          ), }} />
    </Tabs>
  );
}
