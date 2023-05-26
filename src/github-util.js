const github = require("@actions/github");

function getGitHubRepoName() {
  return github.context.repo.repo;
}

function getGitHubOrgName() {
  return github.context.repo.owner;
}

async function getGitHubRepoId() {
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
  const owner = github.context.repo.owner
  const repoName = github.context.repo.repo

  const response = await octokit.graphql(
    `
    {
      repository(owner:"${owner}", name:"${repoName}") {
        id
      }
    }
    `
  );

  console.log("Response: " + response);

  return response.repository.id;
}

module.exports = { getGitHubOrgName, getGitHubRepoName, getGitHubRepoId };
