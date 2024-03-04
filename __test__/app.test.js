const supertest = require("supertest");
const app = require("../app");
const { processDeviceMetrics } = require('../utility/utility');

const request = supertest(app);

test("GET / should return status code 200", async () => {
    const response = await request.get("/");
    expect(response.status).toBe(200);
});

test("GET /device without id should return status code 500", async () => {
    const response = await request.get("/device");
    expect(response.status).toBe(500);
});

test("GET /nonexistent should return status code 404", async () => {
    const response = await request.get("/nonexistent");
    expect(response.status).toBe(404);
});

test("processDeviceMetrics should return processed metrics", () => {
    // Mock input data
    var item_name = "temperature";
    const metrics = {
        data: {
            series: [
                { name: "temperature", points: [[1, 25], [2, 30], [3, 28]] },
                { name: "humidity", points: [[1, 60], [2, 65], [3, 62]] },
                { name: "pressure", points: [[1, 1013], [2, 1015], [3, 1012]] }
            ]
        }
    };
    
    const api_data = {};

    // Call the function
    processDeviceMetrics(item_name, metrics, api_data);

    // Assert the expected output
    expect(api_data).toEqual({
        temperature_x: [1, 2, 3],
        temperature_y: [25, 30, 28]
    });

    item_name = "pressure";
    // Call the function
    processDeviceMetrics(item_name, metrics, api_data);

    // Assert the expected output
    expect(api_data).toEqual({
        temperature_x: [1, 2, 3],
        temperature_y: [25, 30, 28],
        pressure_x: [1, 2, 3],
        pressure_y: [1013, 1015, 1012]
    });
});

 