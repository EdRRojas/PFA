import { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, 
  ActivityIndicator, TouchableOpacity, ScrollView, Modal, Alert 
} from 'react-native';

import axios from 'axios';

interface Noticia {
  id: string;
  titulo: string;
  contenido: string;
  fecha: string;
  imagen: string;
}

export default function NoticiasScreen() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState<Noticia | null>(null);

  useEffect(() => {
    cargarNoticias();
  }, []);

  const cargarNoticias = async () => {
    try {
      const response = await axios.get('https://adamix.net/medioambiente/noticias');
      console.log('Respuesta API:', response.data);
      
      // El API devuelve un array directo
      if (Array.isArray(response.data)) {
        setNoticias(response.data);
      } else if (response.data.exito) {
        setNoticias(response.data.datos || []);
      }
    } catch (error) {
      console.error('Error al cargar noticias:', error);
      Alert.alert('Error', 'No se pudieron cargar las noticias');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Cargando noticias...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Noticias Ambientales</Text>
        <Text style={styles.headerSubtitle}>
          {noticias.length === 0 ? 'Cargando...' : `${noticias.length} noticia${noticias.length !== 1 ? 's' : ''} disponible${noticias.length !== 1 ? 's' : ''}`}
        </Text>
      </View>

      {noticias.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📰</Text>
          <Text style={styles.emptyText}>No hay noticias disponibles</Text>
          <Text style={styles.emptySubtext}>
            Las noticias ambientales aparecerán aquí próximamente
          </Text>
        </View>
      ) : (
        <FlatList
          data={noticias}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => setNoticiaSeleccionada(item)}
          >
            {item.imagen && (
              <Image 
                source={{ uri: item.imagen }} 
                style={styles.image}
                resizeMode="cover"
              />
            )}
            <View style={styles.cardContent}>
              <Text style={styles.newsTitle} numberOfLines={2}>
                {item.titulo}
              </Text>
              <Text style={styles.date}>
                📅 {new Date(item.fecha).toLocaleDateString('es-DO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
              <Text style={styles.preview} numberOfLines={3}>
                {item.contenido}
              </Text>
              <Text style={styles.readMore}>Leer más →</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      )}

      <Modal
        visible={!!noticiaSeleccionada}
        animationType="slide"
        onRequestClose={() => setNoticiaSeleccionada(null)}
      >
        {noticiaSeleccionada && (
          <ScrollView style={styles.modalContainer}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setNoticiaSeleccionada(null)}
            >
              <Text style={styles.closeButtonText}>✕ Cerrar</Text>
            </TouchableOpacity>

            {noticiaSeleccionada.imagen && (
              <Image 
                source={{ uri: noticiaSeleccionada.imagen }} 
                style={styles.modalImage}
              />
            )}

            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{noticiaSeleccionada.titulo}</Text>
              <Text style={styles.modalDate}>
                📅 {new Date(noticiaSeleccionada.fecha).toLocaleDateString('es-DO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
              <Text style={styles.modalText}>{noticiaSeleccionada.contenido}</Text>
            </View>
          </ScrollView>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  list: { padding: 16 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: { fontSize: 80, marginBottom: 16 },
  emptyText: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#666', textAlign: 'center' },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  image: { width: '100%', height: 200 },
  placeholderImage: { 
    width: '100%', 
    height: 200, 
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: { fontSize: 80 },
  cardContent: { padding: 16 },
  newsTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  date: { fontSize: 13, color: '#666', marginBottom: 12 },
  preview: { fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 8 },
  readMore: { fontSize: 14, color: '#2E7D32', fontWeight: '600' },
  
  modalContainer: { flex: 1, backgroundColor: 'white' },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  closeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  modalImage: { width: '100%', height: 300 },
  modalContent: { padding: 20 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  modalDate: { fontSize: 14, color: '#666', marginBottom: 20 },
  modalText: { fontSize: 16, color: '#444', lineHeight: 24 },
});