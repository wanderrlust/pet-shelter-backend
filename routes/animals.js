const express = require('express');
const router = express.Router();

// GET /api/animals
router.get('/', (req, res) => {
  res.json([
    { id: 1, name: 'Murzik', species: 'CAT' },
    { id: 2, name: 'Rex', species: 'DOG' }
  ]);
});

module.exports = router;