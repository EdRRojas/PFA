// src/screens/AboutScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

const developers = [
  {
    nombre: 'Steven Cruz, Carlos Valerio, Loreanny Valeria, Edinson Roja, Thomas',
    telefono: '829-667-0530',
    telegram: 'https://t.me/colerTrash',
    foto: null, // ejemplo: require('../../assets/tu_foto.jpg')
  },
];

const AboutScreen = () => {
  const handleCall = telefono => {
    Linking.openURL(`tel:${telefono}`);
  };

  const openTelegram = url => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Acerca del equipo de desarrollo</Text>
      <Text style={styles.subtitle}>Proyecto Final – Apps ITLA 3-2025</Text>

      {developers.map((dev, index) => (
        <View key={index} style={styles.card}>
          {dev.foto && (
            <Image source={dev.foto} style={styles.avatar} resizeMode="cover" />
          )}
          <Text style={styles.name}>{dev.nombre}</Text>

          <TouchableOpacity onPress={() => handleCall(dev.telefono)}>
            <Text style={[styles.text, styles.link]}>
              Teléfono: {dev.telefono} (tocar para llamar)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openTelegram(dev.telegram)}>
            <Text style={[styles.text, styles.link]}>Telegram: abrir chat</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.footer}>
        Esta aplicación utiliza la API del Ministerio de Medio Ambiente RD para
        promover la conciencia y la participación ciudadana.
      </Text>
    </ScrollView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#388E3C',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#424242',
    textAlign: 'center',
  },
  link: {
    color: '#1E88E5',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
  footer: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
    color: '#616161',
  },
});