const express = require("express");
const mongotoConnect = require("./db"); // MongoDB connection
var cors = require('cors');

mongotoConnect(); // Initialize MongoDB connection
const app = express();
const port = 5100;

app.use(cors());
app.use(express.json()); // Parse JSON request body

// Routes for auth and questions APIs
app.use("/api/auth", require('./routes/auth'));

// Start the Express server
app.listen(port, () => {
  console.log(`Backend app listening at http://localhost:${port}`);
});
