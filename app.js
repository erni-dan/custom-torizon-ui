var nunjucks = require('nunjucks')
var express = require('express');
var app = express();

const { requestTorizonAPI } = require('./torizon_api');

var port = process.env.PORT || 3000;

//add access to the static pictures and media 
app.use('/public', express.static(__dirname + '/public'));

nunjucks.configure('views', {
    autoescape: true,
    cache: false,
    express: app
});

// route to the index page
app.get('/', async function (req, res) {
    var devices_response = await requestTorizonAPI("/devices");
    //console.log(devices_response.data["values"][0]);
    var first_device_data = devices_response.data["values"][0]; //TODO : adjust for specific device, for now just using the first one

    var device_detailed_response = await requestTorizonAPI("/devices/" + first_device_data.deviceUuid);
    var device_detailed_data = device_detailed_response.data;
    //combine the two datasets
    var device_data = { ...first_device_data, ...device_detailed_data };

    // Adjust the time range to your data
    var device_metrics = await requestTorizonAPI("/device-data/devices/" + first_device_data.deviceUuid + "/metrics?from=1708689350564&to=1708692650566");
    // ATTENTION: we have to use the "find" function to get the first series, because the response contains this data multiple times
    var temperature_values = device_metrics.data.series.find(function (item) { return item.name == "temp"; })  // other metrics: "mem_used", "mem_free", "docker_alive", ...
    // ATTENTION: we have to "filter" the series, because the response contains a lot of null values
    temperature_values = temperature_values.points.filter(function (item) { return item[1] !== null; })
    // Provide the data in the format that the chart expects
    const x_values = temperature_values.map((tuple) => tuple[0]);
    const y_values = temperature_values.map((tuple) => tuple[1]);
    // add the temperature data to the device data
    device_data["temp_x"] = x_values;
    device_data["temp_y"] = y_values;

    var packages_response = await requestTorizonAPI("/packages");
    device_data["packages"] = packages_response.data["values"];

    res.render('index.html', device_data);
});


app.listen(port);