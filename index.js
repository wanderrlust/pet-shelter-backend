require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const authRouter = require("./routes/auth");
const animalsRouter = require("./routes/animals");

const app = express();
const PORT = process.env.PORT || 5000;

const swaggerDocument = YAML.load("./swagger.yaml");

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/auth", authRouter);
app.use("/api/animals", animalsRouter);

app.get("/", (req, res) => {
  res.send('Pet Shelter API is running... <a href="/api-docs">Docs</a>');
});

module.exports = app;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
