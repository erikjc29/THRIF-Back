const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  const connection = req.dbConnection;
  const query = `SELECT * FROM products `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).json({ error: 'Failed to retrieve product from the database' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(results);
  });
});

router.get('/:productId', (req, res) => {
  const connection = req.dbConnection;
  const productId = req.params.productId;
  const query = `SELECT * FROM products WHERE _id = ?`;

  connection.query(query, [productId], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).json({ error: 'Failed to retrieve product from the database' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(results[0]);
  });
});

router.post('/',(req, res) => {
  
  // const file = req.file;

  // if (!file) {
  //   return res
  //     .status(400)
  //     .json({ error: "No se ha seleccionado ningún archivo" });
  // }
  
  
  const connection = req.dbConnection;
  const { name, price, descr, size, category, state, stock, image, userId} = req.body;
  const query = `INSERT INTO products (name, price, descr, size, category, state, stock, image, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`;
  const values = [name, price, descr, size, category, state, stock,image, userId];
  
  // const imageUrl = result.secure_url;
  console.log(req.body)

  console.log("dasdfafskere")
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).json({ error: 'Failed to create product in the database' });
    }
    res.json("The product was created successfully");
  });
}
)

router.put('/:productId', (req, res) => {
  const connection = req.dbConnection;
  const productId = req.params.productId;
  const { name, price, descr, size, category, state, stock, image, userId } = req.body;
  const query = `UPDATE products SET name=?, price=?, descr=?, size=?, category=?, state=?, stock=?, image=?, userId=? WHERE _id=?`;
  const values = [name, price, descr, size, category, state, stock, image, userId, productId];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).json({ error: 'Failed to update product in the database' });
    }

    res.json("The product was updated successfully");
  });
});

router.delete('/:productId', (req, res) => {
  const connection = req.dbConnection;
  const productId = req.params.productId;
  const query = `DELETE FROM products WHERE _id = ?`;

  connection.query(query, [productId], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).json({ error: 'Failed to delete product from the database' });
    }

    res.json("The product was deleted successfully");
  });
});



// router.get('/', (req, res) => {



//   const connection = req.dbConnection;
//   const { name, price, descr, size, category, state, stock, image, userId} = req.body;
//   const query = `INSERT INTO products (name, price, descr, size, category, state, stock, image, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`;
//   const values = [name, price, descr, size, category, state, stock,image, userId];
  
//   // const connection = req.dbConnection;
//   // const query = "SELECT * FROM products";
  
//   connection.query(query, (err, results) => {
//     if (err) {
//       console.error('Error executing MySQL query:', err);
//       return res.status(500).json({ error: 'Failed to retrieve books from the database' });
//     }
//     res.json(results);
//   });
// });

// router.get('/:id', (req, res) => {
//   const bookId = req.params.id;
//   const connection = req.dbConnection;
//   const query = "SELECT * FROM books WHERE id = ?";
//   connection.query(query, [bookId], (err, results) => {
//     if (err) {
//       console.error('Error executing MySQL query:', err);
//       return res.status(500).json({ error: 'Failed to retrieve book from the database' });
//     }
//     if (results.length === 0) {
//       return res.status(404).json({ error: 'Book not found' });
//     }
//     res.json(results[0]);
//   });
// });


// router.put('/:id', (req, res) => {
//   const bookId = req.params.id;
//   const connection = req.dbConnection;
//   const { title, author, rating, publication_year, genre, price, bookCover, quantity } = req.body;
//   const query = `UPDATE books SET title = ?, author = ?, rating = ?, publication_year = ?, genre = ?, price = ?, bookCover = ?, availableQuantity = ? WHERE id = ?`;
//   const values = [title, author, rating, publication_year, genre, price, bookCover, quantity, bookId];

//   connection.query(query, values, (err, results) => {
//     if (err) {
//       console.error('Error executing MySQL query:', err);
//       return res.status(500).json({ error: 'Failed to update book in the database' });
//     }
//     res.json("The book was updated successfully");
//   });
// });

// router.delete('/:id', (req, res) => {
//   const bookId = req.params.id;
//   const connection = req.dbConnection;
//   const query = `DELETE FROM books WHERE id = ?`;

//   connection.query(query, [bookId], (err, results) => {
//     if (err) {
//       console.error('Error executing MySQL query:', err);
//       return res.status(500).json({ error: 'Failed to delete book from the database' });
//     }
//     res.json("The book was deleted successfully");
//   });
// });

module.exports = router;
