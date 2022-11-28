const axios = require("axios");

async function authenticate(host, token) {
  const encodedToken = Buffer.from(`apitoken:${token}`).toString("base64");
  const data = new URLSearchParams({
    grant_type: "client_credentials",
  }).toString();
  try {
    const res = await axios.post(
      `https://${host}/services/mtm/v1/oauth2/token`,
      data,
      {
        headers: {
          Authorization: `Basic ${encodedToken}`,
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.info(`Successfully generated JWT token.`);

    return axios.create({
      baseURL: `https://eu-vsm.leanix.net/services/vsm/discovery/v1`,
      headers: {
        Authorization: `Bearer ${res.data.access_token}`,
        'X-Source': 'vsm-discovery-github-action'
      },
    });
  } catch (e) {
    console.error(
      `Failed to authenticate using provided technical user token. Error: ${e.message}`
    );
    throw new Error(
      "Failed to authenticate using system token. Make sure correct token is passed"
    );
  }
}

module.exports = { authenticate };
