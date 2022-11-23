### VSM Discovery GitHub action

### Usage

Generate and store LeanIX technical user token in GitHub repository secrets (LXVSM_TECHNICAL_USER_TOKEN)

```yaml
      - name: Checkout
        uses: actions/checkout@v3

      - name: VSM discovery
        uses: leanix/vsm-discovery-github-action@main
        with:
          api-token: ${{ secrets.LXVSM_TECHNICAL_USER_TOKEN }}
```

#### Inputs (defaults and recommendations)

#### `host`
**Required** The LeanIX host where the connector is located, e.g.: eu.leanix.net

**Default:** eu.leanix.net

#### `api-token`
**Required** technical user token for VSM workspace

#### `service-name`
Name of the service. By default name of the repository is assumed.

**Default:** repository name. example: vsm-discovery-github-action

#### `service-description`
The description of the service.

**Default:** repository name. example: vsm-discovery-github-action

#### `source-type`
The source system of the service e.g. CI/CD

**Default:** cicd

**Recommendation:** Use the default so that all the services in the same organisation are grouped under the same source in VSM. Only override if you know what you are doing!

#### `source-instance`
The individual instance within the source system. By default GitHub organisation same is picked.

**Default:** Organisation name, example: leanix

**Recommendation:** Use the default so that all the services in the same organisation are grouped under the same source in VSM. Only override if you know what you are doing!

#### `sbom-path`
The location of the SBOM file that is generated in CycloneDX specification. Accepted only JSON format. Read me about in the documentation for generating the SBOM file correctly. By default bom.json (path: /bom.json) is attempted in the root folder.

**Default:** /bom.json

**Recommendation:** Generate the SBOM file during the same CI/CD to ensure the data is up-to-date

#### `additional-data`
A key-value object holding any additional metadata about the service you want to bring into VSM.

#### `dry-run`
Validates the inputs without actually submitting the data to VSM

**Default:** false

**Recommendation:** Dry run at-least once to understand the values that are generated


### How to generate SBOM?
Follow [this](https://docs-vsm.leanix.net/docs/setting-up-the-cyclonedx-sbom-generation) documentation for details

 