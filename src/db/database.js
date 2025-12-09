// src/db/database.js
import * as SQLite from 'expo-sqlite';

let db = null;

const getDb = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('medioambiente.db');
  }
  return db;
};

// Crear tabla de sesión
export const initDb = async () => {
  try {
    const db = await getDb();
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS session (
        id INTEGER PRIMARY KEY NOT NULL,
        userId TEXT,
        nombre TEXT,
        correo TEXT,
        token TEXT
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Guardar sesión
export const saveSession = async (session) => {
  try {
    const db = await getDb();
    await db.execAsync('DELETE FROM session;');
    await db.runAsync(
      'INSERT INTO session (id, userId, nombre, correo, token) VALUES (?, ?, ?, ?, ?)',
      1,
      session.userId,
      session.nombre,
      session.correo,
      session.token
    );
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

// Obtener sesión (devuelve objeto o null)
export const getSession = async () => {
  try {
    const db = await getDb();
    const row = await db.getFirstAsync(
      'SELECT * FROM session WHERE id = ?',
      1
    );
    
    if (!row) return null;

    return {
      userId: row.userId,
      nombre: row.nombre,
      correo: row.correo,
      token: row.token,
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

// Borrar sesión
export const clearSession = async () => {
  try {
    const db = await getDb();
    await db.execAsync('DELETE FROM session;');
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};