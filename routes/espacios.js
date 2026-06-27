const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/espaciosController');

router.get('/seed', ctrl.seed);

router.get('/', ctrl.getAll);

router.post('/restaurar-fotos', espaciosController.restaurarFotos);

router.get('/:id', ctrl.getById);

router.post('/', ctrl.create);

router.put('/:id', ctrl.update);

router.delete('/:id', ctrl.delete);


module.exports = router;