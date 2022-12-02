### VSM Discovery GitHub Action
This action helps to provide a [CycloneDX SBOM](https://cyclonedx.org/specification/overview/) JSON file to [LeanIX VSM](https://docs-vsm.leanix.net/docs/software-bill-of-materials). It can also easily be extended to integrate with the SBOM generation so that generation and provision are automated.

### Usage

Generate and store LeanIX technical user token in GitHub repository secrets (LXVSM_TECHNICAL_USER_TOKEN)

```yaml
      - name: Checkout
        uses: actions/checkout@v3

      - name: VSM discovery
        uses: leanix/vsm-discovery-github-action@v1.0.0
        with:
          api-token: ${{ secrets.LXVSM_TECHNICAL_USER_TOKEN }}
```

#### Inputs (defaults and recommendations)

#### `host`
**Required** The LeanIX host base url of your workspace, e.g.: leanix.leanix.net

**Default:** `eu.leanix.net`

![Screenshot 2022-11-30 at 12 12 08 PM](https://user-images.githubusercontent.com/64901333/204726299-1d41de31-5cce-43cd-a684-314e77a4dcf0.png)

#### `api-token`
**Required** technical user token for VSM workspace

#### `service-name`
Name of the service. By default name of the repository is assumed.

**Default:** repository name. example: vsm-discovery-github-action

#### `service-description`
The description of the service.

**Default:** example: This service has been brought in by the GitHub action (vsm-discovery-github-action)

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

**Default:** `/bom.json`

**Recommendation:** Generate the SBOM file during the same CI/CD to ensure the data is up-to-date. Even if the SBOM file is not found the service registration will go through.

#### `additional-data`
A key-value object holding any additional metadata about the service you want to bring into VSM.

**example:** 
```json
  {
    "number_of_incidents":"2",
    "tech_stack":"Python",
    "usage":"internal"
  }
```

#### `dry-run`
Validates the inputs without actually submitting the data to VSM

**Default:** false

**Recommendation:** Dry run at-least once to understand the values that are generated


### How to generate the CycloneDX SBOM?
Follow [this](https://docs-vsm.leanix.net/docs/setting-up-the-cyclonedx-sbom-generation) documentation for details for the main package managers.

 ### Scenarios

 #### Setup for a Java/Gradle project

**Note**: For this example to work you will need to add the [plugin](https://docs-vsm.leanix.net/docs/setting-up-the-cyclonedx-sbom-generation#gradle--kotlin) in your `build.gradle` or `settings.gradle.kts`.

```yaml
name: Generate and register service

on:
  push:
    branches:
      - main

jobs:
  post-deploy:
      name: Post Deployment
      runs-on: ubuntu-latest
      steps:
          - name: Checkout
             uses: actions/checkout@v3

          - name: Set up JDK temurin 17
            uses: actions/setup-java@v3
            with:
              distribution: 'temurin'
              java-version: '17'

          - name: Run gradlew cyclonedxBom task
            uses: gradle/gradle-build-action@v2
            with:
              build-root-directory: .
              arguments: cyclonedxBom

           # Invoke the GitHub action to register the service with SBOM
           - name: VSM discovery
             uses: leanix/vsm-discovery-github-action@v1
             with:
                api-token: ${{ secrets.VSM_LEANIX_API_TOKEN }}
              # dry-run: true
```

#### Setup for a NodeJS project

**Note**: This example uses this [CycloneDX plugin](https://docs-vsm.leanix.net/docs/setting-up-the-cyclonedx-sbom-generation#npm).

```yaml
name: Generate and register service

on:
  push:
    branches:
      - main

jobs:
  post-deploy:
      name: Post Deployment
      runs-on: ubuntu-latest
      steps:
        - name: Setup Node ${{ env.NODE_VERSION }} Environment
            uses: actions/setup-node@v1
            with:
              node-version: ${{ env.NODE_VERSION }}
        
        # Use the respective command to generate SBOM file
        - name: Generate SBOM
            run:  |
                npm install --global @cyclonedx/cyclonedx-npm
                cyclonedx-npm --output-file "bom.json"
        
        # Invoke the GitHub action to register the service with SBOM
        - name: VSM discovery
          uses: leanix/vsm-discovery-github-action@v1
          with:
            api-token: ${{ secrets.VSM_LEANIX_API_TOKEN }}
          # dry-run: true
```
