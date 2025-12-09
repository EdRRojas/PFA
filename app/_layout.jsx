import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Inicio',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="videos" 
          options={{ 
            title: 'Videos Educativos',
            headerStyle: { backgroundColor: '#2E7D32' },
            headerTintColor: '#fff',
          }} 
        />
        <Stack.Screen 
          name="areas-protegidas" 
          options={{ 
            title: 'Áreas Protegidas',
            headerStyle: { backgroundColor: '#2E7D32' },
            headerTintColor: '#fff',
          }} 
        />
        <Stack.Screen 
          name="areas-protegidass/[id]" 
          options={{ 
            title: 'Detalle del Área',
            headerStyle: { backgroundColor: '#2E7D32' },
            headerTintColor: '#fff',
          }} 
        />
        <Stack.Screen 
          name="equipo" 
          options={{ 
            title: 'Equipo del Ministerio',
            headerStyle: { backgroundColor: '#2E7D32' },
            headerTintColor: '#fff',
          }} 
        />
        <Stack.Screen 
          name="voluntariado" 
          options={{ 
            title: 'Voluntariado',
            headerStyle: { backgroundColor: '#2E7D32' },
            headerTintColor: '#fff',
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}