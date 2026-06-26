const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'ubicafii.db');

let db = null;

async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // ==========================
  // TABLA ESPACIOS
  // ==========================
  db.run(`
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

  // ==========================
  // TABLA BLOQUES
  // ==========================
  db.run(`
    CREATE TABLE IF NOT EXISTS bloques (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bloque TEXT NOT NULL UNIQUE,
      mapaX REAL NOT NULL,
      mapaY REAL NOT NULL,
      mapaWidth REAL NOT NULL,
      mapaHeight REAL NOT NULL
    )
  `);

  // =====================================================
  // Compatibilidad con bases creadas anteriormente
  // =====================================================

  try {
    db.run("ALTER TABLE espacios ADD COLUMN descripcion TEXT");
  } catch (e) {}

  try {
    db.run("ALTER TABLE espacios ADD COLUMN fotoUrl TEXT");
  } catch (e) {}

  try {
    db.run("ALTER TABLE espacios ADD COLUMN indicaciones TEXT");
  } catch (e) {}

  try {
    db.run("ALTER TABLE espacios ADD COLUMN bloque TEXT");
  } catch (e) {}

  try {
    db.run("ALTER TABLE espacios ADD COLUMN coordenadaX REAL DEFAULT 0.5");
  } catch (e) {}

  try {
    db.run("ALTER TABLE espacios ADD COLUMN coordenadaY REAL DEFAULT 0.3");
  } catch (e) {}

  return db;
}

async function saveDb() {
  const database = await getDb();
  const data = database.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

module.exports = {
  getDb,
  saveDb
};