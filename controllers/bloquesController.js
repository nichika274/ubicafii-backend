const { getDb, saveDb } = require('../database');

exports.getAll = async (req, res) => {
  try {
    const db = await getDb();
    const result = db.exec('SELECT * FROM bloques ORDER BY id ASC');
    const bloques = [];

    if (result.length > 0) {
      const { columns, values } = result[0];
      values.forEach(row => {
        let obj = {};
        columns.forEach((c, i) => { obj[c] = row[i]; });
        bloques.push(obj);
      });
    }
    res.json(bloques);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByBloque = async (req, res) => {
  try {
    const db = await getDb();
    // Corregido a consulta parametrizada para evitar inyección SQL
    const result = db.exec('SELECT * FROM bloques WHERE bloque = ?', [req.params.bloque]);

    if (!result.length) {
      return res.status(404).json({ mensaje: "Bloque no encontrado" });
    }

    const { columns, values } = result[0];
    let bloque = {};
    columns.forEach((c, i) => { bloque[c] = values[0][i]; });

    res.json(bloque);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.seed = async (req, res) => {
  try {
    const db = await getDb();
    db.run("DELETE FROM bloques");

    const bloques = [
      { bloque: 'A', mapaX: 0.12, mapaY: 0.18, mapaWidth: 0.11, mapaHeight: 0.30 },
      { bloque: 'B', mapaX: 0.24, mapaY: 0.18, mapaWidth: 0.11, mapaHeight: 0.30 },
      { bloque: 'C', mapaX: 0.36, mapaY: 0.18, mapaWidth: 0.11, mapaHeight: 0.30 },
      { bloque: 'D', mapaX: 0.62, mapaY: 0.20, mapaWidth: 0.18, mapaHeight: 0.34 },
      { bloque: 'E', mapaX: 0.45, mapaY: 0.55, mapaWidth: 0.12, mapaHeight: 0.25 },
      { bloque: 'F', mapaX: 0.60, mapaY: 0.55, mapaWidth: 0.12, mapaHeight: 0.25 }
    ];

    bloques.forEach(b => {
      db.run(
        `INSERT INTO bloques (bloque, mapaX, mapaY, mapaWidth, mapaHeight) VALUES (?, ?, ?, ?, ?)`,
        [b.bloque, b.mapaX, b.mapaY, b.mapaWidth, b.mapaHeight]
      );
    });

    await saveDb();
    res.json({ mensaje: "Seed de bloques creado", cantidad: bloques.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};