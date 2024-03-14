# Toradex Custom Web UI

This repository contains code for an example of a custom web user interface (UI) for the [Torizon](https://www.torizon.io/) web API of [Toradex](https://www.toradex.com/).

## Prerequisites

**This project depends on :**

* [nodejs](https://nodejs.org/en)

**Although any enviroment can be used, it is recommended to use the develpment setup**

* [vscode](https://code.visualstudio.com/)
* Ubuntu 20.x, or
* Windows (using WSL2 (Ubuntu 20.x)) <br/>
(For a detailed description see: [WSL](https://learn.microsoft.com/de-de/windows/wsl/setup/environment) )

> [!TIP]  
> If you are facing [internet connection issues under WSL](https://stackoverflow.com/questions/62314789/no-internet-connection-on-wsl-ubuntu-windows-subsystem-for-linux) add "nameserver 8.8.8.8" to your /etc/resolv.conf
> or set "networkingMode=mirrored" to your [wslconfig](https://learn.microsoft.com/en-us/windows/wsl/wsl-config#wslconfig)


**Furthermore**

* minimum one device provisioned for torizon.io
  * [How-To provision a device](https://developer.toradex.com/torizon/torizon-platform/devices-fleet-management#provisioning-a-single-device)
* valid Torizon API token, which can be generated from a valid Torizon API Client
  * [How-To create an API client](https://developer.toradex.com/torizon/torizon-platform/torizon-api/#how-to-use-torizon-cloud-api)
  * [How-To get an API token](https://developer.toradex.com/torizon/torizon-platform/torizon-api/#get-a-token)

## Getting Started

To get started with the Toradex Custom Web UI, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/erni-dan/custom-torizon-ui.git
   ```

2. Install [node](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs) and npm

   ```bash
    sudo apt install nodejs
    node -v  // has to be minimum > 14.x.   
    sudo apt install npm 
    npm -v  // has to be minimum 8.5.1
    ```

3. Install the dependencies via npm

   ```
   npm install & npm update
   ```

   This should install the following packages ([expressjs](https://expressjs.com/en/starter/hello-world.html), [nunjucks](https://mozilla.github.io/nunjucks/getting-started.html), [axios](https://axios-http.com/docs/intro) ), [dotenv](https://github.com/motdotla/dotenv):

   ```
    npm install express --save  // minimal web framework for routing and static files serving
    npm install nunjucks --save // html templates in jinja style
    npm install axios --save    // a promised based http client, supporting requests with Bearer token to access the torizon API
    npm install dotenv --save   // a zero-dependency module that loads environment variables from a .env file
   ```

4. Create a `.env` file in the root directory of your project if it doesn't exist already. Add the following configuration to it:
   ```plaintext
   TORIZON_API_TOKEN=your_token
   ```

> [!IMPORTANT]  
> If your facing a 401 HTTP error. Ensure to have a valid API Bearer token.
> See [How-To get an API token](https://developer.toradex.com/torizon/torizon-platform/torizon-api/#get-a-token)

5. Start the app

    ```
    node run.js
    ```

    or

     ```
    npm run start
    ```
6. Open your browser with [http://localhost:3000/](http://localhost:3000/)


## Directory layout

    .
    ├── __test__           # the tests
    ├── public             # all static resources for the web pages (e.g images, libs, ...) 
    ├── routes             # backend implementation, handle the requests and respond with html pages
    ├── utility            # helper modules
    ├── views              # html templates (the UI without data)
    ├── app.js             # defines the expressjs application, but does not start it
    ├── package.json       # root of every Nodejs project, info about app, modules and packages, defines all npm scripts
    |── README.md          
    ├── run.js             # starts the application 
    ├── torizon_api.js     # encapsuling a request client for the Torizon API


## Customization

You can add your own device images to the "public/img" folder and set the reference to your images via the "addDeviceImage()" function, which can be found in every HTML file.
   ```
   <script>
      function addDeviceImage() {
            var deviceImage = document.getElementById("device_preview");
            var deviceImageSrc = "/public/img/robot_icon.png";  // TODO: replace with your device image
            ...
      }
   </script>
   ```
   
## Development

1. For the tests, you will need a node version > 14.x. 
   Or you will see 
   ```
   run.js:135 unexpected token if (error?.stack)"
   ```
   Install nvm, to update the nodejs version :
   ```
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
    //restart vscode 
    nvm install --lts //to download the latest long time supported nodejs version 
    nvm install node //to install the latest lts nodejs version 
   ```

2. For development run 
   ```
    npm run development //to start with nodemon, to see real time changes 
   ```

3. For tests run 
   ```
    npm test
   ```

3. For code coverage run 
   ```
    npm run coverage
   ```
