import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
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
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="noticias/index" 
        options={{ 
          title: '📰 Noticias Ambientales',
        }} 
      />
      <Stack.Screen 
        name="reportar/index" 
        options={{ 
          title: '🚨 Reportar Daño',
        }} 
      />
      <Stack.Screen 
        name="mis-reportes/index" 
        options={{ 
          title: '📋 Mis Reportes',
        }} 
      />
      <Stack.Screen 
        name="mapa-reportes/index" 
        options={{ 
          title: '🗺️ Mapa de Reportes',
        }} 
      />
    </Stack>
  );
}