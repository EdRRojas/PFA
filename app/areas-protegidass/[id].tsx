import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';
import { ProtectedArea } from '../../types';

export default function AreaDetailScreen() {
  const { id } = useLocalSearchParams();
  const [area, setArea] = useState<ProtectedArea | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAreaDetails();
  }, [id]);

  const fetchAreaDetails = async () => {
    setLoading(true);
    try {
      // Buscar en todas las áreas protegidas
      const areas = await api.getProtectedAreas();
      const foundArea = areas.find((a: ProtectedArea) => a.id === id);
      setArea(foundArea || null);
    } catch (error) {
      console.error('Error fetching area details:', error);
      Alert.alert('Error', 'No se pudo cargar la información del área');
    } finally {
      setLoading(false);
    }
  };

  const formatAreaType = (tipo: string) => {
    const typeMap: Record<string, string> = {
      'parque_nacional': 'Parque Nacional',
      'reserva_cientifica': 'Reserva Científica',
      'monumento_natural': 'Monumento Natural',
      'refugio_vida_silvestre': 'Refugio de Vida Silvestre',
    };
    return typeMap[tipo] || tipo.replace('_', ' ').toUpperCase();
  };

  const openInMaps = () => {
    if (area) {
      const url = `https://www.google.com/maps/search/?api=1&query=${area.latitud},${area.longitud}`;
      Linking.openURL(url).catch(err => 
        Alert.alert('Error', 'No se pudo abrir el mapa')
      );
    }
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/areas-protegidas');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Cargando información...</Text>
      </View>
    );
  }

  if (!area) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="warning-outline" size={60} color="#ff9800" />
        <Text style={styles.errorTitle}>Área no encontrada</Text>
        <Text style={styles.errorText}>
          El área protegida solicitada no existe o no está disponible.
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>Volver a Áreas Protegidas</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Header con botón de volver */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButtonHeader} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles del Área</Text>
      </View>

      <Image 
        source={{ 
          uri: area.imagen || 'https://via.placeholder.com/400x300?text=Área+Protegida'
        }} 
        style={styles.headerImage} 
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>{area.nombre}</Text>
        
        <View style={styles.typeBadge}>
          <FontAwesome name="tag" size={14} color="#fff" />
          <Text style={styles.typeText}>
            {formatAreaType(area.tipo)}
          </Text>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <FontAwesome name="map-marker" size={20} color="#2E7D32" />
            <Text style={styles.infoCardLabel}>Ubicación</Text>
            <Text style={styles.infoCardValue}>{area.ubicacion}</Text>
          </View>

          <View style={styles.infoCard}>
            <FontAwesome name="expand" size={20} color="#2E7D32" />
            <Text style={styles.infoCardLabel}>Superficie</Text>
            <Text style={styles.infoCardValue}>{area.superficie}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{area.descripcion}</Text>
        </View>

        <TouchableOpacity style={styles.mapButton} onPress={openInMaps}>
          <FontAwesome name="map" size={20} color="#fff" />
          <Text style={styles.mapButtonText}>Ver en Google Maps</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coordenadas</Text>
          <View style={styles.coordinates}>
            <View style={styles.coordinateItem}>
              <Text style={styles.coordinateLabel}>Latitud</Text>
              <Text style={styles.coordinateValue}>{area.latitud.toFixed(6)}°</Text>
            </View>
            <View style={styles.coordinateItem}>
              <Text style={styles.coordinateLabel}>Longitud</Text>
              <Text style={styles.coordinateValue}>{area.longitud.toFixed(6)}°</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.backButtonFull} onPress={handleGoBack}>
          <Text style={styles.backButtonFullText}>← Volver a la lista</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButtonHeader: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  headerImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    marginTop: 60,
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 20,
  },
  typeBadge: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  typeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoCardLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'justify',
  },
  mapButton: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  coordinates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coordinateItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  coordinateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  coordinateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'monospace',
  },
  backButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButtonFull: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E7D32',
    marginTop: 20,
  },
  backButtonFullText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 24,
  },
});