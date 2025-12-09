import { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, Image, Modal, ScrollView, Alert
} from 'react-native';
import axios from 'axios';
import { AuthService } from '../services/auth';

interface Reporte {
  codigo: string;
  fecha: string;
  titulo: string;
  descripcion: string;
  foto: string;
  estado: string;
  comentario_ministerio: string;
}

export default function MisReportesScreen() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [reporteSeleccionado, setReporteSeleccionado] = useState<Reporte | null>(null);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    const token = await AuthService.obtenerToken();

    if (!token) {
      setLoading(false);
      Alert.alert(
        'Inicio de sesión requerido',
        'Debes iniciar sesión para ver tus reportes'
      );
      return;
    }

    try {
      const response = await axios.get(
        'https://adamix.net/medioambiente/mis_reportes',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
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

  const getEstadoColor = (estado: string) => {
    switch(estado.toLowerCase()) {
      case 'pendiente': return '#FF9800';
      case 'en proceso': return '#2196F3';
      case 'resuelto': return '#4CAF50';
      case 'rechazado': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Cargando reportes...</Text>
      </View>
    );
  }

  if (reportes.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>📭</Text>
        <Text style={styles.emptyText}>No tienes reportes</Text>
        <Text style={styles.emptySubtext}>
          Tus reportes aparecerán aquí una vez que los envíes
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}> Mis Reportes</Text>
        <Text style={styles.headerSubtitle}>{reportes.length} reportes realizados</Text>
      </View>

      <FlatList
        data={reportes}
        keyExtractor={(item) => item.codigo}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setReporteSeleccionado(item)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.codigo}>#{item.codigo}</Text>
              <View style={[styles.badge, { backgroundColor: getEstadoColor(item.estado) }]}>
                <Text style={styles.badgeText}>{item.estado}</Text>
              </View>
            </View>
            <Text style={styles.titulo} numberOfLines={2}>{item.titulo}</Text>
            <Text style={styles.fecha}>{new Date(item.fecha).toLocaleDateString('es-DO')}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={!!reporteSeleccionado}
        animationType="slide"
        onRequestClose={() => setReporteSeleccionado(null)}
      >
        {reporteSeleccionado && (
          <ScrollView style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setReporteSeleccionado(null)}
            >
              <Text style={styles.closeText}>✕ Cerrar</Text>
            </TouchableOpacity>

            {reporteSeleccionado.foto && (
              <Image
                source={{ uri: `data:image/jpeg;base64,${reporteSeleccionado.foto}` }}
                style={styles.modalImage}
                resizeMode="cover"
              />
            )}

            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalCodigo}>Código: #{reporteSeleccionado.codigo}</Text>
                <View style={[styles.modalBadge, { backgroundColor: getEstadoColor(reporteSeleccionado.estado) }]}>
                  <Text style={styles.badgeText}>{reporteSeleccionado.estado}</Text>
                </View>
              </View>

              <Text style={styles.modalTitulo}>{reporteSeleccionado.titulo}</Text>
              <Text style={styles.modalFecha}>
                📅 {new Date(reporteSeleccionado.fecha).toLocaleDateString('es-DO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>

              <Text style={styles.sectionTitle}>Descripción:</Text>
              <Text style={styles.modalDescripcion}>{reporteSeleccionado.descripcion}</Text>

              {reporteSeleccionado.comentario_ministerio && (
                <>
                  <Text style={styles.sectionTitle}>Respuesta del Ministerio:</Text>
                  <View style={styles.comentarioBox}>
                    <Text style={styles.comentario}>{reporteSeleccionado.comentario_ministerio}</Text>
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#666', textAlign: 'center' },
  header: {
    backgroundColor: '#1976D2',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  list: { padding: 16 },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codigo: { fontSize: 14, fontWeight: '600', color: '#666' },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  titulo: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  fecha: { fontSize: 13, color: '#666' },
  
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
  closeText: { color: 'white', fontWeight: 'bold' },
  modalImage: { width: '100%', height: 300 },
  modalContent: { padding: 20 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalCodigo: { fontSize: 16, fontWeight: '600', color: '#666' },
  modalBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16 },
  modalTitulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  modalFecha: { fontSize: 14, color: '#666', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  modalDescripcion: { fontSize: 15, lineHeight: 22, color: '#444' },
  comentarioBox: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
  },
  comentario: { fontSize: 15, lineHeight: 22, color: '#333' },
});