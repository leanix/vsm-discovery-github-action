const core = require('@actions/core');
const github = require('@actions/github');
const fs = require("fs");
const axios = require('axios').default;

function getSbomFile(sbomFilePath) {
    console.log("Getting generated sbom file");
    if (!sbomFilePath || !fs.existsSync(sbomFilePath)) {
        core.warning("Could not find dependency file");
        return null;
    }

    try { // validate if the file is a valid sbom json file
        let file = fs.readFileSync(sbomFilePath, 'utf-8');
        JSON.parse(file)
    } catch (e) {
        core.warning(`Invalid CycloneDX SBOM json file. Error: ${e.message}`);
        return null;
    }

    return fs.createReadStream(sbomFilePath);
}

function getGitHubRepoName() {
    return github.event.repository.name
}

function getGitHubRepoDescription() {
    return github.event.repository.description
}

function getGitHubOrgName() {
    return github.event.repository.organization.name
}

function validateInputs(inputs) {
    const {token} = inputs

    if(!token) {
        throw new Error('Please add LXVSM_TECHNICAL_USER_TOKEN in your secrets. Generate the token from the VSM workspace under technical users tab.')
    }
    // todo complete
}

async function authenticate(host, token) {
    const encodedToken = Buffer.from(`apitoken:${token}`).toString('base64');
    const data = new URLSearchParams({grant_type: 'client_credentials'}).toString();
    try {
        const res = await axios.post(`https://${host}/services/mtm/v1/oauth2/token`, data, {
            headers: {
                Authorization: `Basic ${encodedToken}`,
                'content-type': 'application/x-www-form-urlencoded'
            }
        });

        console.info(`Successfully generated JWT token.`);

        return axios.create({
            baseURL: `https://eu-vsm.leanix.net/services/vsm/discovery/v1`,
            headers: {
                Authorization: `Bearer ${res.data.access_token}`
            }
        });
    } catch (e) {
        console.error(`Failed to authenticate using provided technical user token. Error: ${e.message}`);
        throw new Error('Failed to authenticate using system token. Make sure correct token is passed');
    }
}

function registerService(axios, {id, sbomFile, sourceType, sourceInstance, name, description,}) {
    console.log(`Registering service and SBOM with following details. id: ${id}, sourceType: ${sourceType}, sourceInstance: ${sourceInstance}, name: ${name}, description: ${description}`)

    return Promise.resolve()
    // const options = createConnectorCallInit(host, bearerToken);
    // const formData = new FormData();
    // formData.append("id", id);
    // formData.append("sourceType", sourceType);
    // formData.append("sourceInstance", sourceInstance);
    // formData.append("name", name);
    // formData.append("description", description);
    // // formData.append("data", JSON.stringify(data));
    // formData.append("bom", sbomFile);
    //
    // return new Promise((resolve, reject) => {
    //     const req = formData.submit(options, (err, res) => {
    //         if (err) {
    //             console.error(`Http-response to discovery API was not ok. http status response: ${res.statusCode}. Error message: ${err.message}`);
    //             return reject(new Error(err.message));
    //         }
    //         if (res.statusCode < 200 || res.statusCode > 299) {
    //             return reject(new Error(`HTTP status code ${res.statusCode}`));
    //         }
    //         const body = [];
    //         res.on("data", (chunk) => body.push(chunk));
    //         res.on("end", () => {
    //             const resString = Buffer.concat(body).toString();
    //             resolve(resString);
    //         });
    //     });
    // })
    //     .then((result) => {
    //         return result;
    //     })
    //     .catch((reason) => {
    //         console.error("Couldn't access the API");
    //         throw new Error(reason);
    //     });
}


async function main(inputs) {
    validateInputs(inputs)

    const {token, host, sbomFilePath,} = inputs
    const axios = await authenticate(token, host)

    // todo get from inputs over defauls
    const serviceName = getGitHubRepoName()
    const sourceInstance = getGitHubOrgName()
    const sourceType = 'cicd'
    const defaults = {
        id: `${sourceType}-${sourceInstance}-${serviceName}`,
        sourceType,
        sourceInstance,
        name: serviceName,
        description: getGitHubRepoDescription()
    }
    const withOverrideDefaults = {
        ...defaults,
        ...inputs
    }

    await registerService(axios, {
        ...withOverrideDefaults,
        sbomFile: getSbomFile(sbomFilePath)
    })
}

const host = core.getInput('host');
const token = core.getInput('api-token');
const sbomFilePath = core.getInput('sbom-path');
// const serviceName = core.getInput('sbom-path');
console.log('host', host)
console.log('sbomFilePath', sbomFilePath)
console.log('token', token)
main({host, token, sbomFilePath}).then().catch(e => core.setFailed(`Failed to register service. Error: ${e.message}`))