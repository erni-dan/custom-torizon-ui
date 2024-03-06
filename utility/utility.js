/**
 * Processes the device metrics and provides the data in the format that the plotly.js chart expects
 * @param {string} item_name name of the metric to be processed
 * @param {object} metrics response from the Torizon metrics API
 * @param {object} api_data object to store the processed data
 */
function processDeviceMetrics(item_name, metrics, api_data) {
    // use "find" to get temp values (and response contains data multiple times, if all metrics are requested)
    var temperature_values = metrics.data.series.find(function (item) { return item.name == item_name; })
    // "filter" the series, because the response contains a lot of null values
    temperature_values = temperature_values.points.filter(function (item) { return item[1] !== null; })
    // Provide the data in the format that the plotly.js chart expects
    api_data[item_name + "_x"] = temperature_values.map((tuple) => tuple[0]);
    api_data[item_name + "_y"] = temperature_values.map((tuple) => tuple[1]);
}


/**
 * Reorders the device packages based on their component names.
 * @param {object} device The device object containing the device packages.
 */
function reorderDevicePackages(device) {
    for (var i = 0; i < device.data.devicePackages.length; i++) {
        if (device.data.devicePackages[i].component.includes("-bootloader")) {
            var boot = device.data.devicePackages[i];
        }
        else if (device.data.devicePackages[i].component.includes("docker-")) {
            var app = device.data.devicePackages[i];
        }
        else {
            var os = device.data.devicePackages[i];
        }
    }
    device.data.devicePackages[0] = app;
    device.data.devicePackages[1] = os;
    device.data.devicePackages[2] = boot;
}


/**
 * Processes the input device data and returns an object containing all data combined.
 *
 * @param {string} device_id - The ID of the device.
 * @param {object} all_devices - The object containing device data for all devices.
 * @param {object} device - The object containing device-specific data.
 * @param {object} metrics - The object containing metric data.
 * @param {object} packages - The object containing package data.
 * @param {object} packages_external - The object containing external package data.
 * @param {Array} requested_metrics - An array of the requested metrics.
 * @returns {object} - The object containing all data combined.
 */
function combineDeviceData(device_id, all_devices, device, metrics, packages, packages_external, requested_metrics) {
    // Order the device components (application, os, bootloader)
    reorderDevicePackages(device);

    // Combine the results into an object
    const device_data = all_devices.data["values"].find(item => item.deviceUuid === device_id);
    const api_data = { ...device_data, ...device.data };
    api_data["packages"] = packages.data["values"];
    const filter = device.data.devicePackages[1].component;
    api_data["packages_external"] = packages_external.data["values"].filter(item => item.name.includes(filter));

    for (const metric of requested_metrics) {
        processDeviceMetrics(metric, metrics, api_data);
    }

    return api_data;
}

module.exports = {
    combineDeviceData
};