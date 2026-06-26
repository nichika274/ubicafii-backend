const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/espaciosController');

// seed arriba para que no choque con /:id
router.get('/seed', ctrl.seed);

router.get('/', ctrl.getAll);

router.get('/:id', ctrl.getById);

router.post('/', ctrl.create);

router.put('/:id', ctrl.update);

router.delete('/:id', ctrl.delete);

module.exports = router;