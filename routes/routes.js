var express = require("express");
const router = express.Router();
const { requestTorizonAPI } = require('../torizon_api');
const { processDeviceMetrics } = require('../utility/utility');

// async/await error handling give the error to the next middleware of expressjs
const asyncHandler = (fun) => (req, res, next) => {
    Promise.resolve(fun(req, res, next))
        .catch(next)
}

//handle index page request
router.get('/', asyncHandler(async (req, res, next) => {
    // Request all registered devices from the Torizon API
    var devices_response = await requestTorizonAPI("/devices");
    if ("values" in devices_response.data && devices_response.data["values"].length > 0) {
        console.log(devices_response.data);
        // Return the rendered index.html template with all registered devices
        res.render('index.html', devices_response.data);
    }
    else {
        //error handling
        throw new Error("No devices found. Please make sure that you have at least one device registered via Torizon.");
    }
}));

//handle specific device page request
router.get('/device', asyncHandler(async (req, res, next) => {
    const device_id = req.query.device_id;

    var requested_metrics = ["temp", "mem_used"];
    // Adjust the uct linux timestamp time range for your data
    var from_timestamp = 1708689350564;
    var to_timestamp = 1708692650566;
    // Request the data from the Torizon API for the device, the device metrics and the packages
    const [devices_response, device, metrics, packages] = await Promise.all([
        requestTorizonAPI("/devices"),
        requestTorizonAPI("/devices/" + device_id),
        requestTorizonAPI("/device-data/devices/" + device_id + "/metrics?metric=" + requested_metrics.join("&metric=") + "&from=" + from_timestamp + "&to=" + to_timestamp),
        requestTorizonAPI("/packages")]);

    //combine the results into an object
    var api_data = { ...devices_response.data["values"][0], ...device.data };
    api_data["packages"] = packages.data["values"];

    for (const metric of requested_metrics) {
        processDeviceMetrics(metric, metrics, api_data);
    }

    // Return the rendered device.html template with the results of the Torizon API requests
    res.render('device.html', api_data);
}));

module.exports = router;
