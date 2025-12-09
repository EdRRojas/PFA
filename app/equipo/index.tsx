import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { api } from '../../services/api';
import { TeamMember } from '../../types';

export default function EquipoScreen() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const data = await api.getTeam();
      
      // Ordenar por el campo "orden"
      const sortedTeam = data.sort((a: TeamMember, b: TeamMember) => a.orden - b.orden);
      setTeam(sortedTeam);
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Cargando equipo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Equipo del Ministerio</Text>
      <Text style={styles.sectionSubtitle}>
        Conoce a las personas que trabajan por nuestro medio ambiente
      </Text>

      <FlatList
        data={team}
        renderItem={({ item }) => (
          <View style={styles.teamCard}>
            <Image source={{ uri: item.foto }} style={styles.photo} />
            <View style={styles.teamContent}>
              <Text style={styles.name}>{item.nombre}</Text>
              <Text style={styles.position}>{item.cargo}</Text>
              <Text style={styles.department}>{item.departamento}</Text>
              <Text style={styles.biography} numberOfLines={3}>
                {item.biografia}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No hay información del equipo disponible
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  teamCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  teamContent: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  position: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
    marginBottom: 2,
  },
  department: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  biography: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});