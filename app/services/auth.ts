import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'user_token';

export const AuthService = {
  async guardarToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  async obtenerToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },

  async eliminarToken(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  async estaLogueado(): Promise<boolean> {
    const token = await this.obtenerToken();
    return token !== null;
  }
};