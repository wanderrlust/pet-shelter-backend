const request = require("supertest");
const app = require("../index");
const prisma = require("../prisma");

describe("Pet Shelter API Tests", () => {
  let token = "";
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = "root";

  it("POST /api/auth/register - має створити нового користувача", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: testEmail,
      password: testPassword,
      firstName: "Test",
      lastName: "User",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("userId");
  });

  it("POST /api/auth/login - має повернути токен", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");

    token = res.body.token;
  });

  it("POST /api/animals - має заборонити доступ без токена", async () => {
    const res = await request(app).post("/api/animals").send({
      name: "Ghost Cat",
      species: "CAT",
    });

    expect(res.statusCode).toEqual(401);
  });

  it("POST /api/animals - має заборонити доступ НЕ адміну", async () => {
    const res = await request(app)
      .post("/api/animals")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Cat",
        species: "CAT",
        breed: "Test Breed",
        age: 2,
      });

    expect(res.statusCode).toEqual(403);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
