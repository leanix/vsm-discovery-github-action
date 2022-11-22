const base64 = require("base-64");
const fetch = require("node-fetch");

function createAPIAccessTokenRequestInit(secret) {
    const headers = new fetch.Headers();
    headers.append(
        "Authorization",
        "Basic " + base64.encode("apitoken:" + secret)
    );
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return {
        method: "post",
        auth: {
            user: "apitoken",
            password: secret,
        },
        body: "grant_type=client_credentials",
        headers: headers,
        json: true,
    };
}

function authenticate(token, host) {
    return fetch(
        "https://" + host + "/services/mtm/v1/oauth2/token",
        createAPIAccessTokenRequestInit(token)
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    "Http-response was not ok - http status response: " +
                    response.status +
                    " " +
                    response.statusText
                );
            }
            return response.json();
        })
        .then((json) => {
            return json.access_token;
        })
        .catch((reason) => {
            console.error("Couldn't get API-Token!");
            throw new Error(reason);
        });
}

module.exports = {authenticate}