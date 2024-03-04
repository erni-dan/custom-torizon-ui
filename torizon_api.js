const axios = require('axios');

//Add your API Bearer token here
var api_bearer_token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzYUowczhvMjY4WTdRSzA5R0dmOXJLLVNhS3RMTWNLMkhYcGlqN2pWSm5ZIn0.eyJleHAiOjE3MDk4OTAxMDUsImlhdCI6MTcwOTI4NTMwNSwianRpIjoiMzg5M2MyNzgtN2VlYi00ODNhLWJhZmEtMGZjNzNkYjAzZDg2IiwiaXNzIjoiaHR0cHM6Ly9rYy50b3Jpem9uLmlvL2F1dGgvcmVhbG1zL290YS11c2VycyIsInN1YiI6ImVmYTllM2Q0LWRiYzYtNGY4Zi04MDdkLTBkN2YzMTU5M2Y5OCIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFwaS12Ml8yNTI5NTkzM184MDZhZDNkOS0zY2Y5LTRlODAtOGM1Ni01N2FkNzM2NzNkMGYiLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbInRoaXJkLXBhcnR5LWFwaS1hcGktdjIiXX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiY2xpZW50SG9zdCI6IjQ2LjE0MC40Mi4xOTAiLCJuYW1lc3BhY2UiOiI4MDZhZDNkOS0zY2Y5LTRlODAtOGM1Ni01N2FkNzM2NzNkMGYiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtYXBpLXYyXzI1Mjk1OTMzXzgwNmFkM2Q5LTNjZjktNGU4MC04YzU2LTU3YWQ3MzY3M2QwZiIsImNsaWVudEFkZHJlc3MiOiI0Ni4xNDAuNDIuMTkwIiwiY2xpZW50X2lkIjoiYXBpLXYyXzI1Mjk1OTMzXzgwNmFkM2Q5LTNjZjktNGU4MC04YzU2LTU3YWQ3MzY3M2QwZiJ9.ixgIZBSqMHt294OveegXOzg35xk9PSUT65yhFI0Cy51j0fCO7BRUY-ryuG5IayTNpkJ1kNPenr-KRvY2b5M_95Y0UNiUR9F_TfTIm0bw-6PyYC-PFP60AcbrL9w_lpzeX8ScAcd-4fHFNh4a6LBdc_8P8G7U9_utkFGC5GYZ4mxZLE2QEWz1g4QmXHX880lBUmz0B3r3fNYbGycj7-9qbB7QGl241Ljpq2WrmXrY1aW6G0bdHioqqnrpZUmB5fxvpt1eagQ809VkyuorVEJStXLkS-ZdgQbT6xLMwu5ehw6iOSxGTx7qv149Iv1OMbgVW1dCkVaB1myXRSt2mfcOdQ";
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
            return torizon_api.post(endpoint, data);
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
