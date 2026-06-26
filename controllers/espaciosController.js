const { getDb, saveDb } = require('../database');

// Función interna para mapear filas y columnas de sql.js de forma compacta
const parseRows = (result) => {
  if (!result || result.length === 0) return [];
  const { columns, values } = result[0];
  return values.map(row => Object.fromEntries(columns.map((col, i) => [col, row[i]])));
};

// GET /api/espacios
exports.getAll = async (req, res) => {
  try {
    const db = await getDb();
    const result = db.exec('SELECT * FROM espacios ORDER BY id ASC');
    res.json(parseRows(result));
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo espacios" });
  }
};

// GET /api/espacios/:id
exports.getById = async (req, res) => {
  try {
    const db = await getDb();
    const result = db.exec('SELECT * FROM espacios WHERE id = ?', [req.params.id]);
    const espacios = parseRows(result);
    if (espacios.length === 0) return res.status(404).json({ error: "Espacio no encontrado" });
    res.json(espacios[0]);
  } catch (error) {
    res.status(500).json({ error: "Error buscando espacio" });
  }
};

// POST /api/espacios
exports.create = async (req, res) => {
  try {
    const db = await getDb();
    const { nombre, tipo, piso, descripcion, fotoUrl, indicaciones, bloque, coordenadaX, coordenadaY } = req.body;

    db.run(
      `INSERT INTO espacios (nombre, tipo, piso, descripcion, fotoUrl, indicaciones, bloque, coordenadaX, coordenadaY)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, tipo, piso, descripcion || "", fotoUrl || "", indicaciones || "", bloque, coordenadaX || 0, coordenadaY || 0]
    );
    await saveDb();
    res.json({ mensaje: "Espacio creado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error creando espacio" });
  }
};

// PUT /api/espacios/:id
exports.update = async (req, res) => {
  try {
    const db = await getDb();
    const { nombre, tipo, piso, descripcion, fotoUrl, indicaciones, bloque, coordenadaX, coordenadaY } = req.body;

    db.run(
      `UPDATE espacios SET nombre=?, tipo=?, piso=?, descripcion=?, fotoUrl=?, indicaciones=?, bloque=?, coordenadaX=?, coordenadaY=? WHERE id=?`,
      [nombre, tipo, piso, descripcion, fotoUrl, indicaciones, bloque, coordenadaX, coordenadaY, req.params.id]
    );
    await saveDb();
    res.json({ mensaje: "Espacio actualizado" });
  } catch (error) {
    res.status(500).json({ error: "Error actualizando espacio" });
  }
};

// DELETE /api/espacios/:id
exports.delete = async (req, res) => {
  try {
    const db = await getDb();
    db.run('DELETE FROM espacios WHERE id = ?', [req.params.id]);
    await saveDb();
    res.json({ mensaje: "Espacio eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error espacio" });
  }
};

// GET /api/espacios/seed
exports.seed = async (req, res) => {
  console.log("ENTRO AL SEED NUEVO");
  try {
    const db = await getDb();

    // Limpiar tabla antes de insertar
    db.run("DELETE FROM espacios");

    const espacios = [
      // ─── Planta baja (piso 0) ─────────────────────────────
      // Bloque A
      { nombre: 'Administración de edificio facu', tipo: 'Oficina', piso: 0, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Dirección de carrera', tipo: 'Oficina', piso: 0, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Departamento de talentos humanos', tipo: 'Oficina', piso: 0, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Sala de docentes', tipo: 'Oficina', piso: 0, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Área de investigación', tipo: 'Oficina', piso: 0, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Decanato', tipo: 'Oficina', piso: 0, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Sub decanato', tipo: 'Oficina', piso: 0, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Secretaría', tipo: 'Oficina', piso: 0, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      // Bloque B
      { nombre: 'Sala de conferencias', tipo: 'Oficina', piso: 0, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Laboratorio física 1 (14b-001)', tipo: 'Laboratorio', piso: 0, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Baños Bloque B (Planta baja)', tipo: 'Baño', piso: 0, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Laboratorio física 2 (14b-001)', tipo: 'Laboratorio', piso: 0, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      // Bloque C
      {
        nombre: 'Aula 14C-004',
        tipo: 'Aula',
        piso: 0,
        bloque: 'C',
        descripcion: 'Aula de clases ubicada en el Bloque C, Planta Baja, hacia el lado izquierdo. Tiene una capacidad estimada para 40 estudiantes y está equipada con proyector, pizarrón y aire acondicionado.',
        fotoUrl: 'https://ubicafii-backend.onrender.com/uploads/1781311234-foto.jpg',
        indicaciones: 'Al ingresar al Bloque C, en la planta baja, dirígete hacia la izquierda.',
        coordenadaX: 0.88,
        coordenadaY: 0.12
      },
      { nombre: 'Aula 14C-007', tipo: 'Aula', piso: 0, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      {
        nombre: 'Aula 14C-006',
        tipo: 'Aula',
        piso: 0,
        bloque: 'C',
        descripcion: 'Aula de clases ubicada en el Bloque C, Planta Baja. Cuenta con proyector, pizarrón y aire acondicionado.',
        fotoUrl: 'https://ubicafii-backend.onrender.com/uploads/1781567902958-foto.jpg',
        indicaciones: 'Al ingresar al Bloque C, dirígete hacia la izquierda.',
        coordenadaX: 0.76,
        coordenadaY: 0.16
      },
      { nombre: 'Aula 14C-005', tipo: 'Aula', piso: 0, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      {
        nombre: 'Baños Bloque C (Planta baja)',
        tipo: 'Baño',
        piso: 0,
        bloque: 'C',
        descripcion: 'Servicio higiénico ubicado al fondo del pasillo principal del Bloque C.',
        fotoUrl: 'https://ubicafii-backend.onrender.com/uploads/1781643504558-foto.jpg',
        indicaciones: 'Fondo del pasillo central.',
        coordenadaX: 0.90,
        coordenadaY: 0.50
      },
      { nombre: 'Aula 14C-003', tipo: 'Aula', piso: 0, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Fueiss', tipo: 'Oficina', piso: 0, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      // Bloque D
      { nombre: 'Aula 14D-001', tipo: 'Aula', piso: 0, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14D-002', tipo: 'Aula', piso: 0, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14D-003', tipo: 'Aula', piso: 0, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14D-004', tipo: 'Aula', piso: 0, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14D-005', tipo: 'Aula', piso: 0, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14D-006', tipo: 'Aula', piso: 0, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14D-007', tipo: 'Aula', piso: 0, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14D-008', tipo: 'Aula', piso: 0, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },

      // ─── Primer piso (piso 1) ─────────────────────────────
      // Bloque A
      { nombre: 'Baños Bloque A (Piso 1)', tipo: 'Baño', piso: 1, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Laboratorio de cómputo 14A-101', tipo: 'Laboratorio', piso: 1, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Instituto de posgrado e investigación educación continua', tipo: 'Oficina', piso: 1, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      // Bloque B
      { nombre: 'Aula 14B-101', tipo: 'Aula', piso: 1, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Laboratorio de cómputo 14B-101', tipo: 'Laboratorio', piso: 1, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Formación académica', tipo: 'Oficina', piso: 1, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14B-102', tipo: 'Aula', piso: 1, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14B-103', tipo: 'Aula', piso: 1, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      // Bloque C
      { nombre: 'Aula 14C-101', tipo: 'Aula', piso: 1, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14C-102', tipo: 'Aula', piso: 1, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Laboratorio de cómputo 14C-101', tipo: 'Laboratorio', piso: 1, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Laboratorio de cómputo 14C-102', tipo: 'Laboratorio', piso: 1, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Baños Bloque C (Piso 1)', tipo: 'Baño', piso: 1, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Secretaría', tipo: 'Oficina', piso: 1, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14C-103', tipo: 'Aula', piso: 1, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Vinculación con la sociedad y bienestar estudiantil', tipo: 'Oficina', piso: 1, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Sala de profesores', tipo: 'Oficina', piso: 1, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Departamento técnico', tipo: 'Oficina', piso: 1, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      // Bloque D
      { nombre: 'Aula 14D-101', tipo: 'Aula', piso: 1, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14D-102', tipo: 'Aula', piso: 1, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14D-103', tipo: 'Aula', piso: 1, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14D-104', tipo: 'Aula', piso: 1, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14D-105', tipo: 'Aula', piso: 1, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14D-106', tipo: 'Aula', piso: 1, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14D-107', tipo: 'Aula', piso: 1, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14D-108', tipo: 'Aula', piso: 1, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },

      // ─── Segundo piso (piso 2) ─────────────────────────────
      // Bloque A
      { nombre: 'Sala de docentes (Piso 2)', tipo: 'Oficina', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14A-203', tipo: 'Aula', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14A-204', tipo: 'Aula', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14A-205', tipo: 'Aula', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14A-206', tipo: 'Aula', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Sala de reuniones y tutorías de telemática', tipo: 'Oficina', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Baños Bloque A (Piso 2)', tipo: 'Baño', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Laboratorio de cómputo 14A-201', tipo: 'Laboratorio', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14A-201', tipo: 'Aula', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Dirección de carrera de telemática', tipo: 'Oficina', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Laboratorio de cómputo 14A-202', tipo: 'Laboratorio', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14A-202', tipo: 'Aula', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      // Bloque B
      { nombre: 'Laboratorio de cómputo 14B-201', tipo: 'Laboratorio', piso: 2, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14B-202', tipo: 'Aula', piso: 2, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Laboratorio de vinci de proyecto', tipo: 'Laboratorio', piso: 2, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14B-201', tipo: 'Aula', piso: 2, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Laboratorio de cómputo 14B-202', tipo: 'Laboratorio', piso: 2, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      // Bloque C
      { nombre: 'Aula 14C-201', tipo: 'Aula', piso: 2, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14C-202', tipo: 'Aula', piso: 2, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Laboratorio de cómputo 14C-201', tipo: 'Laboratorio', piso: 2, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Laboratorio de cómputo 14C-202', tipo: 'Laboratorio', piso: 2, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Baños Bloque C (Piso 2)', tipo: 'Baño', piso: 2, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14C-205', tipo: 'Aula', piso: 2, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Aula 14C-206', tipo: 'Aula', piso: 2, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Laboratorio de cómputo 14C-203', tipo: 'Laboratorio', piso: 2, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { nombre: 'Laboratorio de cómputo 14C-204', tipo: 'Laboratorio', piso: 2, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' }
    ];

    espacios.forEach(e => {
      db.run(
        `INSERT INTO espacios
        (nombre, tipo, piso, descripcion, fotoUrl, indicaciones, bloque, coordenadaX, coordenadaY)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          e.nombre,
          e.tipo,
          e.piso,
          e.descripcion || "",
          e.fotoUrl || "",
          e.indicaciones || "",
          e.bloque,
          e.coordenadaX || 0.5,
          e.coordenadaY || 0.3
        ]
      );
    });

    await saveDb();
    res.json({ mensaje: "Seed de espacios creado", cantidad: espacios.length });
  } catch (error) {
    console.error("ERROR SEED ESPACIOS:", error);
    res.status(500).json({
      error: "Error ejecutando seed",
      detalle: error.message
    });
  }
};