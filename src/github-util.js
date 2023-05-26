const github = require("@actions/github");
const core = require("@actions/core");

function getGitHubRepoName() {
  return github.context.repo.repo;
}

function getGitHubOrgName() {
  return github.context.repo.owner;
}

function getGitHubRepoId() {
  // core.info("##############################")
  // const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
  // core.info("token: " + process.env.GITHUB_TOKEN);
  //
  // const query = `
  //   {
  //     repository(owner:"${github.context.repo.owner}", name:"${github.context.repo.repo}") {
  //       id
  //     }
  //   }
  //   `;
  // core.info("Query: " + query);
  //
  // const response = await octokit.graphql();
  //
  // core.info("Response: " + response);

  return "response.repository.id";
}

module.exports = { getGitHubOrgName, getGitHubRepoName, getGitHubRepoId };
