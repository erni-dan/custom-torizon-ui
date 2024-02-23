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
    devices_response = await requestTorizonAPI("/devices");
    console.log(devices_response.data["values"][0]);
    var device_data_tmp = devices_response.data["values"][0]; //TODO : adjust for specific device, for now just using the first one
    
    device_detailed_response = await requestTorizonAPI("/devices/"+ device_data_tmp.deviceUuid);
    console.log(device_detailed_response.data);
    var device_detailed_data = device_detailed_response.data;

    var device_data = {...device_data_tmp, ...device_detailed_data};
    res.render('index.html', device_data);
});

app.get('/api', function (req, res) {
    res.json({ test1: 'test', test2: '2' });
});

app.listen(port);