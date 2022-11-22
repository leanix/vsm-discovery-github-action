// const formData = new FormData();


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


module.exports = {registerService}