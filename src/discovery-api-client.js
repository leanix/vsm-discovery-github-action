const FormData = require("form-data");

function registerService(axios, {id, sourceType, sourceInstance, name, description, data}, sbomFile) {
    console.log(`Registering service and SBOM with following details. id: ${id}, sourceType: ${sourceType}, sourceInstance: ${sourceInstance}, name: ${name}, description: ${description}`)

    const formData = new FormData();
    formData.append("id", id);
    formData.append("sourceType", sourceType);
    formData.append("sourceInstance", sourceInstance);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("data", data);
    if(sbomFile !== null) {
        formData.append("bom", sbomFile);
    }

    return axios.post('/service', formData)
}

module.exports = {registerService}