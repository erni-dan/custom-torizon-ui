const axios = require('axios');

//Add your API Bearer Key here
var api_bearer_key = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzYUowczhvMjY4WTdRSzA5R0dmOXJLLVNhS3RMTWNLMkhYcGlqN2pWSm5ZIn0.eyJleHAiOjE3MDkyMjc4NDAsImlhdCI6MTcwODYyMzA0MCwianRpIjoiZWQ1YTIxNTItMjk2MS00MTA1LWE2NGItZmU4MjAyYzFkZDVkIiwiaXNzIjoiaHR0cHM6Ly9rYy50b3Jpem9uLmlvL2F1dGgvcmVhbG1zL290YS11c2VycyIsInN1YiI6ImVmYTllM2Q0LWRiYzYtNGY4Zi04MDdkLTBkN2YzMTU5M2Y5OCIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFwaS12Ml8yNTI5NTkzM184MDZhZDNkOS0zY2Y5LTRlODAtOGM1Ni01N2FkNzM2NzNkMGYiLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbInRoaXJkLXBhcnR5LWFwaS1hcGktdjIiXX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiY2xpZW50SG9zdCI6IjQ2LjE0MC40Mi4xOTAiLCJuYW1lc3BhY2UiOiI4MDZhZDNkOS0zY2Y5LTRlODAtOGM1Ni01N2FkNzM2NzNkMGYiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtYXBpLXYyXzI1Mjk1OTMzXzgwNmFkM2Q5LTNjZjktNGU4MC04YzU2LTU3YWQ3MzY3M2QwZiIsImNsaWVudEFkZHJlc3MiOiI0Ni4xNDAuNDIuMTkwIiwiY2xpZW50X2lkIjoiYXBpLXYyXzI1Mjk1OTMzXzgwNmFkM2Q5LTNjZjktNGU4MC04YzU2LTU3YWQ3MzY3M2QwZiJ9.ZVhVkqcs9QyZcn35JgOtWt2TtIAOMJM6d_k_HAOnlKMEmOuLPdOVcww2SB4D9qKNQ7rV5HVlvX1j1ywoPNKZ00Cwhzpe0IudXz_TJZQcyGrcUss3eK1dTrXmR1QOUbUGAKOXiHJPT3wDawPhaFtSxfD-4avGBhsAUjuH4flCvXwpE7fnR3gzZ_CFN8dRDe05flWASh5M8rofSRJlB_bg6nT1l-YM5a5kMb2fFPCa_mbPs43EJ7DUF-xxk-XqdHtIpSmhGYyR1_fBaV307LvQMy1UD2XekIRel59YLahWCN8Qq--AeWtiHVVV8F73ZmkJQ2GNgg68lMXa_pGbbuhxSA";
const torizon_api = axios.create({
    baseURL: 'https://app.torizon.io/api/v2beta',
    headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + api_bearer_key
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
            return await torizon_api.get(endpoint);
        case 'POST':
            return await torizon_api.post(endpoint, data);
        case 'DELETE':
            return await torizon_api.delete(endpoint + `/${data}`);
        case 'PUT':
            return await torizon_api.put(endpoint + `/${data}`);
        default:
            return null;
    }
};

module.exports = {
    requestTorizonAPI,
};
