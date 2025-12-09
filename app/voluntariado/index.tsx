import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { api } from '@services/api';
import { VolunteerFormData } from '../../types';

export default function VoluntariadoScreen() {
  const [formData, setFormData] = useState<VolunteerFormData>({
    cedula: '',
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    telefono: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof VolunteerFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar la cédula
    if (!formData.cedula.trim()) {
      newErrors.cedula = 'La cédula es requerida';
    } else if (!/^\d{11}$/.test(formData.cedula.trim())) {
      newErrors.cedula = 'La cédula debe tener 11 dígitos';
    }

    // Validar el nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar el apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    }

    // Validar el correo
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo.trim())) {
      newErrors.correo = 'Ingrese un correo válido';
    }

    // Validar la contraseña
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar el teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^[\d\s\-()+]{10,15}$/.test(formData.telefono.trim())) {
      newErrors.telefono = 'Ingrese un número de teléfono válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // quita los espacios en blanco de los datos
      const cleanData = {
        cedula: formData.cedula.trim(),
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        correo: formData.correo.trim().toLowerCase(),
        password: formData.password,
        telefono: formData.telefono.trim(),
      };

      console.log('Enviando datos:', cleanData);
      
      const response = await api.submitVolunteer(cleanData);
      
      console.log('Respuesta recibida:', response);
      
      Alert.alert(
        '¡Éxito!',
        response.mensaje || 'Tu solicitud de voluntariado ha sido registrada exitosamente.',
        [
          {
            text: 'Aceptar',
            onPress: () => {
              // Limpia el formulario
              setFormData({
                cedula: '',
                nombre: '',
                apellido: '',
                correo: '',
                password: '',
                telefono: '',
              });
              setErrors({});
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Error completo:', error);
      Alert.alert(
        'Error',
        error.message || 'Error al enviar la solicitud. Por favor intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Voluntariado Ambiental</Text>
        <Text style={styles.sectionSubtitle}>
          Únete a nuestro equipo de voluntarios y contribuye al cuidado del medio ambiente
        </Text>

        <View style={styles.requirements}>
          <Text style={styles.requirementsTitle}>Requisitos:</Text>
          <Text style={styles.requirement}>• Ser mayor de 18 años</Text>
          <Text style={styles.requirement}>• Tener interés en temas ambientales</Text>
          <Text style={styles.requirement}>• Disponibilidad para actividades programadas</Text>
          <Text style={styles.requirement}>• Compromiso con la conservación ambiental</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Solicitud de Voluntariado</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cédula *</Text>
            <TextInput
              style={[styles.input, errors.cedula && styles.inputError]}
              placeholder="Ej: 40212512368"
              value={formData.cedula}
              onChangeText={(value) => handleInputChange('cedula', value)}
              keyboardType="numeric"
              maxLength={11}
              editable={!loading}
            />
            {errors.cedula ? <Text style={styles.errorText}>{errors.cedula}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nombre *</Text>
            <TextInput
              style={[styles.input, errors.nombre && styles.inputError]}
              placeholder="Ej: Edinson"
              value={formData.nombre}
              onChangeText={(value) => handleInputChange('nombre', value)}
              autoCapitalize="words"
              editable={!loading}
            />
            {errors.nombre ? <Text style={styles.errorText}>{errors.nombre}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Apellido *</Text>
            <TextInput
              style={[styles.input, errors.apellido && styles.inputError]}
              placeholder="Ej: Rojas"
              value={formData.apellido}
              onChangeText={(value) => handleInputChange('apellido', value)}
              autoCapitalize="words"
              editable={!loading}
            />
            {errors.apellido ? <Text style={styles.errorText}>{errors.apellido}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Correo Electrónico *</Text>
            <TextInput
              style={[styles.input, errors.correo && styles.inputError]}
              placeholder="ejemplo@correo.com"
              value={formData.correo}
              onChangeText={(value) => handleInputChange('correo', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!loading}
            />
            {errors.correo ? <Text style={styles.errorText}>{errors.correo}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contraseña *</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry
              editable={!loading}
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Teléfono *</Text>
            <TextInput
              style={[styles.input, errors.telefono && styles.inputError]}
              placeholder="Ej: 8292786789"
              value={formData.telefono}
              onChangeText={(value) => handleInputChange('telefono', value)}
              keyboardType="phone-pad"
              editable={!loading}
            />
            {errors.telefono ? <Text style={styles.errorText}>{errors.telefono}</Text> : null}
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Enviar Solicitud</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.notes}>
            * Todos los campos son obligatorios.
            {'\n'}** Te contactaremos una vez revisemos tu solicitud.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
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
    marginBottom: 24,
    lineHeight: 20,
  },
  requirements: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  requirement: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#D32F2F',
    backgroundColor: '#FFEBEE',
  },
  errorText: {
    fontSize: 12,
    color: '#D32F2F',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#81C784',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notes: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
});