const { getDb, saveDb } = require('../database');

// =====================================
// Obtener todos los bloques
// GET /api/bloques
// =====================================
exports.getAll = async (req, res) => {
  try {
    const db = await getDb();
    const result = db.exec(`
      SELECT *
      FROM bloques
      ORDER BY id ASC
    `);

    const bloques = [];

    if (result.length > 0) {
      const columnas = result[0].columns;
      const filas = result[0].values;

      filas.forEach(row => {
        let bloque = {};
        columnas.forEach((col, index) => {
          bloque[col] = row[index];
        });
        bloques.push(bloque);
      });
    }

    res.json(bloques);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error obteniendo bloques"
    });
  }
};

exports.getByBloque = async (req, res) => {
  try {
    const db = await getDb();
    const result = db.exec(`
      SELECT *
      FROM bloques
      WHERE bloque=?
    `, [req.params.bloque]);

    if (result.length === 0) {
      return res.status(404).json({
        mensaje: "Bloque no encontrado"
      });
    }

    const columnas = result[0].columns;
    const fila = result[0].values[0];
    let bloque = {};

    columnas.forEach((col, index) => {
      bloque[col] = fila[index];
    });

    res.json(bloque);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error buscando bloque"
    });
  }
};

// =====================================
// Seed de bloques
// GET /api/bloques/seed
// =====================================
exports.seed = async (req, res) => {
  try {
    const db = await getDb();
    db.run(`DELETE FROM bloques`);

    const bloques = [
      { bloque: "A", mapaX: 0.12, mapaY: 0.18, mapaWidth: 0.11, mapaHeight: 0.30 },
      { bloque: "B", mapaX: 0.24, mapaY: 0.18, mapaWidth: 0.11, mapaHeight: 0.30 },
      { bloque: "C", mapaX: 0.36, mapaY: 0.18, mapaWidth: 0.11, mapaHeight: 0.30 },
      { bloque: "D", mapaX: 0.62, mapaY: 0.20, mapaWidth: 0.18, mapaHeight: 0.34 },
      { bloque: "E", mapaX: 0.45, mapaY: 0.55, mapaWidth: 0.12, mapaHeight: 0.25 },
      { bloque: "F", mapaX: 0.60, mapaY: 0.55, mapaWidth: 0.12, mapaHeight: 0.25 }
    ];

    bloques.forEach(b => {
      db.run(`
        INSERT INTO bloques (bloque, mapaX, mapaY, mapaWidth, mapaHeight)
        VALUES (?, ?, ?, ?, ?)
      `, [b.bloque, b.mapaX, b.mapaY, b.mapaWidth, b.mapaHeight]);
    });

    await saveDb();

    res.json({
      mensaje: "Seed de bloques creado",
      cantidad: bloques.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error creando bloques"
    });
  }
};