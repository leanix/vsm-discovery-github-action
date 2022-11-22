const core = require('@actions/core');
const github = require('@actions/github');
const {authenticate} = require('./mtm')
const {registerService} = require('./discovery-api')
const fs = require("fs");

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
    // todo complete
}


async function main(inputs) {
    const {token, host, sbomFilePath, } = inputs
    const bearerToken = await authenticate(token, host)

    const serviceName = getGitHubRepoName()
    const sourceInstance = getGitHubOrgName()
    const sourceType = 'cicd'
    const defaults = {
        id: `${sourceType}-${sourceInstance}-${serviceName}`, sourceType, sourceInstance, name: serviceName, description: getGitHubRepoDescription()
    }
    const withOverrideDefaults = {
        ...defaults,
        ...inputs
    }

    await registerService(host, bearerToken, {
        ...withOverrideDefaults,
        sbomFile: getSbomFile(sbomFilePath)
    })
}

main({}).then()