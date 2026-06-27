const { createClient } = require('@libsql/client');

const client = createClient({
  url: 'libsql://ubicafii-nichika274.aws-us-east-1.turso.io',
  authToken: 'TU_TOKEN'
});

async function getDb() {
  // Crear tabla espacios
  await client.execute(`
    CREATE TABLE IF NOT EXISTS espacios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      tipo TEXT NOT NULL,
      piso INTEGER NOT NULL,
      descripcion TEXT,
      fotoUrl TEXT,
      indicaciones TEXT,
      bloque TEXT NOT NULL,
      coordenadaX REAL DEFAULT 0.5,
      coordenadaY REAL DEFAULT 0.3
    )
  `);

  // Crear tabla bloques
  await client.execute(`
    CREATE TABLE IF NOT EXISTS bloques (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bloque TEXT NOT NULL UNIQUE,
      mapaX REAL NOT NULL,
      mapaY REAL NOT NULL,
      mapaWidth REAL NOT NULL,
      mapaHeight REAL NOT NULL
    )
  `);

  // Crear tabla puntos_interes
  await client.execute(`
    CREATE TABLE IF NOT EXISTS puntos_interes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      tipo TEXT NOT NULL,
      mapaX REAL NOT NULL,
      mapaY REAL NOT NULL
    )
  `);

  return client;
}

// En Turso no necesitas saveDb
async function saveDb() {}

module.exports = { getDb, saveDb };