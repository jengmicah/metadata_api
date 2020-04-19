import * as http from 'http';
import express = require('express');
import {applyMiddleware} from './utils';
import middleware from './middleware';
import path = require('path');

// OpenAPI Schema
import fs = require('fs');
import jsyaml = require('js-yaml');
import fileUpload = require('express-fileupload');

let oasTools = require('oas-tools');

process.on('uncaughtException', e => {
    console.log(e);
    process.exit(1);
});
process.on('unhandledRejection', e => {
    console.log(e);
    process.exit(1);
});

<<<<<<< HEAD
// // OAS Setup: https://github.com/isa-group/oas-tools
// let swaggerDocPath = path.join(__dirname, 'oasDoc.yaml');
// let spec = fs.readFileSync(swaggerDocPath, 'utf8');
// let oasDoc = jsyaml.safeLoad(spec);
// var options_object = {
//     checkControllers: false
// };
=======
// OAS Setup: https://github.com/isa-group/oas-tools
let swaggerDocPath = path.join(__dirname, 'oasDoc.yaml');
let spec = fs.readFileSync(swaggerDocPath, 'utf8');
let oasDoc = jsyaml.safeLoad(spec);
var options_object = {
    controllers: `${__dirname}/routes`,
    checkControllers: true,
    strict: false,
    loglevel: 'warning',
    docs: {
        apiDocs: '/api-docs',
        apiDocsPrefix: '',
        swaggerUi: '/docs',
        swaggerUiPrefix: ''
    },
    oasSecurity: false,
    oasAuth: false,
    ignoreUnknownFormats: true
};
>>>>>>> da45ad2dfacda9dfe0eeb4cba5ce6603f33075c3

// oasTools.configure(options_object);

// Server Setup
const router = express();
const port = 5000;

<<<<<<< HEAD
// oasTools.initialize(oasDoc, router, () => { // oas-tools version
=======
router.use(fileUpload({
    createParentPath: true
}));

router.use(express.json());

// @ts-ignore
router.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: {
            name: err.name,
            message: err.message,
            data: err.data,
        },
    });
});

oasTools.initialize(oasDoc, router, () => { // oas-tools version
>>>>>>> da45ad2dfacda9dfe0eeb4cba5ce6603f33075c3
    applyMiddleware(middleware, router);
    const server = http.createServer(router);
    server.listen(port, () => {
        let addr = server.address();
        let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
        console.log(`Listening on ${bind}`);
    });
// });

