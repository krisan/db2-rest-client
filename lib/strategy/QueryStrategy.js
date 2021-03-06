const debug = require('debug')('db2-rest-client:cli');
const JobStrategy = require('./JobStrategy');

class QueryStrategy extends JobStrategy {

    async execute() {
        await super.execute();
        return await this.getClient().query(this.args['query']);
    }

    isValid({query}) {
        const valid = query && typeof query === 'string' && query.length > 0;
        if (!valid) debug('Wrong/missing job argument');
        return valid;
    }
}

module.exports = QueryStrategy;
