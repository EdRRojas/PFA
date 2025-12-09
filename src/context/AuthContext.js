// src/context/AuthContext.js
import React, { createContext, useEffect, useState } from 'react';
import { initDb, getSession, saveSession, clearSession } from '../db/database';

export const AuthContext = createContext({
  user: null,
  loading: true,
  loginUser: () => {},
  logoutUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Primero inicializar la base de datos
        await initDb();
        
        // Luego obtener la sesión
        const session = await getSession();
        
        if (session) {
          setUser(session);
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const loginUser = async (session) => {
    try {
      await saveSession(session);
      setUser(session);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const logoutUser = async () => {
    try {
      await clearSession();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};