const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDb, saveDb } = require('./database'); // ◄ Importación actualizada para sql.js

const app = express();
const PORT = process.env.PORT || 3001;

// Asegurar que la carpeta 'uploads' exista para evitar errores al subir archivos
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.use(cors());
app.use(express.json()); // Permite procesar JSON en las peticiones

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configurar almacenamiento de imágenes con Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + path.basename(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

// Helper para formatear dinámicamente la URL de las fotos según el host actual de Render/Local
const formatFotoUrl = (fotoUrl, req) => {
  if (!fotoUrl) return '';
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  if (fotoUrl.startsWith('http')) {
    return fotoUrl.replace(/^https?:\/\/[^\/]+/, baseUrl);
  }
  return `${baseUrl}${fotoUrl}`;
};

// --- RUTAS API (ADAPTADAS A SQL.JS ASÍNCRONO) ---

// GET todos los espacios (con filtros)
app.get('/api/espacios', async (req, res) => {
  const { piso, tipo, q } = req.query;

  try {
    const db = await getDb();
    let query = 'SELECT * FROM espacios WHERE 1=1';
    const params = {};

    if (piso) {
      query += ' AND piso = :piso';
      params[':piso'] = parseInt(piso);
    }
    if (tipo) {
      query += ' AND tipo = :tipo';
      params[':tipo'] = tipo;
    }
    if (q) {
      query += ' AND nombre LIKE :q';
      params[':q'] = `%${q}%`;
    }

    const stmt = db.prepare(query);
    stmt.bind(params);

    const espacios = [];
    while (stmt.step()) {
      espacios.push(stmt.getAsObject());
    }
    stmt.free();

    const result = espacios.map(e => ({
      ...e,
      fotoUrl: formatFotoUrl(e.fotoUrl, req)
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET espacio por ID
app.get('/api/espacios/:id', async (req, res) => {
  try {
    const db = await getDb();
    const stmt = db.prepare('SELECT * FROM espacios WHERE id = :id');
    stmt.bind({ ':id': req.params.id });

    let espacio = null;
    if (stmt.step()) {
      espacio = stmt.getAsObject();
    }
    stmt.free();

    if (espacio && espacio.id) {
      espacio.fotoUrl = formatFotoUrl(espacio.fotoUrl, req);
      res.json(espacio);
    } else {
      res.status(404).json({ mensaje: 'Espacio no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST crear espacio
app.post('/api/espacios', async (req, res) => {
  const { nombre, tipo, piso, descripcion, fotoUrl, indicaciones, bloque, coordenadaX, coordenadaY } = req.body;

  try {
    const db = await getDb();
    const stmt = db.prepare(`
      INSERT INTO espacios (nombre, tipo, piso, descripcion, fotoUrl, indicaciones, bloque, coordenadaX, coordenadaY)
      VALUES (:nombre, :tipo, :piso, :descripcion, :fotoUrl, :indicaciones, :bloque, :coordenadaX, :coordenadaY)
    `);

    stmt.run({
      ':nombre': nombre,
      ':tipo': tipo,
      ':piso': parseInt(piso),
      ':descripcion': descripcion || '',
      ':fotoUrl': fotoUrl || '',
      ':indicaciones': indicaciones || '',
      ':bloque': bloque,
      ':coordenadaX': coordenadaX || 0.5,
      ':coordenadaY': coordenadaY || 0.5
    });
    stmt.free();

    // Guardar cambios en el almacenamiento persistente
    await saveDb();

    // Obtener el último ID insertado usando la función last_insert_rowid() de SQLite
    const idStmt = db.prepare('SELECT * FROM espacios WHERE id = last_insert_rowid()');
    let nuevo = null;
    if (idStmt.step()) {
      nuevo = idStmt.getAsObject();
    }
    idStmt.free();

    if (nuevo) {
      nuevo.fotoUrl = formatFotoUrl(nuevo.fotoUrl, req);
    }

    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT actualizar espacio
app.put('/api/espacios/:id', async (req, res) => {
  const { nombre, tipo, piso, descripcion, fotoUrl, indicaciones, bloque, coordenadaX, coordenadaY } = req.body;

  try {
    const db = await getDb();
    const stmt = db.prepare(`
      UPDATE espacios
      SET nombre = :nombre, tipo = :tipo, piso = :piso, descripcion = :descripcion,
          fotoUrl = :fotoUrl, indicaciones = :indicaciones, bloque = :bloque,
          coordenadaX = :coordenadaX, coordenadaY = :coordenadaY
      WHERE id = :id
    `);

    stmt.run({
      ':nombre': nombre,
      ':tipo': tipo,
      ':piso': parseInt(piso),
      ':descripcion': descripcion,
      ':fotoUrl': fotoUrl,
      ':indicaciones': indicaciones,
      ':bloque': bloque,
      ':coordenadaX': coordenadaX,
      ':coordenadaY': coordenadaY,
      ':id': req.params.id
    });
    stmt.free();

    // Guardar cambios en el almacenamiento persistente
    await saveDb();

    // Buscar el elemento actualizado para responder
    const checkStmt = db.prepare('SELECT * FROM espacios WHERE id = :id');
    checkStmt.bind({ ':id': req.params.id });
    let actualizado = null;
    if (checkStmt.step()) {
      actualizado = checkStmt.getAsObject();
    }
    checkStmt.free();

    if (actualizado && actualizado.id) {
      actualizado.fotoUrl = formatFotoUrl(actualizado.fotoUrl, req);
      res.json(actualizado);
    } else {
      res.status(404).json({ mensaje: 'Espacio no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE eliminar espacio
app.delete('/api/espacios/:id', async (req, res) => {
  try {
    const db = await getDb();

    // Verificamos primero si existe para poder simular las filas afectadas
    const checkStmt = db.prepare('SELECT id FROM espacios WHERE id = :id');
    checkStmt.bind({ ':id': req.params.id });
    const existe = checkStmt.step();
    checkStmt.free();

    if (!existe) {
      return res.status(404).json({ mensaje: 'Espacio no encontrado' });
    }

    const stmt = db.prepare('DELETE FROM espacios WHERE id = :id');
    stmt.run({ ':id': req.params.id });
    stmt.free();

    // Guardar cambios en el almacenamiento persistente
    await saveDb();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST subir imagen de forma independiente y devolver la URL pública
app.post('/api/upload', upload.single('foto'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha adjuntado ningún archivo.' });
  }

  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend corriendo en el puerto: ${PORT}`);
});