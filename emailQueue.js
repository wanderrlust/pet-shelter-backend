const { Queue, Worker } = require("bullmq");

const connection = {
  host: "127.0.0.1",
  port: 6379,
};

const emailQueue = new Queue("email-queue", { connection });

const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    console.log(`[Worker] Почав обробку задачі для: ${job.data.email}`);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log(
      `[Worker] Email успішно відправив на ${job.data.email}! (Заявку №${job.data.applicationId})`
    );
  },
  { connection }
);

emailWorker.on("failed", (job, err) => {
  console.error(`[Worker] Помилка задачі ${job.id}: ${err.message}`);
});

module.exports = emailQueue;
