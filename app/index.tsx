import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌿 Medio Ambiente RD</Text>

      <Link href="/noticias" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>📰 Noticias</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/reportar" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>🚨 Reportar</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/mis-reportes" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>📋 Mis Reportes</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/mapa-reportes" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>🗺️ Mapa</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#2E7D32',
  },
  button: {
    backgroundColor: '#2E7D32',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});