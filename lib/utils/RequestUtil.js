const request = require('request');

class RequestResult {
    /**
     *
     * @param {number} statusCode
     * @param {string} responseText
     * @param {boolean} networkError
     */
    constructor(statusCode, responseText, networkError) {
        this.statusCode = statusCode;
        this.responseText = responseText;
        this.networkError = networkError;
    }

    getStatusCode() {
        return this.statusCode;
    }

    isError() {
        return this.statusCode !== 200 || this.networkError;
    }

    isNetworkError() {
        return this.networkError;
    }

    text() {
        return this.responseText;
    }

    json() {
        return JSON.parse(this.responseText);
    }

    /**
     *
     * @param {number} code
     * @param {function} callback
     */
    onStatus(code, callback) {
        if(this.statusCode === code) {
            callback();
        }
    }
}

class Request {

    #onStartCallback = function() {};
    #onEndCallback = function() {};
    #onErrorCallback = function() {};
    #onSuccessCallback = function() {};

    #prefix_error = "[Request Error]";

    /**
     *
     * @param {string} url
     * @param {RequestMethods} method
     */
    constructor(url, method) {
        this.url = url;
        this.method = method;
        this.query = {};
        this.body = {};
        this.headers = {};
        this.files = {};
        this.cooldown = 0;
    }

    /**
     *
     * @param {function} callback
     * @returns {Request}
     */
    onStart(callback) {
        this.#onStartCallback = callback;

        return this;
    }

    /**
     *
     * @param {function(RequestResult)} callback
     * @returns {Request}
     */
    onEnd(callback) {
        this.#onEndCallback = callback;

        return this;
    }


    /**
     * Sets cooldown before making a request
     * @param {number} cooldown in milliseconds
     * @returns {Request}
     */
    setCooldown(cooldown) {
        this.cooldown = cooldown;

        return this;
    }

    /**
     * Sets function that will be called if occurred error
     * @param {function(RequestResult)} callback 
     * @returns {Request}
     */
    onError(callback) {
        this.#onErrorCallback = callback;

        return this;
    }

    /**
     * Sets function that will be called if request was successfull
     * @param {function(RequestResult)} callback 
     * @returns {Request}
     */
    onSuccess(callback) {
        this.#onSuccessCallback = callback;

        return this;
    }

    /**
     *
     * @return {Promise<RequestResult>}
     */
    async doRequest() {
        if(this.cooldown > 0) {
            await new Promise((res) => setTimeout(() => res(), this.cooldown));
        }

        const requestData = {};
        if(this.url === undefined) {
            console.log(`${this.#prefix_error}Request url is undefined`);

            return new RequestResult(0, null, true);
        }

        let url = this.url;

        if(this.method === undefined) {
            console.log(`${this.#prefix_error}Request method is undefined (${this.url})`);

            return new RequestResult(0, null, true);
        }

        if(this.method === "get") {
            url += `?${Object.keys(this.query).map(e => { return `${e}=${this.query[e]}` }).join("&")}`
        }

        requestData.url = url;
        requestData.method = this.method;
        requestData.headers = this.headers;

        const bodyExists = Object.keys(this.body).length > 0;
        const filesExists = Object.keys(this.files).length > 0;

        if(filesExists && bodyExists) {
            console.log(`${this.#prefix_error}Cannot send files and body data at the same time`);

            return new RequestResult(0, null, true)
        }

        if(bodyExists) {
            requestData.body = this.body;

            if(!("headers" in requestData)) requestData.headers = {};

            requestData.headers["Content-Type"] = "application/json";
        } else if(filesExists) {
            const formData = new FormData();

            for(const [key, value] of Object.entries(this.files)) {
                formData.append(key, value)
            }

            requestData.formData = formData;
        }

        this.#onStartCallback();

        return await new Promise((resolve, reject) => {
            request(requestData, async (err, response, text) => {
                if(err) {
                    const requestResult = new RequestResult(0, null, true);

                    this.#onErrorCallback(requestResult);

                    reject(err);

                    return requestResult;
                }


                const requestResult = new RequestResult(
                    response.statusCode,
                    text,
                    (response.statusCode === 0)
                );

                this.#onEndCallback(requestResult);

                if(!requestResult.isError()) {
                    this.#onSuccessCallback(requestResult);
                }

                resolve(requestResult);
            });
        });
    }

    /**
     *
     * @param {object} query
     * @return {Request}
     */
    setQuery(query) {
        this.query = query;

        return this;
    }

    /**
     *
     * @param {object} headers
     * @returns {Request}
     */
    setHeaders(headers) {
        this.headers = headers;

        return this;
    }

    /**
     *
     * @param {object} body
     * @returns {Request}
     */
    setBody(body) {
        this.body = body;

        return this;
    }

    /**
     *
     * @param {object} files
     * @returns {Request}
     */
    setFiles(files) {
        this.files = files;

        return this;
    }
}

module.exports = {
    Request,
    RequestResult
}