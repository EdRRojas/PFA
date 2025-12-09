import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
import { AuthService } from '../services/auth';

interface Reporte {
  codigo: string;
  titulo: string;
  estado: string;
  latitud: number;
  longitud: number;
}

export default function MapaReportesScreen() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    const token = await AuthService.obtenerToken();

    if (!token) {
      setLoading(false);
      Alert.alert(
        'Inicio de sesión requerido',
        'Debes iniciar sesión para ver el mapa de reportes'
      );
      return;
    }

    try {
      const response = await axios.get(
        'https://adamix.net/medioambiente/mis_reportes',
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.exito) {
        setReportes(response.data.datos || []);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudieron cargar los reportes');
    } finally {
      setLoading(false);
    }
  };

  const getMarkerColor = (estado: string) => {
    switch(estado.toLowerCase()) {
      case 'pendiente': return '#FF9800';
      case 'en proceso': return '#2196F3';
      case 'resuelto': return '#4CAF50';
      default: return '#F44336';
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7B1FA2" />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </View>
    );
  }

  if (reportes.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>🗺️</Text>
        <Text style={styles.emptyText}>No hay reportes para mostrar</Text>
        <Text style={styles.emptySubtext}>
          Tus reportes aparecerán en el mapa una vez que los envíes
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: reportes[0]?.latitud || 18.486058,
          longitude: reportes[0]?.longitud || -69.931212,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
        provider={PROVIDER_GOOGLE}
      >
        {reportes.map((reporte) => (
          <Marker
            key={reporte.codigo}
            coordinate={{
              latitude: reporte.latitud,
              longitude: reporte.longitud,
            }}
            pinColor={getMarkerColor(reporte.estado)}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>#{reporte.codigo}</Text>
                <Text style={styles.calloutText}>{reporte.titulo}</Text>
                <View style={[styles.calloutBadge, { backgroundColor: getMarkerColor(reporte.estado) }]}>
                  <Text style={styles.calloutEstado}>{reporte.estado}</Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Leyenda</Text>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#FF9800' }]} />
          <Text style={styles.legendText}>Pendiente</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#2196F3' }]} />
          <Text style={styles.legendText}>En Proceso</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Resuelto</Text>
        </View>
      </View>

      <View style={styles.counter}>
        <Text style={styles.counterText}>{reportes.length} reportes</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#666', textAlign: 'center' },
  map: { flex: 1 },
  callout: { width: 200, padding: 10 },
  calloutTitle: { fontWeight: 'bold', marginBottom: 4, fontSize: 14 },
  calloutText: { fontSize: 13, marginBottom: 8 },
  calloutBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  calloutEstado: { fontSize: 11, fontWeight: '600', color: 'white' },
  legend: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  legendTitle: { fontWeight: 'bold', marginBottom: 8, fontSize: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  legendText: { fontSize: 12 },
  counter: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#7B1FA2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  counterText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
});