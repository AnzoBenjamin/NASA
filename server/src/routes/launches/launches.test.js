const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");
describe("Testing the Launches API", () => {
  beforeAll(async()=>{
    await mongoConnect()
  })
  afterAll(async()=>{
    await mongoDisconnect()
  })
  describe("Test GET/ launches", () => {
    test("It should respond with status 200", async () => {
      const response = await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST/ launches", () => {
    const completeLaunchData = {
      mission: "To the future",
      rocket: "Apollo 20",
      launchDate: "Jan 1, 2028",
      target: "Mars",
    };

    const launchDataWithoutDate = {
      mission: "To the future",
      rocket: "Apollo 20",
      target: "Mars",
    };

    const launchDataWithInvalidDate = {
      mission: "To the future",
      rocket: "Apollo 20",
      launchDate: "Seek",
      target: "Mars",
    };
    test("It should respond with status 201", async () => {
      const response = await request(app)
        .post("/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });

    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({ error: "Invalid launch date" });
    });
  });
});
