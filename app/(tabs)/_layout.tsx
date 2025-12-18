import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { View } from 'react-native';
import FAQPopup from '../../components/FAQPopup';
import { useAuth } from '../../context/AuthContext';

export default function TabLayout() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();


  return (
    <View style={{ flex: 1 }}>
      <Tabs
        initialRouteName="business-listings"
        screenOptions={{
          tabBarActiveTintColor: '#2B4450',
          tabBarStyle: {
            backgroundColor: '#f9f9f9',
          },
        }}
      >
        <Tabs.Screen
          name="business-listings"
          options={{
            title: 'Businesses',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'business' : 'business-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="buyers"
          options={{
            title: 'Buyers',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: isAuthenticated ? 'Profile' : 'Sign In',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={isAuthenticated ? (focused ? 'person-circle' : 'person-circle-outline') : (focused ? 'log-in' : 'log-in-outline')}
                color={color}
                size={24}
              />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              if (!isAuthenticated) {
                e.preventDefault();
                router.push('/(tabs)/sign-in-form');
              }
            },
          }}
        />
        <Tabs.Screen
          name="sign-in-form"
          options={{
            href: null,
            headerShown: false,
          }}
        />
      </Tabs>
      <FAQPopup />
    </View>
  );
}
