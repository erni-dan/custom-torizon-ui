const supertest = require("supertest");
const app = require("../app");
const { combineDeviceData } = require('../utility/utility');

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


test("test combine device specific data to api_data", () => {
    // Mock device data
    const device = {
        data: {
            devicePackages: [
                { component: "verdin-bootloader" },
                { component: "docker-component" }, 
                { component: "verdin-imx8" } 
            ],
            lastSeen: "2020-01-01T00:00:00.000Z"
        }
    };

    // Mock the current time to be 6 minutes later than lastSeen (device => Not connected)
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01T00:06:00.000Z'));

    var requested_metrics = ["temperature", "pressure"];
    // Mock metrics data
    const metrics = {
        data: {
            series: [
                { name: "temperature", points: [[1, 25], [2, 30], [3, 28]] },
                { name: "humidity", points: [[1, 60], [2, 65], [3, 62]] },
                { name: "pressure", points: [[1, 1013], [2, 1015], [3, 1012]] }
            ]
        }
    };

    // Mock one application package
    const packages = { data: { values: [{"name": "test.yml", "version": "1.0.0"}] } };
    // Mock one bootloader package and one OS package and one package without application and bootloader
    const packages_external = { data: { values: [{"name": "bootloader/verdin-imx8mp/u-boot-ota.bin"}, {"name": "dunfell/verdin-imx8/torizon-rt/monthly"}, {"name": "no-app-and-no-boot-loader"}] } };

    // Combine the mocks into one object
    const api_data = combineDeviceData(device, metrics, packages, packages_external, requested_metrics);

    // Check if the packages are reordered correctly (1. application, 2. OS, 3. bootloader)
    expect(api_data.devicePackages[0].component).toBe("docker-component");
    expect(api_data.devicePackages[1].component).toBe("verdin-imx8");
    expect(api_data.devicePackages[2].component).toBe("verdin-bootloader");

    // Check the filtered packages
    expect(api_data.os_packages_external).toEqual([{"name": "dunfell/verdin-imx8/torizon-rt/monthly"}]);
    expect(api_data.bootloader_packages_external).toEqual([{"name": "bootloader/verdin-imx8mp/u-boot-ota.bin"}]);
    expect(api_data.packages).toEqual([{"name": "test.yml", "version": "1.0.0"}]);

    // Check the metrics data
    expect(api_data.temperature_x).toEqual([1, 2, 3]);
    expect(api_data.temperature_y).toEqual([25, 30, 28]);
    expect(api_data.pressure_x).toEqual([1, 2, 3]);
    expect(api_data.pressure_y).toEqual([1013, 1015, 1012]);

    // Check if isConnected is set to false
    expect(api_data.isConnected).toBe(false);

    // Restore the original Date
    jest.useRealTimers()
});
