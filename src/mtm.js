const axios = require("axios");
const jwt_decode = require("jwt-decode");

function getVsmUrl(decoded) {
  const iss = decoded.iss;
  switch (iss) {
    case "https://eu-svc.leanix.net":
      return "eu-vsm.leanix.net";
    case "https://us-svc.leanix.net":
      return "us-vsm.leanix.net";
    case "https://ca-svc.leanix.net":
      return "ca-vsm.leanix.net";
    case "https://au-svc.leanix.net":
      return "au-vsm.leanix.net";
    case "https://de-svc.leanix.net":
      return "de-vsm.leanix.net";
    case "https://ch-svc.leanix.net":
      return "ch-vsm.leanix.net";
    default:
      return new Error(
        "Unable to register service. Error: Unable to identify the VSM host"
      );
  }
}

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

    const bearerToken = res.data.access_token;

    const vsmHost = getVsmUrl(jwt_decode(bearerToken));

    return axios.create({
      baseURL: `https://${vsmHost}/services/vsm/discovery/v1`,
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "X-Lx-Vsm-Discovery-Source": "vsm-discovery-github-action",
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
