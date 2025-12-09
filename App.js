// App.js - Versión corregida
import React, { useContext } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider, AuthContext } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import AboutScreen from './src/screens/AboutScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  console.log('AppNavigator - loading:', loading);
  console.log('AppNavigator - user:', user);

  if (loading) {
    console.log('AppNavigator - Mostrando loading...');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Cargando aplicación...</Text>
      </View>
    );
  }

  console.log('AppNavigator - Redirigiendo a:', user ? 'Services' : 'Login');
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2E7D32',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {user ? (
        <>
          <Stack.Screen
            name="Services"
            component={ServicesScreen}
            options={{ title: 'Servicios' }}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordScreen}
            options={{ title: 'Cambiar contraseña' }}
          />
          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{ title: 'Acerca de' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Iniciar sesión', headerShown: false }}
          />
          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{ title: 'Acerca de' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;