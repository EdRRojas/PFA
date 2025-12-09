import React, { useState, useCallback, useEffect } from "react";
import { 
  Button, 
  View, 
  Alert, 
  StyleSheet, 
  Text,
  ActivityIndicator 
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import PropTypes from 'prop-types';

const YoutubeIframe = ({ 
  youtubeID, 
  height = 300, 
  autoPlay = false,
  showControls = true,
  onVideoEnd = () => {},
  onError = () => {},
  style = {}
}) => {
  const [playing, setPlaying] = useState(autoPlay);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Resetear estado cuando cambia el youtubeID
  useEffect(() => {
    setPlaying(autoPlay);
    setLoading(true);
    setHasError(false);
  }, [youtubeID, autoPlay]);

  const onStateChange = useCallback((state) => {
    switch(state) {
      case "ended":
        setPlaying(false);
        if (onVideoEnd) {
          onVideoEnd();
        } else {
          Alert.alert("Video finalizado", "El video ha terminado de reproducirse");
        }
        break;
      case "playing":
        setLoading(false);
        setHasError(false);
        break;
      case "paused":
        setLoading(false);
        break;
      case "buffering":
        setLoading(true);
        break;
      case "unstarted":
        setLoading(true);
        break;
      default:
        break;
    }
  }, [onVideoEnd]);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  const onPlayerError = useCallback((error) => {
    setHasError(true);
    setLoading(false);
    console.error("Error en reproductor de YouTube:", error);
    
    if (onError) {
      onError();
    } else {
      Alert.alert("Error", "No se pudo cargar el video. Verifica el ID proporcionado.");
    }
  }, [onError]);

  // Validación básica del ID de YouTube
  if (!youtubeID || youtubeID.trim() === "") {
    return (
      <View style={[styles.errorContainer, { height }, style]}>
        <Text style={styles.errorText}>ID de YouTube no proporcionado</Text>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={[styles.errorContainer, { height }, style]}>
        <Text style={styles.errorText}>Error al cargar el video</Text>
        <Button title="Reintentar" onPress={() => setHasError(false)} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }, style]}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF0000" />
          <Text style={styles.loadingText}>Cargando video...</Text>
        </View>
      )}
      
      <YoutubePlayer
        height={height}
        play={playing}
        videoId={youtubeID}
        onChangeState={onStateChange}
        onError={onPlayerError}
        initialPlayerParams={{
          controls: showControls ? 1 : 0,
          preventFullScreen: false,
          modestbranding: true,
        }}
      />
      
      {showControls && (
        <View style={styles.controls}>
          <Button 
            title={playing ? "Pausar" : "Reproducir"} 
            onPress={togglePlaying} 
          />
        </View>
      )}
    </View>
  );
};

// IMPORTANTE: Cambiar de VideoPlayer a YoutubeIframe
// Propiedades del componente
YoutubeIframe.propTypes = {
  youtubeID: PropTypes.string.isRequired,
  height: PropTypes.number,
  autoPlay: PropTypes.bool,
  showControls: PropTypes.bool,
  onVideoEnd: PropTypes.func,
  onError: PropTypes.func,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.number
  ]),
};

// Valores por defecto
YoutubeIframe.defaultProps = {
  height: 300,
  autoPlay: false,
  showControls: true,
  onVideoEnd: () => {},
  onError: () => {},
  style: {},
};

// Estilos
const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  controls: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
    borderWidth: 1,
    borderColor: '#f5c6cb',
    borderRadius: 5,
    padding: 20,
  },
  errorText: {
    color: '#721c24',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default YoutubeIframe;