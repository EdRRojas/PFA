// src/screens/ServicesScreen.js
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { getServiciosApi } from '../api/medioAmbienteApi';
import { AuthContext } from '../context/AuthContext';

const ServicesScreen = ({ navigation }) => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { logoutUser, user } = useContext(AuthContext);

  const cargarServicios = async (fromRefresh = false) => {
    try {
      if (!fromRefresh) setLoading(true);
      const data = await getServiciosApi();
      setServicios(data);
    } catch (error) {
      console.log('Error cargando servicios:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    cargarServicios(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.nombre}</Text>
      {item.descripcion ? (
        <Text style={styles.cardDescription}>{item.descripcion}</Text>
      ) : null}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Cargando servicios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={servicios}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Servicios del Ministerio</Text>
            <Text style={styles.userText}>
              Bienvenido, {user?.nombre || 'usuario'}
            </Text>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => navigation.navigate('ChangePassword')}
              >
                <Text style={styles.smallButtonText}>Cambiar contraseña</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.smallButtonSecondary}
                onPress={() => navigation.navigate('About')}
              >
                <Text style={styles.smallButtonSecondaryText}>Acerca de</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.smallButtonDanger}
                onPress={logoutUser}
              >
                <Text style={styles.smallButtonDangerText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    </View>
  );
};

export default ServicesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 4,
  },
  userText: {
    fontSize: 14,
    color: '#388E3C',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#424242',
  },
  actionsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  smallButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 8,
    marginTop: 4,
  },
  smallButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  smallButtonSecondary: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2E7D32',
    marginRight: 8,
    marginTop: 4,
  },
  smallButtonSecondaryText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: 'bold',
  },
  smallButtonDanger: {
    backgroundColor: '#C62828',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  smallButtonDangerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});