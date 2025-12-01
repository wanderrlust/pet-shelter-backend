const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

router.get("/", async (req, res) => {
  try {
    const animals = await prisma.animal.findMany();
    res.json(animals);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/", async (req, res) => {
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

    res.status(201).json(newAnimal);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create animal" });
  }
});

module.exports = router;
