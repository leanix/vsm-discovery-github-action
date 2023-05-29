const github = require("@actions/github");

function getGitHubRepoName() {
  return github.context.repo.repo;
}

function getGitHubOrgName() {
  return github.context.repo.owner;
}

async function getGitHubRepoId() {
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

  const response = await octokit.graphql(`
    {
      repository(owner:"${github.context.repo.owner}", name:"${github.context.repo.repo}") {
        id
      }
    }
    `);

  return response.repository.id;
}

module.exports = { getGitHubOrgName, getGitHubRepoName, getGitHubRepoId };
