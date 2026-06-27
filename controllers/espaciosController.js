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

    console.log("RESET TABLA ESPACIOS");
    db.run("DROP TABLE IF EXISTS espacios");
    db.run(`
      CREATE TABLE espacios (
        id INTEGER PRIMARY KEY,
        nombre TEXT,
        tipo TEXT,
        piso INTEGER,
        descripcion TEXT,
        fotoUrl TEXT,
        indicaciones TEXT,
        bloque TEXT,
        coordenadaX REAL,
        coordenadaY REAL
      )
    `);

    const espacios = [
      // ─── Planta baja (piso 0) ─────────────────────────────
      { id: 1, nombre: 'Administración de edificio facu', tipo: 'Oficina', piso: 0, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 2, nombre: 'Dirección de carrera', tipo: 'Oficina', piso: 0, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 3, nombre: 'Departamento de talentos humanos', tipo: 'Oficina', piso: 0, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 4, nombre: 'Sala de docentes', tipo: 'Oficina', piso: 0, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 5, nombre: 'Área de investigación', tipo: 'Oficina', piso: 0, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 6, nombre: 'Decanato', tipo: 'Oficina', piso: 0, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 7, nombre: 'Sub decanato', tipo: 'Oficina', piso: 0, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 8, nombre: 'Secretaría', tipo: 'Oficina', piso: 0, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },

      { id: 9, nombre: 'Sala de conferencias', tipo: 'Oficina', piso: 0, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 10, nombre: 'Laboratorio física 1 (14b-001)', tipo: 'Laboratorio', piso: 0, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 11, nombre: 'Baños Bloque B (Planta baja)', tipo: 'Baño', piso: 0, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 12, nombre: 'Laboratorio física 2 (14b-001)', tipo: 'Laboratorio', piso: 0, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },

      {
        id: 13,
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
      {
        id: 14,
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
      { id: 15, nombre: 'Aula 14C-005', tipo: 'Aula', piso: 0, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      {
        id: 16,
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
      { id: 17, nombre: 'Aula 14C-003', tipo: 'Aula', piso: 0, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 18, nombre: 'Fueiss', tipo: 'Oficina', piso: 0, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },

      { id: 19, nombre: 'Aula 14D-001', tipo: 'Aula', piso: 0, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 20, nombre: 'Aula 14D-002', tipo: 'Aula', piso: 0, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 21, nombre: 'Aula 14D-003', tipo: 'Aula', piso: 0, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 22, nombre: 'Aula 14D-004', tipo: 'Aula', piso: 0, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 23, nombre: 'Aula 14D-005', tipo: 'Aula', piso: 0, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 24, nombre: 'Aula 14D-006', tipo: 'Aula', piso: 0, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 25, nombre: 'Aula 14D-007', tipo: 'Aula', piso: 0, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 26, nombre: 'Aula 14D-008', tipo: 'Aula', piso: 0, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },

      // ─── Primer piso (piso 1) ─────────────────────────────
      { id: 27, nombre: 'Baños Bloque A (Piso 1)', tipo: 'Baño', piso: 1, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 28, nombre: 'Laboratorio de cómputo 14A-101', tipo: 'Laboratorio', piso: 1, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 29, nombre: 'Instituto de posgrado e investigación educación continua', tipo: 'Oficina', piso: 1, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },

      { id: 30, nombre: 'Aula 14B-101', tipo: 'Aula', piso: 1, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 31, nombre: 'Laboratorio de cómputo 14B-101', tipo: 'Laboratorio', piso: 1, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 32, nombre: 'Formación académica', tipo: 'Oficina', piso: 1, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 33, nombre: 'Aula 14B-102', tipo: 'Aula', piso: 1, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 34, nombre: 'Aula 14B-103', tipo: 'Aula', piso: 1, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },

      { id: 35, nombre: 'Aula 14C-101', tipo: 'Aula', piso: 1, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 36, nombre: 'Aula 14C-102', nombre: 'Aula 14C-102', tipo: 'Aula', piso: 1, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 37, nombre: 'Laboratorio de cómputo 14C-101', tipo: 'Laboratorio', piso: 1, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 38, nombre: 'Laboratorio de cómputo 14C-102', tipo: 'Laboratorio', piso: 1, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 39, nombre: 'Baños Bloque C (Piso 1)', tipo: 'Baño', piso: 1, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 40, nombre: 'Secretaría', tipo: 'Oficina', piso: 1, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 41, nombre: 'Aula 14C-103', tipo: 'Aula', piso: 1, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 42, nombre: 'Vinculación con la sociedad y bienestar estudiantil', tipo: 'Oficina', piso: 1, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 43, nombre: 'Sala de profesores', tipo: 'Oficina', piso: 1, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 44, nombre: 'Departamento técnico', tipo: 'Oficina', piso: 1, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },

      { id: 45, nombre: 'Aula 14D-101', tipo: 'Aula', piso: 1, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 46, nombre: 'Aula 14D-102', tipo: 'Aula', piso: 1, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 47, nombre: 'Aula 14D-103', tipo: 'Aula', piso: 1, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 48, nombre: 'Aula 14D-104', tipo: 'Aula', piso: 1, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 49, nombre: 'Aula 14D-105', tipo: 'Aula', piso: 1, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 50, nombre: 'Aula 14D-106', tipo: 'Aula', piso: 1, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 51, nombre: 'Aula 14D-107', tipo: 'Aula', piso: 1, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 52, nombre: 'Aula 14D-108', tipo: 'Aula', piso: 1, bloque: 'D', descripcion: '', fotoUrl: '', indicaciones: '' },

      // ─── Segundo piso (piso 2) ─────────────────────────────
      { id: 53, nombre: 'Sala de docentes (Piso 2)', tipo: 'Oficina', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 54, nombre: 'Aula 14A-203', tipo: 'Aula', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 55, nombre: 'Aula 14A-204', tipo: 'Aula', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 56, nombre: 'Aula 14A-205', tipo: 'Aula', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 57, nombre: 'Aula 14A-206', tipo: 'Aula', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 58, nombre: 'Sala de reuniones y tutorías de telemática', tipo: 'Oficina', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 59, nombre: 'Baños Bloque A (Piso 2)', tipo: 'Baño', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 60, nombre: 'Laboratorio de cómputo 14A-201', tipo: 'Laboratorio', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 61, nombre: 'Aula 14A-201', tipo: 'Aula', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 62, nombre: 'Dirección de carrera de telemática', tipo: 'Oficina', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 63, nombre: 'Laboratorio de cómputo 14A-202', tipo: 'Laboratorio', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 64, nombre: 'Aula 14A-202', tipo: 'Aula', piso: 2, bloque: 'A', descripcion: '', fotoUrl: '', indicaciones: '' },

      { id: 65, nombre: 'Laboratorio de cómputo 14B-201', tipo: 'Laboratorio', piso: 2, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 66, nombre: 'Aula 14B-202', tipo: 'Aula', piso: 2, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 67, nombre: 'Laboratorio de vinci de proyecto', tipo: 'Laboratorio', piso: 2, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 68, nombre: 'Aula 14B-201', tipo: 'Aula', piso: 2, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 69, nombre: 'Laboratorio de cómputo 14B-202', tipo: 'Laboratorio', piso: 2, bloque: 'B', descripcion: '', fotoUrl: '', indicaciones: '' },

      { id: 70, nombre: 'Aula 14C-201', tipo: 'Aula', piso: 2, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 71, nombre: 'Aula 14C-202', tipo: 'Aula', piso: 2, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 72, nombre: 'Laboratorio de cómputo 14C-201', tipo: 'Laboratorio', piso: 2, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 73, nombre: 'Laboratorio de cómputo 14C-202', tipo: 'Laboratorio', piso: 2, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 74, nombre: 'Baños Bloque C (Piso 2)', tipo: 'Baño', piso: 2, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 75, nombre: 'Aula 14C-205', tipo: 'Aula', piso: 2, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 76, nombre: 'Aula 14C-206', tipo: 'Aula', piso: 2, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 77, nombre: 'Laboratorio de cómputo 14C-203', tipo: 'Laboratorio', piso: 2, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' },
      { id: 78, nombre: 'Laboratorio de cómputo 14C-204', tipo: 'Laboratorio', piso: 2, bloque: 'C', descripcion: '', fotoUrl: '', indicaciones: '' }
    ];

    espacios.forEach(e => {
      db.run(
        `INSERT INTO espacios
        (id, nombre, tipo, piso, descripcion, fotoUrl, indicaciones, bloque, coordenadaX, coordenadaY)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          e.id,
          e.nombre,
          e.tipo,
          e.piso,
          e.descripcion || "",
          e.fotoUrl || "",
          e.indicaciones || "",
          e.bloque,
          e.coordenadaX ?? 0.5,
          e.coordenadaY ?? 0.3
        ]
      );
    });

    await saveDb();
    res.json({ mensaje: "Seed de espacios creado con IDs estáticos", cantidad: espacios.length });
  } catch (error) {
    console.error("ERROR SEED ESPACIOS:", error);
    res.status(500).json({
      error: "Error ejecutando seed",
      detalle: error.message
    });
  }
};

// POST /api/espacios/restaurar-fotos
exports.restaurarFotos = async (req,res)=>{
 try {

 const db = await getDb();

 const fotos = [
   {
    id:13,
    fotoUrl:"https://ubicafii-backend.onrender.com/uploads/1781311234-foto.jpg"
   },
   {
    id:14,
    fotoUrl:"https://ubicafii-backend.onrender.com/uploads/1781567902958-foto.jpg"
   },
   {
    id:15,
    fotoUrl:"https://ubicafii-backend.onrender.com/uploads/1781576332531-foto.jpg"
   },
   {
    id:16,
    fotoUrl:"https://ubicafii-backend.onrender.com/uploads/1781643504558-foto.jpg"
   },
   {
    id:17,
    fotoUrl:"https://ubicafii-backend.onrender.com/uploads/1781643628736-foto.jpg"
   },
   {
    id:18,
    fotoUrl:"https://ubicafii-backend.onrender.com/uploads/1781643780641-foto.jpg"
   },
   {
    id:35,
    fotoUrl:"https://ubicafii-backend.onrender.com/uploads/1781644096002-foto.jpg"
   },
   {
    id:36,
    fotoUrl:"https://ubicafii-backend.onrender.com/uploads/1781644330887-foto.jpg"
   }
 ];

 fotos.forEach(f=>{
   db.run(
    `UPDATE espacios SET fotoUrl=? WHERE id=?`,
    [
      f.fotoUrl,
      f.id
    ]
   );
 });


 await saveDb();

 res.json({
   mensaje:"Fotos restauradas",
   cantidad:fotos.length
 });


 }catch(e){
   console.log(e);
   res.status(500).json({
     error:e.message
   });
 }
}