import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importando as telas
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import InventoryScreen from './screens/InventoryScreen';
import ProfileScreen from './screens/ProfileScreen'; // <-- 1. Nova tela importada aqui!

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Cadastrar' }}
        />
        <Stack.Screen 
          name="Inventory" 
          component={InventoryScreen} 
          options={{ title: 'Meu Estoque', headerLeft: null }} 
        />
        {/* 2. Nova tela registrada no navegador abaixo: */}
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'Meu Perfil' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
