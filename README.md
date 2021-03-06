# db2-rest-client

Node.js client for IBM Db2 Warehouse on Cloud REST API (previously dashDB).
It is intended to be used for DevOps (administration, monitoring, data load) for DB2 on Cloud service.

The target APIs are covering the following main areas:

* Authentication
* Database Objects
* Data load
* SQL
* File Storage
* Monitoring
* Settings
* Users

## Installation

Installing the client locally and using it in a Node.JS application:

```
npm i db2-rest-client --save
```

## Usage

```javascript
const Db2RestClient = require('db2-rest-client');

try {
    const db2Client = new Db2RestClient({
        credentials: {
            userid: 'userId',
            password: 'password'
        },
        uri: 'https://<db2-on-cloud-hostname>/dbapi/v3'
    });

    // load data from a local file - request pooling
    const res = await db2Client.upload('./path/to/data.csv');
    // query 
    const data = await db2Client.query('SELECT ID, NAME FROM MYSCHEMA.MYTABLE_NAME');
    console.log(data);
} catch (err) {
    // debug code
}

```

## Methods

TBD

Check the /test/integration folder for examples of usage.

## Jobs

There are a set of CLI jobs that can be executed in an automation script and can be integrated with a CI runner (Jenkins/Travis).
The job is looking in the ENV variables for the DB2 credentials.

```shell
npm i -g db2-rest-client
```

### load

Loads a local CSV file into a target table.

```shell
export DB_USERID='<USERNAME>';export DB_PASSWORD='<PASSWORD>';export DB_URI='https://<hostname>/dbapi/v3';export DEBUG=db2-rest-client:cli;
db2-rest-client load --file=./test/data/sample1.csv --table='TST_SAMPLE' --schema='MANUAL' --type=INSERT
```

### load-in-place

Loads all the data in a new table created from the target and then replaces the target with the new table (renaming).

```shell
# default CSV file
db2-rest-client load-in-place --file=./test/data/sample2.csv --table='TST_SAMPLE' --schema='MANUAL'

# customize request - TSV file with header
db2-rest-client load-in-place --file=./test/data/sample3.tsv --table='TST_SAMPLE' --schema='MANUAL' --extra='{"body": { "file_options": {"has_header_row":"yes","column_delimiter":"0x09"}}}'

```

### query (only SELECT queries)

Executes an SQL query in sync mode and returns up to 10.000 rows of data in JSON format. Only SELECT queries are allowed by
DB2 api.

```shell
# example of output to a file
db2-rest-client query --query="SELECT * FROM MANUAL.TST_SAMPLE" > test.json
```

### batch

Executes a list of coma separated list of QUERIES.

```shell
db2-rest-client batch --query="INSERT INTO MANUAL.TST_SAMPLE (ID, DESCRIPTION) VALUES ('100', 'test'); SELECT * FROM MANUAL.TST_SAMPLE;" > test.json
```

## Integration Testing

Running integration tests against your DB2 on Cloud instance - the user needs access to create tables, execute queries, load data. The credentials can be found on the **IBM on Cloud > DB2 Service > Credentials** page. 

```
export DB_USERID='<userid>';export DB_PASSWORD='<password>';export DB_URI='https://<hostname>/dbapi/v3'; npm run integration
```

## Debugging

```
# all log levels
export DEBUG=db2-rest-client
# just info
export DEBUG=db2-rest-client:info
# all
export DEBUG=db2-rest-client:*
```

## Contribution

We are welcoming contributors - feel free to report issues, request features and help us improve the tool.

## References

* [IBM Db2 Warehouse on Cloud REST API](https://developer.ibm.com/static/site-id/85/api/db2whc-v3/)
* [IBM DB2 on Cloud](https://www.ibm.com/cloud/db2-on-cloud)
* [ibm_db module](https://www.npmjs.com/package/ibm_db)
