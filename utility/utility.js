/**
 * Processes the device metrics and provides the data in the format that the plotly.js chart expects
 * @param item_name name of the metric to be processed
 * @param metrics response from the Torizon metrics API
 * @param api_data object to store the processed data
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

module.exports = {
    processDeviceMetrics,
};