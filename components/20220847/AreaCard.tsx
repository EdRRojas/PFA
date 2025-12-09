import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ProtectedArea } from '../../types';
import { useRouter } from 'expo-router';

interface AreaCardProps {
  area: ProtectedArea;
}

export default function AreaCard({ area }: AreaCardProps) {
  const router = useRouter();
  
  // Función que formatea el tipo de área
  const formatAreaType = (tipo: string) => {
    const typeMap: Record<string, string> = {
      'parque_nacional': 'Parque Nacional',
      'reserva_cientifica': 'Reserva Científica',
      'monumento_natural': 'Monumento Natural',
      'refugio_vida_silvestre': 'Refugio de Vida Silvestre',
    };
    return typeMap[tipo] || tipo.replace('_', ' ').toUpperCase();
  };

  const handlePress = () => {
    router.push(`/areas-protegidass/${area.id}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.9}>
      <Image 
        source={{ 
          uri: area.imagen || 'https://i1.sndcdn.com/avatars-000208517241-qitllz-t1080x1080.jpg'
        }} 
        style={styles.image} 
      />
      <View style={styles.content}>
        <Text style={styles.title}>{area.nombre}</Text>
        <Text style={styles.type}>
          {formatAreaType(area.tipo)}
        </Text>
        <View style={styles.location}>
          <FontAwesome name="map-marker" size={14} color="#666" />
          <Text style={styles.locationText}>{area.ubicacion}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {area.descripcion}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.surface}>{area.superficie}</Text>
          <View style={styles.detailButton}>
            <Text style={styles.detailButtonText}>Ver detalles →</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  type: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  surface: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  detailButton: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  detailButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },
});