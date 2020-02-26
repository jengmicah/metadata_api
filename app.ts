import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as dbUtil from "./postgres_connector";
import * as endpoints from './endpoints';

class App {

    public express: express.Application;

    // array to hold users
    users: any[];

    constructor() {
        // @ts-ignore
        this.express = express();
        this.middleware();
        this.routes();
        this.users = [{firstName: "fnam1", lastName: "lnam1", userName: "username1"}];
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: false}));
    }

    private routes(): void {

        this.express.get('/', (req, res, next) => {
            res.status(200).send("Typescript App working!!!");
        });

        // request to get all the users
        this.express.post(endpoints.get_account, (req, res, next) => {
            console.log('url:::::::::::::', req.url);
            let reqbody = req.body;
            dbUtil.sqlToDB(reqbody['query'], []).then(data => {
                let result = data.rows;
                res.status(200).json({message: result});
            }).catch(err => {
                throw new Error(err)
            });
        });

    }
}

export default new App().express;