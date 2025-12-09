// src/screens/LoginScreen.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { loginApi, recoverPasswordApi, registerApi } from '../api/medioAmbienteApi';

const LoginScreen = ({ navigation }) => {
  const { loginUser } = useContext(AuthContext);
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRecoverForm, setShowRecoverForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState('');
  
  // Estados para el formulario de registro (CON CÉDULA Y MATRÍCULA)
  const [registerData, setRegisterData] = useState({
    cedula: '',
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    matricula: '', // Campo adicional opcional
  });

  // Validar formato de email
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validar formato de teléfono (RD)
  const isValidPhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
  };

  // Validar cédula (formato RD)
  const isValidCedula = (cedula) => {
    // Eliminar guiones y espacios
    const cleaned = cedula.replace(/[- ]/g, '');
    
    // Verificar que sea solo números
    if (!/^\d+$/.test(cleaned)) return false;
    
    // Verificar longitud (11-13 dígitos para RD)
    if (cleaned.length < 11 || cleaned.length > 13) return false;
    
    return true;
  };

  // Validar matrícula (opcional, formato: 2021-0123)
  const isValidMatricula = (matricula) => {
    if (!matricula || matricula.trim() === '') return true; // Opcional
    
    const re = /^\d{4}-\d{4}$/;
    return re.test(matricula);
  };

  // Validar contraseña
  const isValidPassword = (password) => {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    return true;
  };

  // Iniciar sesión
  const onLogin = async () => {
    if (!correo.trim() || !clave.trim()) {
      Alert.alert('Error', 'Debe completar correo y contraseña');
      return;
    }

    if (!isValidEmail(correo)) {
      Alert.alert('Error', 'Por favor ingrese un correo electrónico válido');
      return;
    }

    try {
      setLoading(true);
      const data = await loginApi({ correo: correo.trim(), clave });
      
      if (!data.token || !data.usuario) {
        throw new Error('Respuesta inválida del servidor');
      }

      const usuario = data.usuario;
      const session = {
        userId: usuario.id || '',
        nombre: `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim(),
        correo: usuario.correo || correo.trim(),
        token: data.token,
      };
      
      loginUser(session);
      
    } catch (error) {
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.message.includes('incorrecta')) {
        errorMessage = 'Correo o contraseña incorrectos';
      } else if (error.message.includes('red')) {
        errorMessage = 'Error de conexión. Verifique su internet';
      } else {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Registrar nuevo usuario (CON CÉDULA Y MATRÍCULA)
  const onRegister = async () => {
    const { cedula, nombre, apellido, correo, password, confirmPassword, telefono, matricula } = registerData;
    
    // Validaciones obligatorias
    if (!cedula.trim() || !nombre.trim() || !apellido.trim() || !correo.trim() || !password || !confirmPassword || !telefono.trim()) {
      Alert.alert('Error', 'Los campos marcados con * son obligatorios');
      return;
    }

    if (!isValidCedula(cedula)) {
      Alert.alert('Error', 'La cédula debe tener entre 11 y 13 dígitos numéricos');
      return;
    }

    if (!isValidEmail(correo)) {
      Alert.alert('Error', 'Por favor ingrese un correo electrónico válido');
      return;
    }

    if (!isValidPhone(telefono)) {
      Alert.alert('Error', 'El teléfono debe tener 10 dígitos (ej: 8091234567)');
      return;
    }

    if (!isValidMatricula(matricula)) {
      Alert.alert('Error', 'La matrícula debe tener el formato: 2021-0123 (opcional)');
      return;
    }

    if (!isValidPassword(password)) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      
      // Preparar datos
      const userData = {
        cedula: cedula.trim().replace(/[- ]/g, ''),
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        correo: correo.trim(),
        password: password,
        telefono: telefono.trim(),
      };
      
      // Agregar matrícula solo si fue proporcionada
      if (matricula && matricula.trim() !== '') {
        userData.matricula = matricula.trim();
      }
      
      console.log('Registrando usuario:', userData);
      
      const response = await registerApi(userData);
      
      console.log('Respuesta del registro:', response);
      
      Alert.alert(
        '¡Registro exitoso!',
        'Tu cuenta ha sido creada exitosamente. Ya puedes iniciar sesión.',
        [
          {
            text: 'Iniciar sesión',
            onPress: () => {
              setShowRegisterForm(false);
              setRegisterData({
                cedula: '',
                nombre: '',
                apellido: '',
                correo: '',
                password: '',
                confirmPassword: '',
                telefono: '',
                matricula: '',
              });
              
              // Auto-login si la API devuelve token
              if (response.token && response.usuario) {
                const session = {
                  userId: response.usuario.id || '',
                  nombre: `${response.usuario.nombre || ''} ${response.usuario.apellido || ''}`.trim(),
                  correo: response.usuario.correo || correo.trim(),
                  token: response.token,
                };
                loginUser(session);
              }
            },
          },
        ]
      );
      
    } catch (error) {
      console.error('Error en registro:', error);
      let errorMessage = 'Error al registrar usuario';
      
      if (error.message.includes('ya existe') || error.message.includes('existente')) {
        if (error.message.includes('cedula')) {
          errorMessage = 'Esta cédula ya está registrada';
        } else if (error.message.includes('correo')) {
          errorMessage = 'Este correo electrónico ya está registrado';
        } else if (error.message.includes('matricula')) {
          errorMessage = 'Esta matrícula ya está registrada';
        } else {
          errorMessage = 'El usuario ya existe en el sistema';
        }
      } else if (error.message.includes('404')) {
        errorMessage = 'Servicio de registro no disponible temporalmente';
      } else if (error.message.includes('red')) {
        errorMessage = 'Error de conexión. Verifique su internet';
      } else {
        errorMessage = error.message;
      }
      
      Alert.alert('Error en registro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Recuperar contraseña
  const handleRecoverPassword = async () => {
    if (!recoverEmail.trim()) {
      Alert.alert('Error', 'Por favor ingrese su correo electrónico');
      return;
    }

    if (!isValidEmail(recoverEmail)) {
      Alert.alert('Error', 'Por favor ingrese un correo electrónico válido');
      return;
    }

    try {
      setLoading(true);
      await recoverPasswordApi(recoverEmail.trim());
      
      Alert.alert(
        'Recuperación enviada',
        'Se ha enviado un enlace para restablecer tu contraseña a este correo.',
        [
          {
            text: 'Aceptar',
            onPress: () => {
              setShowRecoverForm(false);
              setRecoverEmail('');
            },
          },
        ]
      );
      
    } catch (error) {
      let errorMessage = 'Error al procesar la solicitud';
      
      if (error.message.includes('no encontrado')) {
        errorMessage = 'El correo electrónico no está registrado';
      } else if (error.message.includes('red')) {
        errorMessage = 'Error de conexión. Verifique su internet';
      } else {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Toggle mostrar formularios
  const toggleRecoverForm = () => {
    setShowRecoverForm(!showRecoverForm);
    setRecoverEmail('');
  };

  const toggleRegisterForm = () => {
    setShowRegisterForm(!showRegisterForm);
    setRegisterData({
      cedula: '',
      nombre: '',
      apellido: '',
      correo: '',
      password: '',
      confirmPassword: '',
      telefono: '',
      matricula: '',
    });
  };

  // Actualizar datos de registro
  const handleRegisterChange = (field, value) => {
    setRegisterData({
      ...registerData,
      [field]: value,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Text style={styles.title}>🌿</Text>
          <Text style={styles.title}>Ministerio de Medio Ambiente</Text>
          <Text style={styles.subtitle}>Plataforma de Servicios Ambientales</Text>
        </View>

        {!showRecoverForm ? (
          // Formulario de Login
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Iniciar Sesión</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico *</Text>
              <TextInput
                style={styles.input}
                placeholder="ejemplo@correo.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={correo}
                onChangeText={setCorreo}
                editable={!loading}
                autoComplete="email"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingrese su contraseña"
                secureTextEntry
                value={clave}
                onChangeText={setClave}
                editable={!loading}
                autoComplete="password"
                onSubmitEditing={onLogin}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={onLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={[styles.secondaryButton, styles.registerButton]}
                onPress={toggleRegisterForm}
                disabled={loading}
              >
                <Text style={[styles.secondaryButtonText, { color: '#FFFFFF' }]}>Registrarse</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton]}
                onPress={toggleRecoverForm}
                disabled={loading}
              >
                <Text style={styles.secondaryButtonText}>¿Olvidaste contraseña?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => navigation.navigate('About')}
            >
              <Text style={styles.link}>Acerca de la aplicación</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Formulario de Recuperación
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Recuperar Contraseña</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico registrado *</Text>
              <TextInput
                style={styles.input}
                placeholder="ejemplo@correo.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={recoverEmail}
                onChangeText={setRecoverEmail}
                editable={!loading}
                autoComplete="email"
              />
            </View>

            <Text style={styles.helperText}>
              Te enviaremos un enlace para restablecer tu contraseña a este correo.
            </Text>

            <View style={styles.recoverButtons}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={toggleRecoverForm}
                disabled={loading}
              >
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.recoverButton]}
                onPress={handleRecoverPassword}
                disabled={loading || !recoverEmail.trim()}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Enviar enlace</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Ministerio de Medio Ambiente y Recursos Naturales
          </Text>
          <Text style={styles.footerSubtext}>
            República Dominicana © {new Date().getFullYear()}
          </Text>
        </View>
      </ScrollView>

      {/* Modal para registro con cédula y matrícula */}
      <Modal
        visible={showRegisterForm}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleRegisterForm}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Registro de Usuario</Text>
                <TouchableOpacity onPress={toggleRegisterForm} style={styles.closeButtonContainer}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSubtitle}>
                Campos marcados con * son obligatorios
              </Text>

              {/* Campos del formulario */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cédula *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="00112345678"
                  keyboardType="numeric"
                  value={registerData.cedula}
                  onChangeText={(text) => handleRegisterChange('cedula', text)}
                  editable={!loading}
                  maxLength={13}
                />
                <Text style={styles.helperText}>11-13 dígitos sin espacios</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tu nombre"
                  value={registerData.nombre}
                  onChangeText={(text) => handleRegisterChange('nombre', text)}
                  editable={!loading}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Apellido *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tu apellido"
                  value={registerData.apellido}
                  onChangeText={(text) => handleRegisterChange('apellido', text)}
                  editable={!loading}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Correo electrónico *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ejemplo@correo.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={registerData.correo}
                  onChangeText={(text) => handleRegisterChange('correo', text)}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Teléfono *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="8091234567"
                  keyboardType="phone-pad"
                  value={registerData.telefono}
                  onChangeText={(text) => handleRegisterChange('telefono', text)}
                  editable={!loading}
                  maxLength={10}
                />
                <Text style={styles.helperText}>10 dígitos sin espacios</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Matrícula (opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="2021-0123"
                  value={registerData.matricula}
                  onChangeText={(text) => handleRegisterChange('matricula', text)}
                  editable={!loading}
                />
                <Text style={styles.helperText}>Formato: 2021-0123 (opcional)</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contraseña *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 8 caracteres"
                  secureTextEntry
                  value={registerData.password}
                  onChangeText={(text) => handleRegisterChange('password', text)}
                  editable={!loading}
                />
                <Text style={styles.helperText}>
                  Al menos una mayúscula y un número
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmar Contraseña *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Repite la contraseña"
                  secureTextEntry
                  value={registerData.confirmPassword}
                  onChangeText={(text) => handleRegisterChange('confirmPassword', text)}
                  editable={!loading}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelModalButton]}
                  onPress={toggleRegisterForm}
                  disabled={loading}
                >
                  <Text style={styles.secondaryButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.registerModalButton]}
                  onPress={onRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>Registrarse</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>Información importante:</Text>
                <Text style={styles.infoText}>
                  • La cédula es obligatoria para el registro{"\n"}
                  • La matrícula es opcional para estudiantes{"\n"}
                  • Tus datos serán verificados por el administrador{"\n"}
                  • Recibirás un correo de confirmación
                </Text>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1B5E20',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#388E3C',
    opacity: 0.8,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#333',
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#81C784',
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDD',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 10,
  },
  registerButton: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  recoverButton: {
    backgroundColor: '#FF9800',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  link: {
    color: '#1E88E5',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  recoverButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContainer: {
    margin: 20,
    maxHeight: '90%',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    maxHeight: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    flex: 1,
  },
  closeButtonContainer: {
    padding: 4,
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  cancelModalButton: {
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  registerModalButton: {
    backgroundColor: '#1976D2',
    flex: 1,
  },
  infoBox: {
    backgroundColor: '#F1F8E9',
    borderRadius: 10,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    marginTop: 10,
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
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default LoginScreen;
