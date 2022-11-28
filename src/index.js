const core = require("@actions/core");
const fs = require("fs");

const { authenticate } = require("./mtm");
const { registerService } = require("./discovery-api-client");
const { getGitHubOrgName, getGitHubRepoName, getRepoId } = require("./github-util");

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

function validateInputs(inputs) {
  const { token, data } = inputs;

  if (!token) {
    throw new Error(
      "Could not find api-token in your secrets. Generate the token from the VSM workspace under technical users tab."
    );
  }

  if (!sbomFilePath || !fs.existsSync(`.${sbomFilePath}`)) {
    core.warning(
      "Could not find SBOM file. Follow the documentation in README.md to learn how to generate SBOM file."
    );
  }

  if (data && typeof data === "string") {
    try {
      JSON.parse(data);
    } catch (_) {
      throw new Error(
        `additional-data field is not valid json (formatted to string)`
      );
    }
  }
}

async function main(dryRun, inputs) {
  validateInputs(inputs);

  const {
    token,
    host,
    sbomFilePath,
    sourceType,
    data,
    name,
    sourceInstance,
    description,
  } = inputs;
  const axios = await authenticate(host, token);

  const sbomFile = getSbomFile(sbomFilePath);
  const id = getRepoId()
  const serviceName = name || getGitHubRepoName();
  const serviceDescription =
    description ||
    `This service has been brought in by the GitHub action (${getGitHubRepoName()})`;
  const _sourceInstance = sourceInstance || getGitHubOrgName();
  const _data = data && typeof data === "string" ? data : "{}";

  // const id = `${sourceType}-${_sourceInstance}-${serviceName}`;
  core.info(
    `Auto-generated service Id [ {source-type}-{source-instance}-{service-name} ]: ${id}`
  );

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
    await registerService(
      axios,
      {
        ...withOverrideDefaults,
      },
      sbomFile
    );
  }
}
