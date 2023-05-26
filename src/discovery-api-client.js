const FormData = require("form-data");
const core = require("@actions/core");

function registerService(
  axios,
  { id, repoId, sourceType, sourceInstance, name, description, data },
  sbomFile
) {
  core.info(
    `Registering service and SBOM with following details. id: ${id}, repoId: ${repoId}, sourceType: ${sourceType}, sourceInstance: ${sourceInstance}, name: ${name}, description: ${description}`
  );

  const formData = new FormData();
  formData.append("id", id);
  formData.append("repoId", repoId);
  formData.append("sourceType", sourceType);
  formData.append("sourceInstance", sourceInstance);
  formData.append("name", name);
  formData.append("description", description);
  formData.append("data", data);
  if (sbomFile !== null) {
    formData.append("bom", sbomFile);
  }

  return axios.post("/service", formData);
}

module.exports = { registerService };
