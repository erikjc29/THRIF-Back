const express = require('express');
const router = express.Router();

router.post('/create', (req, res) => {
  try {
    const { idBook, idUser, dueDate, price, loanDate, quantity } = req.body;
    const connection = req.dbConnection;

    // Check available quantity of the book
    const queryCheckQuantity = `SELECT availableQuantity FROM books WHERE id = ${idBook}`;

    connection.query(queryCheckQuantity, (err, rows) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).json({ error: 'Failed to retrieve available quantity from the database' });
      }

      let availableQuantity = rows.length > 0 ? parseInt(rows[0].availableQuantity) : 0;

      if (isNaN(availableQuantity)) {
        availableQuantity = 0;
      }

      if (quantity > availableQuantity) {
        // Insufficient quantity
        return res.status(400).json({ message: 'Insufficient quantity available' });
      }

      // Insert the loan
      const queryCreateLoan = `INSERT INTO loans (userId, bookId, dueDate, price, loanDate, returnDate, surcharge, quantity) VALUES (?, ?, ?, ?, ?, null, null, ?)`;
      connection.query(queryCreateLoan, [idUser, idBook, dueDate, price, loanDate, quantity], (err, result) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          return res.status(500).json({ error: 'Failed to create loan in the database' });
        }

        console.log('Inserted a new loan into the database');

        const loan = {
          id: result.insertId,
          userId: idUser,
          bookId: idBook,
          dueDate: dueDate,
          price: price,
          loanDate: loanDate,
          returnDate: null,
          surcharge: null,
          quantity: quantity
        };

        // Update the quantity
        const updatedQuantity = availableQuantity - quantity;
        const queryUpdateQuantity = `UPDATE books SET availableQuantity = ? WHERE id = ?`;
        connection.query(queryUpdateQuantity, [updatedQuantity, idBook], (err) => {
          if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ error: 'Failed to update quantity in the database' });
          }

          console.log('Updated the quantity in the books table');

          res.status(200).json(loan);
        });
      });
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get('/getUserLoans/:idUser', (req, res) => {
  try {
    const connection = req.dbConnection;
    const userId = req.params.idUser;
    const query = `SELECT * FROM loans WHERE userId = ?`;

    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).json({ error: 'Failed to retrieve user loans from the database' });
      }

      res.status(200).json(results);
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get('/getLoan/:loanId', (req, res) => {
  try {
    const connection = req.dbConnection;
    const loanId = req.params.loanId;
    const query = `SELECT * FROM loans WHERE loanId = ?`;

    connection.query(query, [loanId], (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).json({ error: 'Failed to retrieve loan from the database' });
      }

      res.status(200).json(results);
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
