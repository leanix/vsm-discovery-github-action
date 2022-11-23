require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 301:
/***/ ((module) => {

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

/***/ }),

/***/ 225:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const axios = (__nccwpck_require__(141)["default"]);

async function authenticate(host, token) {
    const encodedToken = Buffer.from(`apitoken:${token}`).toString('base64');
    const data = new URLSearchParams({ grant_type: 'client_credentials' }).toString();
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
        console.error('Failed to authenticate using provided technical user token.. terminating');
        throw new Error('Failed to authenticate using system token.. terminating');
    }
}


module.exports = {authenticate}

/***/ }),

/***/ 836:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 800:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 141:
/***/ ((module) => {

module.exports = eval("require")("axios");


/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(836);
const github = __nccwpck_require__(800);
const {authenticate} = __nccwpck_require__(225)
const {registerService} = __nccwpck_require__(301)
const fs = __nccwpck_require__(147);

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
})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map