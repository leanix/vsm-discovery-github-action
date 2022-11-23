const core = require('@actions/core');
const fs = require("fs");

const {authenticate} = require("./mtm")
const {registerService} = require("./discovery-api-client")
const {getGitHubOrgName, getGitHubRepoName} = require("./github-util")

// start
const host = core.getInput('host');
const token = core.getInput('api-token');
const sbomFilePath = core.getInput('sbom-path');
const data = core.getInput('additional-data');
const serviceName = core.getInput('service-name');
const serviceDescription = core.getInput('service-description');
const sourceType = core.getInput('source-type');

main({
    host,
    token,
    sbomFilePath,
    data,
    serviceName,
    serviceDescription,
    sourceType
}).then().catch(e => core.setFailed(`Failed to register service. Error: ${e.message}`))

function getSbomFile(sbomFilePath) {
    const _sbomFilePath = `.${sbomFilePath}`
    try { // validate if the file is a valid sbom json file
        let file = fs.readFileSync(_sbomFilePath, 'utf-8');
        JSON.parse(file)
    } catch (e) {
        core.warning(`Invalid CycloneDX SBOM json file. Error: ${e.message}`);
        return null;
    }

    return fs.createReadStream(_sbomFilePath);
}

function validateInputs(inputs) {
    const {token, data} = inputs

    if (!token) {
        throw new Error('Please add LXVSM_TECHNICAL_USER_TOKEN in your secrets. Generate the token from the VSM workspace under technical users tab.')
    }

    if (!sbomFilePath || !fs.existsSync(`.${sbomFilePath}`)) {
        core.warning("Could not find SBOM file. Follow the documentation in README.md to learn how to generate SBOM file.");
    }

    // if(typeof data === 'string') {
    //     try {
    //         JSON.parse(data)
    //     } catch (_) {
    //         throw new Error(`additional-data field is not valid json (formatted to string)`)
    //     }
    // }
}

async function main(inputs) {
    validateInputs(inputs)

    const {token, host, sbomFilePath, sourceType, data} = inputs
    const axios = await authenticate(host, token)

    const sbomFile = getSbomFile(sbomFilePath)
    const serviceName = getGitHubRepoName()
    const sourceInstance = getGitHubOrgName()
    const _data = data ? data : "{}"

    const id =`${sourceType}-${sourceInstance}-${serviceName}`
    core.info(`Auto-generated service Id: ${id}`)

    const defaults = {
        id,
        sourceType,
        sourceInstance,
        name: serviceName,
        data: _data
    }
    const withOverrideDefaults = {
        ...defaults,
        ...inputs
    }

    await registerService(axios, {
        ...withOverrideDefaults,
        sbomFile
    })
}