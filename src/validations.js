import fs from "fs";
import core from "@actions/core";

function validateInputs(inputs) {
  const { token, data, githubToken, sbomFilePath } = inputs;

  if (!githubToken) {
    throw new Error("Could not find github-token in your secrets or inputs.");
  }

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

module.exports = { validateInputs };
