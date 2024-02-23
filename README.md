# Toradex Custom Web UI

This repository contains the code for the custom web user interface (UI) of Toradex.

## Prerequisites

Developers host machine has to be either

* Windows (using WSL2 (Ubuntu 20.x)) <br/>
(For a detailed description see: [WSL](https://learn.microsoft.com/de-de/windows/wsl/setup/environment) )
* or Ubuntu 20.x

Furthermore

* minimum one device provisioned for torizon.io [How-To provision a device](https://developer.toradex.com/torizon/torizon-platform/devices-fleet-management#provisioning-a-single-device)
* and a valid Torizon API token, which can be generated from a valid Torizon API Client [How-To create an API client](https://developer.toradex.com/torizon/torizon-platform/torizon-api/#how-to-use-torizon-cloud-api) [How-To get an API token](https://developer.toradex.com/torizon/torizon-platform/torizon-api/#get-a-token)

> [!IMPORTANT]  
> Copy your API Bearer token into the variable "api_bearer_token" in file "torizon_api.js"


Everything was setup up with [visualstudiocode](https://code.visualstudio.com/docs)

## Getting Started

To get started with the Toradex Custom Web UI, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/erni-dan/custom-torizon-ui.git
   ```

2. Install [node](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs) and npm

   ```bash
    sudo apt install nodejs
    node -v  // has to be minimum v12.22.9  
    sudo apt install npm 
    npm -v  // has to be minimum 8.5.1
    ```

3. Install the dependencies via npm

   ```
   npm install & npm update
   ```

   This should install the following packages:

   ```
    npm install express --save  //minimal web framework for routing and static files serving
    npm install nunjucks --save //html templates in jinja style
    npm install axios --save    //http requst with Bearer token to access the torizon API

4. Start the app

5. Start the app
    ```
    node app.js
    ```

6. Open your browser with [http://localhost:3000/](http://localhost:3000/)
