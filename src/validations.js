const fs = require("fs");
const core = require("@actions/core");

function validateInputs(inputs) {
  const { token, data, sbomFilePath, host } = inputs;

  if (host && host.startsWith("http")) {
    throw new Error(
      "Please enter vsm workspace base url without any suffix. Invalid host input"
    );
  }

  if (!token) {
    throw new Error(
      "Could not find api-token in your secrets. Generate the token from the VSM workspace under technical users tab."
    );
  }

  if (!sbomFilePath || !fs.existsSync(`${sbomFilePath}`)) {
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

module.exports = { validateInputs };
