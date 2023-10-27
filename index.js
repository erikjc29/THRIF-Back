const express = require('express');
const app = express();
const createConnection = require('./db');
const bodyParser = require('body-parser');
const uploadImage = require('./helper/imageHelper');
const cors = require('cors');


app.use(bodyParser.urlencoded({
  extended: true
}));

// Create the database connection
const connection = createConnection();
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.dbConnection = connection;
  req.uploadImageToS3 = uploadImage;
  next();
});


app.use(express.json());

// Import the routes
const ProductsRouter = require('./routes/products');
const imagesRouter = require('./routes/images');
const usersRouter = require('./routes/users');
const loansRouter = require('./routes/loans');

// Register routes
app.use('/products',ProductsRouter);
app.use('/images', imagesRouter);
app.use('/users', usersRouter);
app.use('/loans', loansRouter);

// Start the server
app.listen(3000,"0.0.0.0", () => {
  console.log('Server listening on port 3000');
});
