const axios = require('axios');
require('dotenv').config();

//Add your API Bearer token here
var api_bearer_token = process.env.TORIZON_API_TOKEN;
const torizon_api = axios.create({
    baseURL: 'https://app.torizon.io/api/v2beta',
    headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + api_bearer_token
    }
});

/**
 * Makes an Authorization "Bearer" request with the given accessToken to the given endpoint.
 * @param endpoint torizon API endpoint
 * @param method HTTP method
 * @param data data to be sent in the request
 */
const requestTorizonAPI = async (endpoint, data = null, method = 'GET') => {
    switch (method) {
        case 'GET':
            return torizon_api.get(endpoint);
        case 'POST':
            return torizon_api.post(endpoint, JSON.stringify(data));
        case 'DELETE':
            return torizon_api.delete(endpoint + `/${data}`);
        case 'PUT':
            return torizon_api.put(endpoint + `/${data}`);
        default:
            return null;
    }
};

module.exports = {
    requestTorizonAPI,
};
