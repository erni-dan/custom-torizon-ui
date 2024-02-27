var nunjucks = require('nunjucks')
var express = require('express');
var app = express();

const { requestTorizonAPI } = require('./torizon_api');

var port = process.env.PORT || 3000;

//add access to the static pictures and media 
app.use('/public', express.static(__dirname + '/public'));

// Set up the template engine and define the html templates directory
nunjucks.configure('views', {
    autoescape: true,
    cache: false,
    express: app
});

// Needed for the async/await error handling
// The returned handler catches any exceptions thrown by the input handler and 
// calls the next express function with the thrown error
const asyncHandler = (fun) => (req, res, next) => {
    Promise.resolve(fun(req, res, next))
      .catch(next)
  }

//route to the index page
app.get('/', asyncHandler(async (req, res) => 
{
    // Request all registered devices from the Torizon API
    var devices_response = await requestTorizonAPI("/devices");
    if ("values" in devices_response.data && devices_response.data["values"].length > 0) 
    {
        console.log(devices_response.data);
        // Return the rendered index.html template with all registered devices
        res.render('index.html', devices_response.data);
    }
    else
    {
        //error handling
        throw new Error("No devices found. Please make sure that you have at least one device registered via Torizon.");
    }
}));

// route to the device page
app.get('/device', asyncHandler(async (req, res) => 
{
    const device_id = req.query.device_id;

    // Adjust the uct linux timestamp time range for your data
    var from_timestamp = 1708689350564;
    var to_timestamp = 1708692650566;
    var requested_metrics = ["temp", "mem_used"];
    // Request the data from the Torizon API for the device, the device metrics and the packages
    const [devices_response, device, metrics, packages] = await Promise.all([
        requestTorizonAPI("/devices"),
        requestTorizonAPI("/devices/" + device_id), 
        requestTorizonAPI("/device-data/devices/" + device_id + "/metrics?metric=" + requested_metrics.join("&metric=") + "&from=" + from_timestamp + "&to=" + to_timestamp ),
        requestTorizonAPI("/packages")]);

    //combine the results into one object
    var api_data = { ...devices_response.data["values"][0], ...device.data };
    // add the package information
    api_data["packages"] = packages.data["values"];

    // use "find" to get temp values (and response contains data multiple times, if all metrics are requested)
    var temperature_values = metrics.data.series.find(function (item) { return item.name == "temp"; })
    // "filter" the series, because the response contains a lot of null values
    temperature_values = temperature_values.points.filter(function (item) { return item[1] !== null; })
    // Provide the data in the format that the plotly.js chart expects
    api_data["temp_x"] = temperature_values.map((tuple) => tuple[0]);
    api_data["temp_y"] = temperature_values.map((tuple) => tuple[1]);

    // use "find" to get mem_used values
    var mem_used_values = metrics.data.series.find(function (item) { return item.name == "mem_used"; })
    // "filter" the series, because the response contains a lot of null values
    mem_used_values = mem_used_values.points.filter(function (item) { return item[1] !== null; })
    // Provide the data in the format that the plotly.js chart expects
    api_data["mem_x"] = mem_used_values.map((tuple) => tuple[0]);
    api_data["mem_y"] = mem_used_values.map((tuple) => tuple[1]);

    // Return the rendered device.html template with data
    res.render('device.html', api_data);
}));


app.listen(port);