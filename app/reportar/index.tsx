import { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, ScrollView, Image 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import axios from 'axios';
import { AuthService } from '../services/auth';

export default function ReportarScreen() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fotoBase64, setFotoBase64] = useState('');
  const [fotoUri, setFotoUri] = useState('');
  const [latitud, setLatitud] = useState<number | null>(null);
  const [longitud, setLongitud] = useState<number | null>(null);
  const [enviando, setEnviando] = useState(false);

  const tomarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      setFotoUri(result.assets[0].uri);
      setFotoBase64(result.assets[0].base64 || '');
    }
  };

  const seleccionarFoto = async () => {
    try {
      // Primero verificar el permiso
      const permissionResult = await ImagePicker.getMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted && permissionResult.canAskAgain) {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'No podemos acceder a tus fotos');
          return;
        }
      }

      console.log('Abriendo galería...');
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
        base64: true,
        allowsMultipleSelection: false,
      });

      console.log('Resultado:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('Foto seleccionada');
        setFotoUri(result.assets[0].uri);
        setFotoBase64(result.assets[0].base64 || '');
        Alert.alert('✓', 'Foto seleccionada correctamente');
      } else {
        console.log('Usuario canceló');
      }
    } catch (error) {
      console.error('Error completo:', error);
      Alert.alert('Error', `No se pudo abrir la galería: ${error}`);
    }
  };

  const obtenerUbicacion = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu ubicación');
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      setLatitud(location.coords.latitude);
      setLongitud(location.coords.longitude);
      Alert.alert('✓', 'Ubicación obtenida correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación');
    }
  };

  const enviarReporte = async () => {
    if (!titulo.trim()) {
      Alert.alert('Campo requerido', 'Ingresa un título');
      return;
    }

    if (!descripcion.trim()) {
      Alert.alert('Campo requerido', 'Ingresa una descripción');
      return;
    }

    if (!fotoBase64) {
      Alert.alert('Foto requerida', 'Debes agregar una foto');
      return;
    }

    if (latitud === null || longitud === null) {
      Alert.alert('Ubicación requerida', 'Debes obtener tu ubicación');
      return;
    }

    const token = await AuthService.obtenerToken();

    if (!token) {
      Alert.alert(
        'Inicio de sesión requerido',
        'Debes iniciar sesión para reportar daños ambientales'
      );
      return;
    }

    setEnviando(true);

    try {
      const response = await axios.post(
        'https://adamix.net/medioambiente/reportar_dano',
        {
          titulo,
          descripcion,
          foto: fotoBase64,
          latitud,
          longitud,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.exito) {
        Alert.alert('¡Éxito!', 'Reporte enviado correctamente');
        setTitulo('');
        setDescripcion('');
        setFotoBase64('');
        setFotoUri('');
        setLatitud(null);
        setLongitud(null);
      } else {
        Alert.alert('Error', response.data.mensaje || 'No se pudo enviar');
      }
    } catch (error: any) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}> Reportar Daño Ambiental</Text>
        <Text style={styles.headerSubtitle}>Ayuda a proteger nuestro medio ambiente</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ej: Basura acumulada en río"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Descripción *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Describe el problema con detalle..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Fotografía *</Text>
        <View style={styles.photoButtons}>
          <TouchableOpacity style={styles.photoButton} onPress={tomarFoto}>
            <Text style={styles.buttonText}> Cámara</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoButton} onPress={seleccionarFoto}>
            <Text style={styles.buttonText}>Galería</Text>
          </TouchableOpacity>
        </View>
        {fotoUri ? (
          <Image source={{ uri: fotoUri }} style={styles.preview} />
        ) : null}

        <Text style={styles.label}>Ubicación *</Text>
        <TouchableOpacity style={styles.locationButton} onPress={obtenerUbicacion}>
          <Text style={styles.buttonText}> Obtener mi ubicación GPS</Text>
        </TouchableOpacity>
        {latitud !== null && longitud !== null ? (
          <View style={styles.locationInfo}>
            <Text style={styles.locationText}>✓ Ubicación capturada</Text>
            <Text style={styles.coordinates}>
              {latitud.toFixed(6)}, {longitud.toFixed(6)}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity 
          style={[styles.submitButton, enviando ? styles.buttonDisabled : null]}
          onPress={enviarReporte}
          disabled={enviando}
        >
          <Text style={styles.submitText}>
            {enviando ? 'Enviando...' : ' Enviar Reporte'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          * Todos los reportes son revisados por el Ministerio de Medio Ambiente
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    backgroundColor: '#D32F2F',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  form: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8, color: '#333' },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: { height: 100 },
  photoButtons: { flexDirection: 'row', gap: 10 },
  photoButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  locationButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  preview: { width: '100%', height: 200, borderRadius: 8, marginTop: 12 },
  locationInfo: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  locationText: { fontSize: 14, fontWeight: '600', color: '#2E7D32' },
  coordinates: { fontSize: 12, color: '#666', marginTop: 4 },
  submitButton: {
    backgroundColor: '#2E7D32',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: { backgroundColor: '#81C784', opacity: 0.7 },
  submitText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  note: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
});