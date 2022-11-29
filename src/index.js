const core = require("@actions/core");
const fs = require("fs");

const { authenticate } = require("./mtm");
const { registerService } = require("./discovery-api-client");
const { validateInputs } = require("./validations");
const {
  getGitHubOrgName,
  getGitHubRepoName,
} = require("./github-util");

// start
let dryRun = core.getInput("dry-run");
dryRun = !(dryRun === "false");
const host = core.getInput("host");
const token = core.getInput("api-token");
const sbomFilePath = core.getInput("sbom-path");
const data = core.getInput("additional-data");
const name = core.getInput("service-name");
const description = core.getInput("service-description");
const sourceType = core.getInput("source-type");
const sourceInstance = core.getInput("source-instance");

main(dryRun, {
  host,
  token,
  sbomFilePath,
  data,
  name,
  description,
  sourceType,
  sourceInstance,
})
  .then()
  .catch((e) =>
    core.setFailed(`Failed to register service. Error: ${e.message}`)
  );

function getSbomFile(sbomFilePath) {
  const _sbomFilePath = `.${sbomFilePath}`;
  try {
    // validate if the file is a valid sbom json file
    let file = fs.readFileSync(_sbomFilePath, "utf-8");
    JSON.parse(file);
  } catch (e) {
    core.warning(`Invalid CycloneDX SBOM json file. Error: ${e.message}`);
    return null;
  }

  return fs.createReadStream(_sbomFilePath);
}

async function main(dryRun, inputs) {
  validateInputs(inputs);

  const {
    token,
    host,
    sbomFilePath,
    data,
    name,
    sourceInstance,
    description,
  } = inputs;
  const axios = await authenticate(host, token);
  
  const sbomFile = getSbomFile(sbomFilePath);
  const serviceName = name || getGitHubRepoName();
  const serviceDescription =
    description ||
    `This service has been brought in by the GitHub action (${getGitHubRepoName()})`;
  const _sourceInstance = sourceInstance || getGitHubOrgName();
  const _data = data && typeof data === "string" ? data : "{}";

  const id = `${serviceName}`

  core.info(`Auto-generated service Id [ {service-name} ]: ${id}`);

  const withOverrideDefaults = {
    ...inputs,
    id,
    name: serviceName,
    sourceInstance: _sourceInstance,
    description: serviceDescription,
    data: _data,
  };

  if (dryRun) {
    core.info("Valid!");
    console.log(withOverrideDefaults);
  } else {
    await registerService(axios, withOverrideDefaults, sbomFile);
  }
}
