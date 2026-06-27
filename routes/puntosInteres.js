const router = require('express').Router();
const ctrl = require('../controllers/puntosInteresController');

router.get('/', ctrl.getAll);
router.post('/seed', ctrl.seed); // temporal

module.exports = router;