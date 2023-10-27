const mysql = require('mysql');

function createConnection() {
  const connection = mysql.createConnection({
    host: 'thriftdb.ca5l8w9fpqlk.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'admin123',
    database: 'thrift',
    port: 3306
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database!');
  });

  return connection;
}

module.exports = createConnection;
