import { Link } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5, MaterialIcons, Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <FontAwesome5 name="leaf" size={50} color="#fff" />
        </View>
        <Text style={styles.title}>Ministerio de Medio Ambiente</Text>
        <Text style={styles.subtitle}>República Dominicana</Text>
      </View>

      {/* Módulos */}
      <View style={styles.modulesContainer}>
        <Link href="/videos" asChild>
          <TouchableOpacity style={styles.moduleCard}>
            <View style={[styles.iconContainer, { backgroundColor: "#4CAF50" }]}>
              <FontAwesome5 name="video" size={30} color="#fff" />
            </View>
            <Text style={styles.moduleTitle}>Videos Educativos</Text>
            <Text style={styles.moduleDescription}>
              Aprende sobre reciclaje, conservación y cambio climático
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/areas-protegidas" asChild>
          <TouchableOpacity style={styles.moduleCard}>
            <View style={[styles.iconContainer, { backgroundColor: "#388E3C" }]}>
              <FontAwesome5 name="tree" size={30} color="#fff" />
            </View>
            <Text style={styles.moduleTitle}>Áreas Protegidas</Text>
            <Text style={styles.moduleDescription}>
              Conoce nuestros parques nacionales y reservas
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/equipo" asChild>
          <TouchableOpacity style={styles.moduleCard}>
            <View style={[styles.iconContainer, { backgroundColor: "#2E7D32" }]}>
              <Ionicons name="people" size={30} color="#fff" />
            </View>
            <Text style={styles.moduleTitle}>Equipo del Ministerio</Text>
            <Text style={styles.moduleDescription}>
              Conoce a nuestro equipo de trabajo
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/voluntariado" asChild>
          <TouchableOpacity style={styles.moduleCard}>
            <View style={[styles.iconContainer, { backgroundColor: "#1B5E20" }]}>
              <MaterialIcons name="volunteer-activism" size={30} color="#fff" />
            </View>
            <Text style={styles.moduleTitle}>Voluntariado</Text>
            <Text style={styles.moduleDescription}>
              Únete como voluntario ambiental
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2024 Ministerio de Medio Ambiente - RD
        </Text>
        <Text style={styles.footerSubtext}>
          Protegiendo nuestro patrimonio natural
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: '#2E7D32',
    padding: 30,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  modulesContainer: {
    padding: 20,
  },
  moduleCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: "center",
  },
  moduleDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: "#666",
  },
  footerSubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
});