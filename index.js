const Client = require('./lib/Client');
const Credentials = require('./lib/Credentials');

require('dotenv').config();

const { DS_USER_ID, SESSION_ID, IG_APP_ID } = process.env;

Credentials.setCredentials(DS_USER_ID, SESSION_ID, IG_APP_ID);

(async () => {
    const user = await Client.users.getByUsername("technic.exe");
})();