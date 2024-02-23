# Toradex Custom Web UI

This repository contains the code for the custom web user interface (UI) of Toradex.

## Prerequisites

Developers host machine has to be either

* Windows (using WSL2 (Ubuntu)) <br/> 
(For a detailed description see: [WSL](https://learn.microsoft.com/de-de/windows/wsl/setup/environment) )
* or Ubuntu 20.x

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
    node -v 
    // has to be minimum v12.22.9  
    sudo apt install npm 
    npm -v
    // has to be minimum 8.5.1
    ```

3. Install the nodejs dependencies
   ```
   npm install & npm update
   ```
   This should install the following packages:
   ```
    npm install express --save  //minimal web framework for routing and static files serving
    npm install nunjucks --save //html templates in jinja style
    npm install axios --save    //http requst with Bearer token to access the torizon API

4. Start the app
    node app.js

5. Open your browser with [http://localhost:3000/](http://localhost:3000/) 