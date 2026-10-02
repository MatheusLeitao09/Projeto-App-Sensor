import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importação das ecrãs
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ContactsScreen from './src/screens/ContactsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={{
          headerShown: false,
          tabBarStyle: { 
            backgroundColor: '#0F172A', 
            borderTopColor: '#1E293B',
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#38BDF8',
          tabBarInactiveTintColor: '#64748B',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen 
          name="Início" 
          component={HomeScreen} 
        />
        <Tab.Screen 
          name="Histórico" 
          component={HistoryScreen} 
        />
        <Tab.Screen 
          name="Contatos" 
          component={ContactsScreen} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}