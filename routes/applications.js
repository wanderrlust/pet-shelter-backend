const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const { authenticateToken } = require("../middleware/auth");
const emailQueue = require("../emailQueue");

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { animalId, message } = req.body;
    const userId = req.user.userId;

    const application = await prisma.adoptionApplication.create({
      data: {
        userId,
        animalId,
        message,
        status: "PENDING",
      },
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });

    await emailQueue.add("send-confirmation-email", {
      email: user.email,
      applicationId: application.id,
      animalId: animalId,
    });

    res.status(201).json({
      message:
        "Application submitted successfully! Confirmation email will be sent shortly.",
      applicationId: application.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

router.get("/my", authenticateToken, async (req, res) => {
  try {
    const applications = await prisma.adoptionApplication.findMany({
      where: { userId: req.user.userId },
      include: { animal: true },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Error fetching applications" });
  }
});

module.exports = router;
