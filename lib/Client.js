const UserRequests = require("./objects/requests/UserRequests");

class IgClient {
    constructor() {
        this.users = new UserRequests();
    }
}

const Client = new IgClient();

module.exports = Client;