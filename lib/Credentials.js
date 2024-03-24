class IgCredentials {
    /** @type {string} */
    #igAppId;

    /** @type {string} */
    #dsUserId;

    /** @type {string} */
    #sessionId;

    /**
     * @param {string} dsUserId 
     * @param {string} sessionId 
     * @param {string} igAppId 
     */
    setCredentials(dsUserId, sessionId, igAppId) {
        this.#dsUserId = dsUserId;
        this.#sessionId = sessionId;
        this.#igAppId = igAppId;
    }

    get headers() {
        return {
            cookie: `ds_user_id=${this.#dsUserId}; sessionid=${this.#sessionId};`,
            "x-ig-app-id": this.#igAppId
        }
    }
}

const Credentials = new IgCredentials();

module.exports = Credentials;