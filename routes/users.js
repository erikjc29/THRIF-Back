const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  const connection = req.dbConnection;
  const { idUser, email } = req.body;

  const query = `INSERT INTO users (idUser, email) VALUES ('${idUser}', '${email}')`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Failed to create user' });
      return;
    }
    res.status(200).json("User created");
  });
});

router.get("/:id", (req, res) => {
  const connection = req.dbConnection;
  const id = req.params.id;
  const query = `SELECT idUser, email, dni, name, phone, role FROM users WHERE idUser = ${id}`;
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Failed to retrieve user' });
      return;
    }
    res.status(200).json(results);
  });
});

module.exports = router;
