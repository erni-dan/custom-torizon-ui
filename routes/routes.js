var express = require("express");
const router = express.Router();
const { requestTorizonAPI } = require('../torizon_api');
const utility = require('../utility/utility');


// async/await error handling, give the error to the next middleware of expressjs
const asyncHandler = (fun) => (req, res, next) => {
    Promise.resolve(fun(req, res, next))
        .catch(next)
}

//handle index page request
router.get('/', asyncHandler(async (req, res, next) => {
    // Request for all registered devices from the Torizon API
    var devices_response = await requestTorizonAPI("/devices");
    if ("values" in devices_response.data && devices_response.data["values"].length > 0) {
        console.log(devices_response.data);
        // Return the rendered index.html template with all registered devices
        res.render('index.html', devices_response.data);
    }
    else {
        throw new Error("No devices found. Please make sure that you have at least one device registered via Torizon.");
    }
}));

//handle specific device page request
router.get('/device', asyncHandler(async (req, res, next) => {
    const device_id = req.query.device_id;

    // Request the data for device and packages from the Torizon API 
    const [device, packages, packages_external] = await Promise.all([
        requestTorizonAPI("/devices/" + device_id),                 // request specific device
        requestTorizonAPI("/packages?idContains=docker-compose"),   // request user-added packages, but only for application (=docker-compose)
        requestTorizonAPI("/packages_external")]);                  // request packages from other sources, such as images published by Toradex.

    // Request the last 60 minutes of the device meterics
    var from = Date.parse(device.data["lastSeen"]) - 3600000;
    var to = Date.parse(device.data["lastSeen"]);
    var requested_metrics = ["temp", "mem_used"];
    var metrics =
        await requestTorizonAPI("/device-data/devices/" + device_id + "/metrics?metric=" + requested_metrics.join("&metric=") + "&from=" + from + "&to=" + to);

    // transform the data to a format that the template engine needs
    const api_data = utility.combineDeviceData(device, metrics, packages, packages_external, requested_metrics);

    // Return device.html template including the results of the API requests
    res.render('device.html', api_data);
}));

//handle update request
router.get('/update', asyncHandler(async (req, res, next) => {
    const device_id = req.query.device_id;
    const package_id = req.query.package_id;
    data = { "packageIds": [package_id], "devices": [device_id] }
    try {
        var update_response = await requestTorizonAPI("/updates", data, 'POST');
        return res.status(update_response.status).send({ "data": update_response.data });
    }
    catch (error) {
        var noteffected = error.response.data.notAffected[0];
        var err_msg = Object.values(noteffected.ecuErrors)[0];
        return res.status(error.response.status).send({ "error": error.message, "error_details": "Device " + noteffected.name + " failed to update. " + err_msg.code});
    }
}));

module.exports = router;