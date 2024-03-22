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

    // convert UNIX timestamp to human readable time in 24 hours mode
    api_data[item_name + "_x"] = api_data[item_name + "_x"].map((unix_timestamp) => new Date(unix_timestamp).toISOString());
}


/**
 * Reorders the device packages based on their component names.
 * @param {object} device The device object containing the device packages.
 */
function reorderDevicePackages(device) {
    let boot, app, os;
    const { data: { devicePackages } } = device;
    // Loop through device packages to reorder them
    devicePackages.forEach(pkg => {
        if (pkg.component.includes("-bootloader")) {
            boot = pkg;
        } else if (pkg.component.includes("docker-")) {
            app = pkg;
        } else {
            os = pkg;
        }
    });
    devicePackages[0] = app;
    devicePackages[1] = os;
    devicePackages[2] = boot;
}


/**
 * Processes the input device data and returns an object containing all data combined.
 *
 * @param {object} device - The object containing device-specific data.
 * @param {object} metrics - The object containing metric data.
 * @param {object} packages - The object containing package data.
 * @param {object} packages_external - The object containing external package data.
 * @param {Array} requested_metrics - An array of the requested metrics.
 * @returns {object} - The object containing all data combined.
 */
function combineDeviceData(device, metrics, packages, packages_external, requested_metrics) {
    // Order the device components (application, os, bootloader)
    reorderDevicePackages(device);

    // Combine the results into one object
    const api_data = device.data;

    //returns the componentID/hardwareID of the OS packages, which is used to filter the external packages for OS packages
    const os_filter = device.data.devicePackages[1].component;
    api_data["os_packages_external"] =
        packages_external.data["values"].filter(item => { return item.name.includes(os_filter) && !item.name.includes("bootloader") });
    api_data["bootloader_packages_external"] =
        packages_external.data["values"].filter(item => { return item.name.includes("bootloader") && item.name.includes(os_filter) });
    api_data["packages"] = packages.data["values"];

    for (const metric of requested_metrics) {
        processDeviceMetrics(metric, metrics, api_data);
    }

    return api_data;
}

module.exports = {
    combineDeviceData
};