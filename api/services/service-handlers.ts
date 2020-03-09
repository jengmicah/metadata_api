import {Request, Response} from "express";
import * as endpoints from './endpoints';
import * as dbUtil from "../utils/postgres_connector";
import * as queries from './queries';
import * as formidable from 'formidable';
import * as fs from 'fs';
import path = require("path");
import request = require("request");
import {version} from "punycode";

const appDir = path.dirname(require.main.filename);

const ingestionHandler = async function (req: Request, res: Response) {
// check for content type of request
    const headers = req.headers;

    if (headers['content-type'].includes('json')) {
        let reqbody = req.body;
        let listURLs = reqbody['blobs'];

        for (const b of listURLs) {
            request(b, {json: true}, (err, resp, body) => {
                if (err) return console.log(err);

                // Initializing parameters for queries
                const data = body;
                const inputfilename = data['input_filename'];
                const blob = data['result'];
                let version = 1;
                if (Object.keys(data).indexOf('version') > 0) {
                    version = data['version'];
                }

                // Check for existing metadata for filename
                dbUtil.sqlToDB(queries.queryjsonblob, [inputfilename, version]).then(result => {
                    if (result['rows'].length > 0) {
                        // Update existing row
                        dbUtil.sqlToDB(queries.updatejsonblob, [inputfilename, version, JSON.stringify(blob)]).then(result => {
                            console.log('Updated');
                        }).catch(err => {
                            throw new Error(err)
                        });
                    } else {
                        // Add new row
                        let params = [inputfilename, 'A', 'ch', JSON.stringify(blob), version];
                        dbUtil.sqlToDB(queries.ingestjsonblob, params).then(data => {
                            console.log('Ingested');
                        }).catch(err => {
                            throw new Error(err)
                        });
                    }
                }).catch(err => {
                    throw new Error(err)
                });


            });
        }
    } else if (headers['content-type'].includes('form')) {
        var form = new formidable.IncomingForm();
        // form.uploadDir = this.directory;
        form.keepExtensions = true;
        form.type = 'multipart';

        form.parse(req);

        form.on('fileBegin', function (name, file) {
            file.path = appDir + '/uploads/' + file.name;
        });

        form.on('file', function (name, file) {
            console.log('Uploaded ' + file.name);

            // @ts-ignore
            const data = JSON.parse(fs.readFileSync(appDir + '/uploads/' + file.name));

            const inputfilename = data['input_filename'];
            const blob = data['result'];
            let version = 1;
            if (Object.keys(data).indexOf('version') > 0) {
                version = data['version'];
            }

            let params = [inputfilename, 'A', '', JSON.stringify(blob), version];
            dbUtil.sqlToDB(queries.ingestjsonblob, params).then(data => {
                console.log('Done ', file.name);
                const filepath = appDir + '/uploads/' + file.name;

                // Deleting files after data ingested
                fs.stat(filepath, function (err, stats) {
                    if (err) return console.log(err);

                    fs.unlink(filepath, function (err) {
                        if (err) return console.log(err);
                    });
                });
            }).catch(err => {
                throw new Error(err)
            });
        });
    }

    res.status(200).json({message: 'success'});
};

export default [
    {
        path: "/",
        method: "get",
        handler: async (req: Request, res: Response) => {
            res.send("Hello world !");
        }
    },
    {
        path: endpoints.getaccount,
        method: 'get',
        handler: async (req: Request, res: Response) => {
            dbUtil.sqlToDB(queries.getaccounts, []).then(data => {
                let result = data.rows;
                res.status(200).json({message: result});
            }).catch(err => {
                throw new Error(err)
            });
        }
    },
    {
        path: endpoints.addaccount,
        method: 'post',
        handler: async (req: Request, res: Response) => {
            let reqbody = req.body;
            let params = [reqbody['username'], reqbody['password'], reqbody['email']];
            dbUtil.sqlToDB(queries.addaccount, params).then(data => {
                let result = data.rows;
                res.status(200).json({message: result});
            }).catch(err => {
                throw new Error(err)
            });
        }
    },
    {
        path: endpoints.updateaccount,
        method: 'post',
        handler: async (req: Request, res: Response) => {
            let reqbody = req.body;
            console.log(reqbody);
            let params = [reqbody['user_id'], reqbody['username'], reqbody['password'], reqbody['email']];
            dbUtil.sqlToDB(queries.updateaccount, params).then(data => {
                let result = data.rows;
                res.status(200).json({message: result});
            }).catch(err => {
                throw new Error(err)
            });
        }
    },
    {
        path: endpoints.ingestmetadata,
        method: 'post',
        handler: ingestionHandler
    }
];