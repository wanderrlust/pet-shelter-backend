const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const { authenticateToken, isAdmin } = require("../middleware/auth");
const redisClient = require("../redisClient");

const DEFAULT_EXPIRATION = 3600;

router.get("/", async (req, res) => {
  try {
    const cachedData = await redisClient.get("animals");
    if (cachedData) {
      console.log("Serving from Cache:");
      return res.json(JSON.parse(cachedData));
    }

    console.log("Serving from Database:");
    const animals = await prisma.animal.findMany();

    await redisClient.setEx('animals', DEFAULT_EXPIRATION, JSON.stringify(animals));

    res.json(animals);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, species, breed, age, description } = req.body;

    const newAnimal = await prisma.animal.create({
      data: {
        name,
        species,
        breed,
        age,
        description,
        status: "AVAILABLE",
      },
    });
    
    await redisClient.del('animals');

    res.status(201).json(newAnimal);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create animal" });
  }
});

module.exports = router;
