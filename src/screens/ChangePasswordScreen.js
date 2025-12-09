// src/screens/ChangePasswordScreen.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { changePasswordApi } from '../api/medioAmbienteApi';

const ChangePasswordScreen = ({ navigation }) => {
  const { user, logoutUser } = useContext(AuthContext);
  const [claveActual, setClaveActual] = useState('');
  const [claveNueva, setClaveNueva] = useState('');
  const [claveConfirmar, setClaveConfirmar] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    // Validaciones básicas de contraseña
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Debe contener al menos una letra mayúscula';
    }
    if (!/[0-9]/.test(password)) {
      return 'Debe contener al menos un número';
    }
    return null;
  };

  const onChangePassword = async () => {
    // Validar campos vacíos
    if (!claveActual || !claveNueva || !claveConfirmar) {
      Alert.alert('Error', 'Debe completar todos los campos');
      return;
    }

    // Validar que las nuevas contraseñas coincidan
    if (claveNueva !== claveConfirmar) {
      Alert.alert('Error', 'La nueva contraseña y la confirmación no coinciden');
      return;
    }

    // Validar que la nueva contraseña sea diferente a la actual
    if (claveActual === claveNueva) {
      Alert.alert('Error', 'La nueva contraseña debe ser diferente a la actual');
      return;
    }

    // Validar fortaleza de la nueva contraseña
    const passwordError = validatePassword(claveNueva);
    if (passwordError) {
      Alert.alert('Error', passwordError);
      return;
    }

    try {
      setLoading(true);
      
      // Llamar a la API para cambiar la contraseña
      await changePasswordApi({
        token: user.token,
        clave_actual: claveActual,
        clave_nueva: claveNueva,
      });
      
      // Éxito: mostrar mensaje y cerrar sesión
      Alert.alert(
        'Contraseña cambiada',
        'Tu contraseña ha sido cambiada exitosamente. Por seguridad, debes iniciar sesión nuevamente.',
        [
          {
            text: 'Aceptar',
            onPress: () => {
              logoutUser();
              navigation.navigate('Login');
            },
          },
        ]
      );
      
    } catch (error) {
      // Manejar errores específicos de la API
      let errorMessage = error.message;
      
      if (error.message.includes('incorrecta')) {
        errorMessage = 'La contraseña actual es incorrecta';
      } else if (error.message.includes('token')) {
        errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Cambiar Contraseña</Text>
          <Text style={styles.subtitle}>
            Para mayor seguridad, actualiza tu contraseña periódicamente
          </Text>
        </View>

        <View style={styles.form}>
          {/* Campo: Contraseña actual */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña actual *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu contraseña actual"
              secureTextEntry
              value={claveActual}
              onChangeText={setClaveActual}
              editable={!loading}
              autoCapitalize="none"
            />
          </View>

          {/* Campo: Nueva contraseña */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nueva contraseña *</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 8 caracteres, mayúscula y número"
              secureTextEntry
              value={claveNueva}
              onChangeText={setClaveNueva}
              editable={!loading}
              autoCapitalize="none"
            />
            <Text style={styles.helperText}>
              • Mínimo 8 caracteres{"\n"}
              • Al menos una mayúscula{"\n"}
              • Al menos un número
            </Text>
          </View>

          {/* Campo: Confirmar nueva contraseña */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar nueva contraseña *</Text>
            <TextInput
              style={styles.input}
              placeholder="Repite la nueva contraseña"
              secureTextEntry
              value={claveConfirmar}
              onChangeText={setClaveConfirmar}
              editable={!loading}
              autoCapitalize="none"
            />
          </View>

          {/* Botones */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={onChangePassword}
              disabled={loading || !claveActual || !claveNueva || !claveConfirmar}
            >
              <Text style={styles.saveButtonText}>
                {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Información adicional */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Recomendaciones de seguridad:</Text>
            <Text style={styles.infoText}>
              • No uses contraseñas obvias como "123456" o "password"{"\n"}
              • Combina letras, números y símbolos{"\n"}
              • No compartas tu contraseña con nadie{"\n"}
              • Cambia tu contraseña cada 3 meses
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    lineHeight: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDD',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#2E7D32',
    marginLeft: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
  },
});

export default ChangePasswordScreen;