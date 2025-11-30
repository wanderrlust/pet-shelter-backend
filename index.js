require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
const PORT = process.env.PORT || 5000;

const swaggerDocument = YAML.load('./swagger.yaml');

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const animalsRouter = require('./routes/animals');
app.use('/api/animals', animalsRouter);

app.get('/', (req, res) => {
  res.send('Pet Shelter API is running... <a href="/api-docs">Docs</a>');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});