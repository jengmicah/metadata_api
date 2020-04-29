# Analytics Metadata Aggregator API
NodeJS Typescript Express API application for the analytics metadata aggregator project. The application is written in TypeScript.

## Setting up environment for local development and running

Some initial set up is needed to run these applications. First, we need to install node.

### Install Node on Mac

Open your Terminal and enter the following to update Homebrew to see the latest versions:

`brew update`

Then, we install node itself:

`brew install node`

### Install Node on Windows

Open your Browser and navigate to https://nodejs.org/en/download/
Download the executable for windows and run it

### Prepare Repo

Clone repo <br>`git clone https://msi-cto.visualstudio.com/analytics-metadata-aggregator/_git/aggregator-api`

Navigate to your clone of the repo <br>`cd aggregator-api`.

Update to latest code with <br>`git pull`

### Install Node Modules for the project

Run `npm install`<br>
<br>If there is an issue with native packages:
<br>&nbsp;&nbsp;&nbsp;Run `npm install -g node-gyp`
<br>&nbsp;&nbsp;&nbsp;Run `npm install --global --production windows-build-tools`	(if windows OS)


### Install Postgresql for the database

Download the setup for your OS - https://www.postgresql.org/download/ and install it

Setup a `.env` file in the project root directory with the following configuration parameters
```
API_USER=<db_username>
API_DATABASE=<db_name>
API_DB_PASSWORD=<db_password>
API_HOST=<host>
API_PORT=<port>
```

#### Table Structure for `aggregated_metadata`
| Field              | Type                  | Description                                                                                                                       |
|--------------------|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| metadata_id        | `serial`, primary key | Serial                                                                                                                            |
| inputfilename      | `varchar(500)`        | **A:** Filename<br>**V:** Empty string                                                                                                       |
| mediatype          | `varchar(30)`         | **A:** A<br>**V:** V                                                                                                                         |
| generatortype      | `varchar(30)`         | **A:** characterized, classification, transcription<br>**V:** vulcan                                                  |
| metadata           | `jsonb`               | **A:** Audio output<br>**V:** Vulcan output                                                                                                  |
| version            | `varchar(30)`         | Defaults to `1.0` until specified                                                                                                   |
| ingested_date_time | `timestamp`           | Defaults to `current_timestamp`                                                                                                     |
| classfrequencies   | `jsonb`               | <pre>{}</pre>**A:** Empty string for all fields<br>**V:** Frequency of classes
| jobdetails         | `jsonb`               | <pre>{<br>&nbsp;&nbsp;&nbsp;'model_name': '',<br>&nbsp;&nbsp;&nbsp;'signedUrls': [''],<br>&nbsp;&nbsp;&nbsp;'jobID': ''<br>&nbsp;&nbsp;&nbsp;'module_names': ['']<br>}</pre>**A:** Empty string for all fields<br>**V:** Populate from "jobDetails" |

#### Create the `aggregated_metadata` table - 
```sql
create table aggregated_metadata (
    metadata_id serial primary key,
    inputfilename varchar(500) not null default '',
    mediatype varchar(30) not null default '',
    generatortype varchar(30) not null default '',
    metadata jsonb not null default '{}'::jsonb,
    version varchar(30) not null default 0.0,
    jobdetails jsonb not null default '{}'::jsonb,
    classfrequencies jsonb not null default '{}'::jsonb,
    ingested_date_time timestamp not null default current_timestamp
);
```

### Running the backend

Run `nodemon` in the terminal to start the server


### The folder structure is as follows:
```
api
   config
       - store database config and any other configurations here
   middleware
       - store any middleware configurations and setups here
   controllers
       - define services / api controllers here
   routes
       - define routes / api endpoints here
   utils
       - store database utility functions and any other common utility functions here
```

###### Config
```
    db_config.ts - contains postgresql database configurations
    README.md - add any information about configurations here
```

###### Middleware
```
    common.ts - handleCors, handleBodyRequestParsing, handleCompression definitions
    index.ts - exports the middleware definitions
    README.md - add any information about middleware here
```

###### Controllers
```
    queries.ts - contains a list of all parameterized queries
    ingestionController.ts - contains all functions and the handler for ingestion API
    queryController.ts - contains all functions and the handler for query API
```

###### Routes
```
    endpoints.ts - contains a list of endpoints
    apiRoutes.ts - configures routes with controllers
```

###### Utilities
```
    postgres_connector.ts - postgresql connector and database utilities
    index.ts - applyRoutes, applyMiddleware, other exports
    README.md - add any information about utilities here
```

### Endpoints

`/api/ingestmetadata`
<br>The endpoint links to a handler service which ingests json metadata provided to it in the form of either flat json or a list of pre-signed URLS

`/api/querymetadata/:mediatype`
<br>The endpoint links to a handler service which calls the appropriate function to execute the queries to filter metadata, based on the mediatype
