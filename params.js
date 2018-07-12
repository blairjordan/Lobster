const ObjectID = require('mongodb').ObjectID;

class Params {
    constructor() { this.query = {} }
    addParam(prop, val, isObjectId = false) {
        if (prop && val) {
            this.query[prop] = (prop === '_id' || isObjectId) ? new ObjectID(val) : val;
        }
    }
    generateID(prop) {
        this.query['_id'] = new ObjectID();
    }
    get obj() { return this.query; }
}

module.exports = Params;