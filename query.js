const ObjectID = require('mongodb').ObjectID;

class Query {
    constructor() { this.query = {} }
    addParam(prop, val) {
        if (prop && val) {
        this.query[prop] = (prop === '_id') ? new ObjectID(val) : val;
        }
    }
    get obj() { return this.query; }
}

module.exports = Query;