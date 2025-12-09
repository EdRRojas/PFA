import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { api } from '../services/api';
import { areaTypes } from '../constants/categories';
import AreaCard from '../components/20220847/AreaCard';
import CategoryFilter from '../components/20220847/CategoryFilter';
import SearchBar from '../components/20220847/SearchBar';
import { ProtectedArea } from '../types';

export default function AreasProtegidasScreen() {
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [areas, setAreas] = useState<ProtectedArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchAreas = useCallback(async () => {
    try {
      const data = await api.getProtectedAreas(
        selectedType === '' ? undefined : selectedType,
        debouncedSearch === '' ? undefined : debouncedSearch
      );
      setAreas(data);
    } catch (error) {
      console.error('Error fetching areas:', error);
      setAreas([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedType, debouncedSearch]);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAreas();
  }, [fetchAreas]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedType(categoryId);
  };

  const renderAreaItem = ({ item }: { item: ProtectedArea }) => (
    <AreaCard area={item} />
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Cargando áreas protegidas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Áreas Protegidas</Text>
      <Text style={styles.sectionSubtitle}>
        Descubre los tesoros naturales de República Dominicana
      </Text>

      <SearchBar
        value={searchQuery}
        onChangeText={handleSearchChange}
        placeholder="Buscar por nombre, ubicación..."
      />

      <CategoryFilter
        categories={areaTypes}
        selectedCategory={selectedType}
        onSelectCategory={handleCategoryChange}
      />

      <View style={styles.resultsInfo}>
        <Text style={styles.resultsText}>
          {areas.length} {areas.length === 1 ? 'área encontrada' : 'áreas encontradas'} 
          {selectedType && selectedType !== '' ? 
            ` - Tipo: ${areaTypes.find(t => t.id === selectedType)?.label}` 
            : ''}
        </Text>
      </View>

      <FlatList
        data={areas}
        renderItem={renderAreaItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2E7D32']}
            tintColor="#2E7D32"
          />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No se encontraron áreas</Text>
              <Text style={styles.emptyText}>
                {searchQuery || selectedType ? 
                  'Intenta con otros términos de búsqueda o selecciona otra categoría' : 
                  'No hay áreas protegidas disponibles en este momento'}
              </Text>
            </View>
          )
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
    lineHeight: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  resultsInfo: {
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  resultsText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
    textAlign: 'center',
  },
});